import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

export type GuestOrderDetails = {
  full_name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  address_line1: string;
  address_line2: string;
  landmark: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type StoreOrder = {
  id: string;
  user_id: string | null;
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
  checkout_enabled: boolean;
};

type CartLine = { slug: string; quantity: number };
type ProductRow = { slug: string; name: string; description: string; price_paise: number; active: boolean };
type UserAccount = { id: string; email: string };

type StoreContextValue = {
  user: UserAccount | null;
  isAdmin: boolean;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  orders: StoreOrder[];
  cart: CartLine[];
  products: SanjivaniProduct[];
  productPrices: Record<string, number>;
  paymentSettings: PaymentSettings | null;
  addToCart: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  reloadStoreData: () => Promise<void>;
  submitOrder: (proof: File, details: GuestOrderDetails, buySlug?: string) => Promise<string>;
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

function readStoredCart(scope: string): CartLine[] {
  try { return parseCart(window.localStorage.getItem(`${CART_KEY}:${scope}`)); } catch { return []; }
}

function mapProducts(rows: ProductRow[]): SanjivaniProduct[] {
  const visible = new Map(rows.map((row) => [row.slug, row]));
  return sanjivaniProducts.flatMap((item) => {
    const row = visible.get(item.slug);
    if (!row) return item;
    return [{ ...item, name: row.name, description: row.description || item.description, active: row.active }];
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loadedCartScope, setLoadedCartScope] = useState<string | null>(null);
  const [products, setProducts] = useState(sanjivaniProducts);
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  // Shopping is account-free: every bag lives in the shared guest scope on this device.
  const cartScope = "guest";
  const activeCart = loadedCartScope === cartScope ? cart.filter((line) => sanjivaniProducts.some((product) => product.slug === line.slug)) : [];
  const reloadSequence = useRef(0);

  const reloadStoreData = useCallback(async () => {
    const sequence = ++reloadSequence.current;
    // Run catalogue, payment settings and auth lookups in parallel so
    // checkout and other pages render without waiting on a serial chain.
    const [productResult, settingsResult, authData] = await Promise.all([
      supabase.from("products").select("slug,name,description,price_paise,active").order("slug"),
      supabase.from("store_payment_settings").select("upi_id,payee_name,bank_name,account_name,account_number,ifsc,qr_image_path,shipping_paise,checkout_enabled").eq("singleton", true).maybeSingle(),
      supabase.auth.getUser(),
    ]);
    if (sequence !== reloadSequence.current) return;
    if (!productResult.error && productResult.data) {
      const rows = productResult.data as ProductRow[];
      setProducts(mapProducts(rows));
      setProductPrices(Object.fromEntries(rows.filter((row) => row.active).map((row) => [row.slug, row.price_paise])));
    }
    if (!settingsResult.error && settingsResult.data) setPaymentSettings(settingsResult.data as PaymentSettings);
    const authUser = authData.data.user;
    if (!authUser?.email) {
      setUser(null); setIsAdmin(false); setOrders([]);
      return;
    }
    setUser({ id: authUser.id, email: authUser.email });
    const roleResult = await supabase.from("user_roles").select("role").eq("user_id", authUser.id).eq("role", "admin").maybeSingle();
    if (sequence !== reloadSequence.current) return;
    const isStoreAdmin = roleResult.data?.role === "admin";
    setIsAdmin(isStoreAdmin);
    if (isStoreAdmin) {
      const orderResult = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (sequence !== reloadSequence.current) return;
      setOrders((orderResult.data ?? []) as StoreOrder[]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        const sessionUser = data.session?.user;
        setUser(sessionUser?.email ? { id: sessionUser.id, email: sessionUser.email } : null);
        setAuthLoading(false);
        void reloadStoreData();
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      reloadSequence.current += 1;
      setUser(session?.user?.email ? { id: session.user.id, email: session.user.email } : null);
      setOrders([]);
      setIsAdmin(false);
      setAuthLoading(false);
      window.setTimeout(() => { if (active) void reloadStoreData(); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [reloadStoreData]);

  useEffect(() => {
    if (loadedCartScope === cartScope) return;
    setCart(readStoredCart(cartScope));
    setLoadedCartScope(cartScope);
  }, [cartScope, loadedCartScope]);

  useEffect(() => {
    if (loadedCartScope !== cartScope) return;
    try { window.localStorage.setItem(`${CART_KEY}:${cartScope}`, JSON.stringify(cart)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [cart, cartScope, loadedCartScope]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    await reloadStoreData();
  }, [reloadStoreData]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null); setIsAdmin(false); setOrders([]);
  }, []);

  const addToCart = useCallback((slug: string, quantity = 1) => setCart((current) => {
    const scoped = loadedCartScope === cartScope ? current : [];
    const existing = scoped.find((line) => line.slug === slug);
    if (existing) return scoped.map((line) => line.slug === slug ? { ...line, quantity: Math.min(20, line.quantity + quantity) } : line);
    return [...scoped, { slug, quantity: Math.min(20, quantity) }].slice(0, 20);
  }), [cartScope, loadedCartScope]);

  const setQuantity = useCallback((slug: string, quantity: number) => setCart((current) => {
    const scoped = loadedCartScope === cartScope ? current : [];
    return quantity <= 0 ? scoped.filter((line) => line.slug !== slug) : scoped.map((line) => line.slug === slug ? { ...line, quantity: Math.min(20, quantity) } : line);
  }), [cartScope, loadedCartScope]);

  const clearCart = useCallback(() => setCart([]), []);

  const submitOrder = useCallback(async (proof: File, details: GuestOrderDetails, buySlug?: string) => {
    const purchaseLines = buySlug ? [{ slug: buySlug, quantity: 1 }] : activeCart.filter((line) => sanjivaniProducts.some((product) => product.slug === line.slug));
    if (!purchaseLines.length) throw new Error("Your bag is empty.");
    if (buySlug && !sanjivaniProducts.some((item) => item.slug === buySlug)) throw new Error("This drop is unavailable.");
    if (!paymentSettings || !paymentSettings.checkout_enabled || paymentSettings.shipping_paise == null || (!paymentSettings.upi_id.trim() && !paymentSettings.account_number.trim())) throw new Error("Online payment and delivery instructions are not available yet. Please contact the store.");
    if (!proof.type.startsWith("image/") || proof.size > 5 * 1024 * 1024) throw new Error("Upload a payment screenshot as an image, up to 5 MB.");
    const name = details.full_name.trim();
    const email = details.email.trim();
    const phone = details.phone.trim();
    if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.replace(/\D/g, "").length < 10 || !details.address_line1.trim() || !details.city.trim() || !details.state.trim() || !/^[0-9]{4,10}$/.test(details.postal_code.trim())) throw new Error("Complete your name, contact number and delivery address before placing the order.");
    const ids = purchaseLines.map((line) => line.slug);
    const { data: currentRows, error: productError } = await supabase.from("products").select("slug,name,price_paise,active").in("slug", ids);
    if (productError || !currentRows) throw new Error("We could not confirm current product prices. Please try again.");
    const productBySlug = new Map((currentRows as Pick<ProductRow, "slug" | "name" | "price_paise" | "active">[]).map((row) => [row.slug, row]));
    const items = purchaseLines.map((line) => {
      const row = productBySlug.get(line.slug);
      if (!row?.active) throw new Error("A product in your bag is no longer available.");
      return { slug: row.slug, name: row.name, quantity: line.quantity, price_paise: row.price_paise };
    });
    const subtotal = items.reduce((sum, line) => sum + line.price_paise * line.quantity, 0);
    const total = subtotal + paymentSettings.shipping_paise;
    const id = crypto.randomUUID();
    const proofPath = `guest/${id}/${crypto.randomUUID()}.${proof.type === "image/png" ? "png" : proof.type === "image/webp" ? "webp" : "jpg"}`;
    const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(proofPath, proof, { contentType: proof.type, upsert: false });
    if (uploadError) throw uploadError;
    const { error: orderError } = await supabase.from("orders").insert({
      id, user_id: null, customer_name: name, email, phone,
      alternate_phone: details.alternate_phone.trim() || null, address_line1: details.address_line1.trim(), address_line2: details.address_line2.trim() || null,
      landmark: details.landmark.trim() || null, city: details.city.trim(), state: details.state.trim(), postal_code: details.postal_code.trim(),
      country: details.country.trim() || "India", items, subtotal_paise: subtotal, shipping_paise: paymentSettings.shipping_paise,
      total_paise: total, proof_path: proofPath,
    });
    if (orderError) {
      await supabase.storage.from("payment-proofs").remove([proofPath]);
      throw orderError;
    }
    if (!buySlug) clearCart();
    await reloadStoreData();
    return id;
  }, [activeCart, clearCart, paymentSettings, reloadStoreData]);

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
    const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 60);
    if (error || !data) throw error ?? new Error("Payment image unavailable.");
    return data.signedUrl;
  }, []);

  const value = useMemo(() => ({ user, isAdmin, authLoading, signIn, signOut, orders, cart: activeCart, products, productPrices, paymentSettings, addToCart, setQuantity, clearCart, reloadStoreData, submitOrder, updateOrder, updatePaymentSettings, updateProduct, getProofUrl }), [user, isAdmin, authLoading, signIn, signOut, orders, activeCart, products, productPrices, paymentSettings, addToCart, setQuantity, clearCart, reloadStoreData, submitOrder, updateOrder, updatePaymentSettings, updateProduct, getProofUrl]);
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
