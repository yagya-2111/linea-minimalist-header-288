CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  alternate_phone text,
  address_line1 text NOT NULL CHECK (char_length(address_line1) BETWEEN 3 AND 200),
  address_line2 text,
  landmark text,
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  state text NOT NULL CHECK (char_length(state) BETWEEN 2 AND 100),
  postal_code text NOT NULL CHECK (char_length(postal_code) BETWEEN 3 AND 20),
  country text NOT NULL DEFAULT 'India',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.store_admin_config (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  admin_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.store_admin_config TO service_role;
ALTER TABLE public.store_admin_config ENABLE ROW LEVEL SECURITY;
INSERT INTO public.store_admin_config (singleton, admin_email) VALUES (true, 'realyagya01@gmail.com');

CREATE TABLE public.store_payment_settings (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  upi_id text NOT NULL DEFAULT '',
  payee_name text NOT NULL DEFAULT '',
  bank_name text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  account_number text NOT NULL DEFAULT '',
  ifsc text NOT NULL DEFAULT '',
  qr_image_path text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.store_payment_settings TO authenticated;
GRANT ALL ON public.store_payment_settings TO service_role;
ALTER TABLE public.store_payment_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  alternate_phone text,
  address_line1 text NOT NULL,
  address_line2 text,
  landmark text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  items jsonb NOT NULL CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) BETWEEN 1 AND 20),
  subtotal_paise integer NOT NULL CHECK (subtotal_paise > 0),
  shipping_paise integer NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
  total_paise integer NOT NULL CHECK (total_paise = subtotal_paise + shipping_paise),
  payment_method text NOT NULL DEFAULT 'upi_or_bank_transfer' CHECK (payment_method = 'upi_or_bank_transfer'),
  proof_path text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
  status text NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'packed', 'shipped', 'delivered')),
  tracking_number text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX orders_user_created_idx ON public.orders (user_id, created_at DESC);
CREATE INDEX orders_payment_status_idx ON public.orders (payment_status, created_at DESC);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Customers view own profile and admins view all" ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Customers create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Customers update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users view own role and admins view all" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Signed-in shoppers view payment instructions" ON public.store_payment_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins add payment instructions" ON public.store_payment_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update payment instructions" ON public.store_payment_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Customers view own orders and admins view all" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update order review and delivery" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER payment_settings_set_updated_at BEFORE UPDATE ON public.store_payment_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();