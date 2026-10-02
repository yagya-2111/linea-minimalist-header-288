DROP POLICY IF EXISTS "Customers upload own payment proof" ON storage.objects;
CREATE POLICY "Customers and admins upload payment files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'payment-proofs'
  AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin())
);

CREATE OR REPLACE FUNCTION public.validate_admin_order_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  old_step integer;
  new_step integer;
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
  old_step := CASE OLD.status WHEN 'ordered' THEN 0 WHEN 'packed' THEN 1 WHEN 'shipped' THEN 2 ELSE 3 END;
  new_step := CASE NEW.status WHEN 'ordered' THEN 0 WHEN 'packed' THEN 1 WHEN 'shipped' THEN 2 ELSE 3 END;
  IF NEW.status IS DISTINCT FROM OLD.status AND new_step <> old_step + 1 THEN
    RAISE EXCEPTION 'Delivery stages must be completed one at a time.';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.payment_status <> 'approved' THEN
    RAISE EXCEPTION 'Approve payment before advancing delivery.';
  END IF;
  RETURN NEW;
END;
$$;