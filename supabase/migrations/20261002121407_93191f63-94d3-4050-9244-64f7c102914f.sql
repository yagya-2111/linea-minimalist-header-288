DROP POLICY "Customers view own profile and admins view all" ON public.profiles;
DROP POLICY "Users view own role and admins view all" ON public.user_roles;
DROP POLICY "Admins add payment instructions" ON public.store_payment_settings;
DROP POLICY "Admins update payment instructions" ON public.store_payment_settings;
DROP POLICY "Customers view own orders and admins view all" ON public.orders;
DROP POLICY "Admins update order review and delivery" ON public.orders;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated, service_role;
DROP FUNCTION public.has_role(uuid, public.app_role);
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role)
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT SELECT ON public.store_admin_config TO authenticated;
CREATE POLICY "Admins view private store settings" ON public.store_admin_config FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Customers view own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Customers view own profile and admins view all" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins add payment instructions" ON public.store_payment_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update payment instructions" ON public.store_payment_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Customers view own orders and admins view all" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins update order review and delivery" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());