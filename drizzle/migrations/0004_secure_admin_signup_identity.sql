CREATE OR REPLACE FUNCTION public.grant_store_admin_on_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  verified_email text;
BEGIN
  verified_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  IF NEW.user_id = auth.uid()
     AND verified_email <> ''
     AND lower(NEW.email) = verified_email
     AND verified_email = (SELECT lower(admin_email) FROM public.store_admin_config WHERE singleton = true) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
DROP POLICY "Customers create own profile" ON public.profiles;
CREATE POLICY "Customers create own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND email = (auth.jwt() ->> 'email'));