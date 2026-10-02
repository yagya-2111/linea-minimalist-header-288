ALTER TABLE public.store_payment_settings ADD COLUMN IF NOT EXISTS checkout_enabled boolean NOT NULL DEFAULT false;

GRANT UPDATE ON public.products TO authenticated;
CREATE POLICY "Admins manage product catalogue" ON public.products FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Customers update own payment proof before review" ON public.orders;

CREATE OR REPLACE FUNCTION public.validate_customer_order()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
  v_settings public.store_payment_settings%ROWTYPE;
  v_item jsonb;
  v_items jsonb := '[]'::jsonb;
  v_slug text;
  v_name text;
  v_price integer;
  v_quantity integer;
  v_subtotal bigint := 0;
  v_count integer := 0;
BEGIN
  IF auth.uid() IS NULL OR NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'A signed-in customer must place this order.';
  END IF;

  SELECT * INTO v_profile FROM public.profiles WHERE user_id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'Complete your customer details before ordering.'; END IF;
  NEW.customer_name := v_profile.full_name;
  NEW.email := v_profile.email;
  NEW.phone := v_profile.phone;
  NEW.alternate_phone := v_profile.alternate_phone;
  NEW.address_line1 := v_profile.address_line1;
  NEW.address_line2 := v_profile.address_line2;
  NEW.landmark := v_profile.landmark;
  NEW.city := v_profile.city;
  NEW.state := v_profile.state;
  NEW.postal_code := v_profile.postal_code;
  NEW.country := v_profile.country;

  SELECT * INTO v_settings FROM public.store_payment_settings WHERE singleton = true;
  IF NOT FOUND OR NOT v_settings.checkout_enabled
     OR (btrim(v_settings.upi_id) = '' AND btrim(v_settings.account_number) = '') THEN
    RAISE EXCEPTION 'Checkout is not available yet.';
  END IF;
  IF NEW.proof_path IS NULL OR NEW.proof_path NOT LIKE auth.uid()::text || '/' || NEW.id::text || '/%' THEN
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

DROP TRIGGER IF EXISTS orders_validate_customer_order ON public.orders;
CREATE TRIGGER orders_validate_customer_order BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_customer_order();

CREATE OR REPLACE FUNCTION public.validate_admin_order_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Administrator access is required.'; END IF;
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.customer_name IS DISTINCT FROM OLD.customer_name OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.phone IS DISTINCT FROM OLD.phone OR NEW.alternate_phone IS DISTINCT FROM OLD.alternate_phone
     OR NEW.address_line1 IS DISTINCT FROM OLD.address_line1 OR NEW.address_line2 IS DISTINCT FROM OLD.address_line2
     OR NEW.landmark IS DISTINCT FROM OLD.landmark OR NEW.city IS DISTINCT FROM OLD.city
     OR NEW.state IS DISTINCT FROM OLD.state OR NEW.postal_code IS DISTINCT FROM OLD.postal_code
     OR NEW.country IS DISTINCT FROM OLD.country OR NEW.items IS DISTINCT FROM OLD.items
     OR NEW.subtotal_paise IS DISTINCT FROM OLD.subtotal_paise OR NEW.shipping_paise IS DISTINCT FROM OLD.shipping_paise
     OR NEW.total_paise IS DISTINCT FROM OLD.total_paise OR NEW.proof_path IS DISTINCT FROM OLD.proof_path THEN
    RAISE EXCEPTION 'Order details cannot be changed during review.';
  END IF;
  IF NEW.payment_status NOT IN ('pending', 'approved', 'rejected') OR NEW.status NOT IN ('ordered', 'packed', 'shipped', 'delivered') THEN
    RAISE EXCEPTION 'Order status is invalid.';
  END IF;
  IF NEW.status <> 'ordered' AND NEW.payment_status <> 'approved' THEN
    RAISE EXCEPTION 'Approve payment before advancing delivery.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_validate_admin_update ON public.orders;
CREATE TRIGGER orders_validate_admin_update BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_admin_order_update();

DROP POLICY IF EXISTS "Customers and admins view payment proof" ON storage.objects;
CREATE POLICY "Customers and admins view payment proof" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'payment-proofs'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
    OR EXISTS (SELECT 1 FROM public.store_payment_settings AS settings WHERE settings.singleton = true AND settings.qr_image_path = name)
  )
);
GRANT EXECUTE ON FUNCTION public.validate_customer_order() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_admin_order_update() TO authenticated, service_role;