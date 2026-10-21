-- Customers order without accounts; only the store owner keeps sign-in.
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

GRANT INSERT ON public.orders TO anon;
GRANT SELECT ON public.store_payment_settings TO anon;

DROP POLICY IF EXISTS "Customers submit own orders" ON public.orders;
CREATE POLICY "Storefront order submission" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL AND payment_status = 'pending' AND status = 'ordered');

CREATE POLICY "Guest shoppers view payment instructions" ON public.store_payment_settings
  FOR SELECT TO anon USING (true);

-- Guests may upload their payment screenshot into the shared guest folder
-- and may view only the store's own QR image.
CREATE POLICY "Guests upload payment screenshots" ON storage.objects
  FOR INSERT TO anon WITH CHECK (
    bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = 'guest'
  );
CREATE POLICY "Guests view the store payment QR" ON storage.objects
  FOR SELECT TO anon USING (
    bucket_id = 'payment-proofs'
    AND EXISTS (
      SELECT 1 FROM public.store_payment_settings AS settings
      WHERE settings.singleton = true AND settings.qr_image_path = name
    )
  );

-- Order validation rewritten for guest orders: details come from the
-- checkout form instead of a signed-in customer profile.
CREATE OR REPLACE FUNCTION public.validate_customer_order()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_settings public.store_payment_settings%ROWTYPE;
  v_item jsonb;
  v_items jsonb := '[]'::jsonb;
  v_slug text;
  v_name text;
  v_price integer;
  v_quantity integer;
  v_subtotal bigint := 0;
  v_count integer := 0;
  v_phone_digits text;
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    RAISE EXCEPTION 'Orders are placed without a customer account.';
  END IF;
  NEW.user_id := NULL;

  NEW.customer_name := btrim(coalesce(NEW.customer_name, ''));
  IF NEW.customer_name = '' OR char_length(NEW.customer_name) > 120 THEN
    RAISE EXCEPTION 'A valid delivery name is required.';
  END IF;
  NEW.email := btrim(coalesce(NEW.email, ''));
  IF NEW.email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' OR char_length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'A valid email address is required.';
  END IF;
  NEW.phone := btrim(coalesce(NEW.phone, ''));
  v_phone_digits := REGEXP_REPLACE(NEW.phone, '\D', '', 'g');
  IF char_length(v_phone_digits) < 10 OR char_length(v_phone_digits) > 15 THEN
    RAISE EXCEPTION 'A valid contact number is required.';
  END IF;
  NEW.alternate_phone := NULLIF(btrim(coalesce(NEW.alternate_phone, '')), '');
  NEW.address_line1 := btrim(coalesce(NEW.address_line1, ''));
  NEW.address_line2 := NULLIF(btrim(coalesce(NEW.address_line2, '')), '');
  NEW.landmark := NULLIF(btrim(coalesce(NEW.landmark, '')), '');
  NEW.city := btrim(coalesce(NEW.city, ''));
  NEW.state := btrim(coalesce(NEW.state, ''));
  NEW.postal_code := btrim(coalesce(NEW.postal_code, ''));
  NEW.country := btrim(coalesce(NEW.country, ''));
  IF NEW.address_line1 = '' OR NEW.city = '' OR NEW.state = ''
     OR NEW.postal_code !~ '^[0-9]{4,10}$' OR NEW.country = ''
     OR char_length(NEW.address_line1) > 200 OR char_length(NEW.city) > 100
     OR char_length(NEW.state) > 100 THEN
    RAISE EXCEPTION 'A complete delivery address is required.';
  END IF;

  SELECT * INTO v_settings FROM public.store_payment_settings WHERE singleton = true;
  IF NOT FOUND OR NOT v_settings.checkout_enabled
     OR (btrim(v_settings.upi_id) = '' AND btrim(v_settings.account_number) = '') THEN
    RAISE EXCEPTION 'Checkout is not available yet.';
  END IF;
  IF NEW.proof_path IS NULL OR NEW.proof_path NOT LIKE 'guest/' || NEW.id::text || '/%' THEN
    RAISE EXCEPTION 'A valid payment screenshot is required.';
  END IF;
  IF jsonb_typeof(NEW.items) <> 'array' OR jsonb_array_length(NEW.items) < 1 OR jsonb_array_length(NEW.items) > 20 THEN
    RAISE EXCEPTION 'Order items are invalid.';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(NEW.items) AS item(value) LOOP
    v_count := v_count + 1;
    v_slug := v_item ->> 'slug';
    IF coalesce(v_item ->> 'quantity', '') !~ '^[0-9]{1,2}$' THEN RAISE EXCEPTION 'Order quantity is invalid.'; END IF;
    v_quantity := (v_item ->> 'quantity')::integer;
    IF v_quantity < 1 OR v_quantity > 20 OR v_slug IS NULL THEN RAISE EXCEPTION 'Order quantity is invalid.'; END IF;
    SELECT name, price_paise INTO v_name, v_price FROM public.products WHERE slug = v_slug AND active = true;
    IF NOT FOUND THEN RAISE EXCEPTION 'A product is not available.'; END IF;
    v_subtotal := v_subtotal + (v_price::bigint * v_quantity);
    IF v_subtotal > 2000000000 THEN RAISE EXCEPTION 'Order total is too large.'; END IF;
    v_items := v_items || jsonb_build_array(jsonb_build_object('slug', v_slug, 'name', v_name, 'quantity', v_quantity, 'price_paise', v_price));
  END LOOP;

  IF v_count = 0 OR NEW.subtotal_paise::bigint <> v_subtotal
     OR NEW.shipping_paise <> v_settings.shipping_paise
     OR NEW.total_paise::bigint <> v_subtotal + v_settings.shipping_paise THEN
    RAISE EXCEPTION 'Order totals do not match current prices and delivery.';
  END IF;
  NEW.items := v_items;
  NEW.payment_method := 'upi_or_bank_transfer';
  NEW.payment_status := 'pending';
  NEW.status := 'ordered';
  NEW.tracking_number := NULL;
  NEW.admin_note := NULL;
  RETURN NEW;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_customer_order() TO anon, authenticated, service_role;

-- Guests track their own order with the order number and the phone they ordered with.
CREATE OR REPLACE FUNCTION public.track_guest_order(p_order_id uuid, p_phone text)
RETURNS TABLE (
  result_id uuid,
  result_name text,
  result_city text,
  result_items jsonb,
  result_total integer,
  result_payment_status text,
  result_status text,
  result_tracking text,
  result_note text,
  result_created timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.customer_name, o.city, o.items, o.total_paise,
         o.payment_status, o.status, o.tracking_number, o.admin_note, o.created_at
  FROM public.orders AS o
  WHERE o.id = p_order_id
    AND char_length(REGEXP_REPLACE(coalesce(p_phone, ''), '\D', '', 'g')) >= 10
    AND REGEXP_REPLACE(o.phone, '\D', '', 'g') = REGEXP_REPLACE(p_phone, '\D', '', 'g')
$$;

GRANT EXECUTE ON FUNCTION public.track_guest_order(uuid, text) TO anon, authenticated, service_role;
