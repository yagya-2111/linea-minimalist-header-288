import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanjivaniProducts, type SanjivaniProduct } from "@/components/product/sanjivaniCatalog";

export type StoreProfile = {
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  alternate_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type StoreOrder = {
  id: string;
  user_id: string;
  customer_name: string;
  email: string;
  phone: string;
  alternate_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  items: { slug: string; name: string; quantity: number; price_paise: number }[];
  subtotal_paise: number;
  shipping_paise: number;
  total_paise: number;
  payment_method: string;
  proof_path: string;
  payment_status: "pending" | "approved" | "rejected";
  status: "ordered" | "packed" | "shipped" | "delivered";
  tracking_number: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

type PaymentSettings = {
  upi_id: string;
  payee_name: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  ifsc: string;
  qr_image_path: string;
  shipping_paise: number | null;
};

type CartLine = { slug: string; quantity: number };
type ProductRow = { slug: string; name: string; description: string; price_paise: number; active: boolean };
type UserAccount = { id: string; email: string };

type StoreContextValue = {
  user: UserAccount | null;
  profile: StoreProfile | null;
  isAdmin: boolean;
  authLoading: boolean;
  profileLoading: boolean;
  orders: StoreOrder[];
  cart: CartLine[];
  products: SanjivaniProduct[];
  productPrices: Record<string, number>;
  paymentSettings: PaymentSettings | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, details: Omit<StoreProfile, "user_id" | "email">) => Promise<void>;
  signOut: () => Promise<void>;
  saveProfile: (details: Omit<StoreProfile, "user_id" | "email">) => Promise<void>;
  addToCart: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  reloadStoreData: () => Promise<void>;
  submitOrder: (proof: File) => Promise<string>;
  updateOrder: (id: string, update: Partial<Pick<StoreOrder, "payment_status" | "status" | "tracking_number" | "admin_note">>) => Promise<void>;
  updatePaymentSettings: (settings: PaymentSettings) => Promise<void>;
  updateProduct: (slug: string, update: Pick<ProductRow, "name" | "description" | "price_paise" | "active">) => Promise<void>;
  getProofUrl: (path: string) => Promise<string>;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "sanjivani_cart_v1";
const INR = (paise: number) => Math.round(paise / 100).toLocaleString("en-IN");

function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((line): line is CartLine =>
      typeof line === "object" && line !== null && "slug" in line && typeof line.slug === "string" && "quantity" in line && typeof line.quantity === "number" && line.quantity > 0,
    ).slice(0, 20);
  } catch {
    return [];
  }
}

function readStoredCart(): CartLine[] {
  try { return parseCart(window.localStorage.getItem(CART_KEY)); } catch { return []; }
}

function mapProducts(rows: ProductRow[]): SanjivaniProduct[] {
  const visible = new Map(rows.filter((row) => row.active).map((row) => [row.slug, row]));
  return sanjivaniProducts.filter((item) => visible.has(item.slug)).map((item) => {
    const row = visible.get(item.slug);
    if (!row) return item;
    return { ...item, name: row.name, description: row.description || item.description };
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [cart, setCart] = useState<CartLine[]>(readStoredCart);
  const [products, setProducts] = useState(sanjivaniProducts);
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  const reloadStoreData = useCallback(async () => {
    const productResult = await supabase.from("products").select("slug,name,description,price_paise,active").order("slug");
    if (!productResult.error && productResult.data) {
      const rows = productResult.data as ProductRow[];
      setProducts(mapProducts(rows));
      setProductPrices(Object.fromEntries(rows.filter((row) => row.active).map((row) => [row.slug, row.price_paise])));
    }
    const settingsResult = await supabase.from("store_payment_settings").select("upi_id,payee_name,bank_name,account_name,account_number,ifsc,qr_image_path,shipping_paise").eq("singleton", true).maybeSingle();
    if (!settingsResult.error && settingsResult.data) setPaymentSettings(settingsResult.data as PaymentSettings);

    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData.user;
    if (!authUser?.email) {
      setUser(null); setProfile(null); setIsAdmin(false); setOrders([]); setProfileLoading(false);
      return;
    }
    setUser({ id: authUser.id, email: authUser.email });
    setProfileLoading(true);
    const [profileResult, roleResult, orderResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", authUser.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", authUser.id).eq("role", "admin").maybeSingle(),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setProfile(profileResult.data as StoreProfile | null);
    setIsAdmin(roleResult.data?.role === "admin");
    setOrders((orderResult.data ?? []) as StoreOrder[]);
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(() => {
      if (active) {
        setAuthLoading(false);
        void reloadStoreData();
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user?.email ? { id: session.user.id, email: session.user.email } : null);
      setAuthLoading(false);
      window.setTimeout(() => { if (active) void reloadStoreData(); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [reloadStoreData]);

  useEffect(() => {
    try { window.localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [cart]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    await reloadStoreData();
  }, [reloadStoreData]);

  const signUp = useCallback(async (email: string, password: string, details: Omit<StoreProfile, "user_id" | "email">) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({ email: normalizedEmail, password, options: { emailRedirectTo: window.location.origin, data: { full_name: details.full_name } } });
    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already registered") || message.includes("already been registered") || message.includes("user already exists")) throw new Error("This email is already registered. Sign in instead.");
      throw error;
    }
    if (!data.user || !data.session) throw new Error("Your account could not be signed in. Please try again.");
    const { error: profileError } = await supabase.from("profiles").insert({ ...details, user_id: data.user.id, email: normalizedEmail });
    if (profileError) {
      await supabase.auth.signOut();
      if (profileError.code === "23505") throw new Error("This email is already registered. Sign in instead.");
      throw profileError;
    }
    setProfile({ ...details, user_id: data.user.id, email: normalizedEmail });
    await reloadStoreData();
  }, [reloadStoreData]);

  const saveProfile = useCallback(async (details: Omit<StoreProfile, "user_id" | "email">) => {
    if (!user) throw new Error("Sign in to update your details.");
    const { error } = await supabase.from("profiles").upsert({ ...details, user_id: user.id, email: user.email }, { onConflict: "user_id" });
    if (error) throw error;
    await reloadStoreData();
  }, [reloadStoreData, user]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null); setProfile(null); setIsAdmin(false); setOrders([]);
  }, []);

  const addToCart = useCallback((slug: string, quantity = 1) => setCart((current) => {
    const existing = current.find((line) => line.slug === slug);
    if (existing) return current.map((line) => line.slug === slug ? { ...line, quantity: Math.min(20, line.quantity + quantity) } : line);
    return [...current, { slug, quantity: Math.min(20, quantity) }].slice(0, 20);
  }), []);

  const setQuantity = useCallback((slug: string, quantity: number) => setCart((current) => quantity <= 0 ? current.filter((line) => line.slug !== slug) : current.map((line) => line.slug === slug ? { ...line, quantity: Math.min(20, quantity) } : line)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const submitOrder = useCallback(async (proof: File) => {
    if (!user || !profile) throw new Error("Complete your account details before checkout.");
    if (!cart.length) throw new Error("Your bag is empty.");
    if (!paymentSettings || !paymentSettings.shipping_paise || !paymentSettings.upi_id && !paymentSettings.account_number) throw new Error("Online payment and delivery instructions are not available yet. Please contact the store.");
    if (!proof.type.startsWith("image/") || proof.size > 5 * 1024 * 1024) throw new Error("Upload a payment screenshot as an image, up to 5 MB.");
    const ids = cart.map((line) => line.slug);
    const { data: currentRows, error: productError } = await supabase.from("products").select("slug,name,price_paise,active").in("slug", ids);
    if (productError || !currentRows) throw new Error("We could not confirm current product prices. Please try again.");
    const productBySlug = new Map((currentRows as Pick<ProductRow, "slug" | "name" | "price_paise" | "active">[]).map((row) => [row.slug, row]));
    const items = cart.map((line) => {
      const row = productBySlug.get(line.slug);
      if (!row?.active) throw new Error("A product in your bag is no longer available.");
      return { slug: row.slug, name: row.name, quantity: line.quantity, price_paise: row.price_paise };
    });
    const subtotal = items.reduce((sum, line) => sum + line.price_paise * line.quantity, 0);
    const total = subtotal + paymentSettings.shipping_paise;
    const id = crypto.randomUUID();
    const proofPath = `${user.id}/${id}/${crypto.randomUUID()}.${proof.type === "image/png" ? "png" : proof.type === "image/webp" ? "webp" : "jpg"}`;
    const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(proofPath, proof, { contentType: proof.type, upsert: false });
    if (uploadError) throw uploadError;
    const { error: orderError } = await supabase.from("orders").insert({
      id, user_id: user.id, customer_name: profile.full_name, email: user.email, phone: profile.phone,
      alternate_phone: profile.alternate_phone, address_line1: profile.address_line1, address_line2: profile.address_line2,
      landmark: profile.landmark, city: profile.city, state: profile.state, postal_code: profile.postal_code,
      country: profile.country, items, subtotal_paise: subtotal, shipping_paise: paymentSettings.shipping_paise,
      total_paise: total, proof_path: proofPath,
    });
    if (orderError) {
      await supabase.storage.from("payment-proofs").remove([proofPath]);
      throw orderError;
    }
    clearCart();
    await reloadStoreData();
    return id;
  }, [cart, clearCart, paymentSettings, profile, reloadStoreData, user]);

  const updateOrder = useCallback(async (id: string, update: Partial<Pick<StoreOrder, "payment_status" | "status" | "tracking_number" | "admin_note">>) => {
    if (!isAdmin) throw new Error("Administrator access is required.");
    const { error } = await supabase.from("orders").update(update).eq("id", id);
    if (error) throw error;
    await reloadStoreData();
  }, [isAdmin, reloadStoreData]);

  const updatePaymentSettings = useCallback(async (settings: PaymentSettings) => {
    if (!isAdmin) throw new Error("Administrator access is required.");
    const { error } = await supabase.from("store_payment_settings").upsert({ ...settings, singleton: true }, { onConflict: "singleton" });
    if (error) throw error;
    await reloadStoreData();
  }, [isAdmin, reloadStoreData]);

  const updateProduct = useCallback(async (slug: string, update: Pick<ProductRow, "name" | "description" | "price_paise" | "active">) => {
    if (!isAdmin) throw new Error("Administrator access is required.");
    const { error } = await supabase.from("products").update(update).eq("slug", slug);
    if (error) throw error;
    await reloadStoreData();
  }, [isAdmin, reloadStoreData]);

  const getProofUrl = useCallback(async (path: string) => {
    if (!user) throw new Error("Sign in to view payment proof.");
    const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 60);
    if (error || !data) throw error ?? new Error("Payment image unavailable.");
    return data.signedUrl;
  }, [user]);

  const value = useMemo(() => ({ user, profile, isAdmin, authLoading, profileLoading, orders, cart, products, productPrices, paymentSettings, signIn, signUp, signOut, saveProfile, addToCart, setQuantity, clearCart, reloadStoreData, submitOrder, updateOrder, updatePaymentSettings, updateProduct, getProofUrl }), [user, profile, isAdmin, authLoading, profileLoading, orders, cart, products, productPrices, paymentSettings, signIn, signUp, signOut, saveProfile, addToCart, setQuantity, clearCart, reloadStoreData, submitOrder, updateOrder, updatePaymentSettings, updateProduct, getProofUrl]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}

export function formatPrice(paise: number) {
  return `₹${INR(paise)}`;
}