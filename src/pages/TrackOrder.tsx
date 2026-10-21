import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock3, PackageSearch } from "lucide-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, formatPrice, type StoreOrder } from "@/context/StoreContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = ["ordered", "packed", "shipped", "delivered"] as const;
const titles = { ordered: "Ordered", packed: "Packed", shipped: "Shipped", delivered: "Delivered" } as const;
const RECENT_KEY = "sanjivani_recent_orders";

type RecentOrder = { id: string; phone: string; name: string; total: number; placedAt: string };
type TrackedOrder = { id: string; phone: string; name: string; total: number; city: string; items: { slug: string; name: string; quantity: number; price_paise: number }[]; payment_status: string; status: string; tracking_number: string | null; admin_note: string | null; created_at: string };

const readRecent = (): RecentOrder[] => {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is RecentOrder =>
      typeof entry === "object" && entry !== null && typeof (entry as RecentOrder).id === "string" && typeof (entry as RecentOrder).phone === "string",
    ).slice(0, 10);
  } catch { return []; }
};

const TrackOrder = () => {
  const { user, isAdmin, signOut } = useStore();
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [tracked, setTracked] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    document.title = "Track your order | Sanjivani";
    setRecent(readRecent());
  }, []);

  const track = useCallback(async (entries: RecentOrder[]) => {
    if (!entries.length) { setTracked([]); return; }
    setLoading(true);
    const results = await Promise.all(entries.map(async (entry) => {
      const { data, error } = await supabase.rpc("track_guest_order", { p_order_id: entry.id, p_phone: entry.phone });
      if (error || !data?.length) return null;
      const row = data[0];
      return {
        id: entry.id, phone: entry.phone, name: row.result_name ?? entry.name, city: row.result_city ?? "",
        items: (row.result_items ?? []) as TrackedOrder["items"], total: row.result_total ?? entry.total,
        payment_status: row.result_payment_status ?? "pending", status: row.result_status ?? "ordered",
        tracking_number: row.result_tracking ?? null, admin_note: row.result_note ?? null,
        created_at: row.result_created ?? entry.placedAt,
      } satisfies TrackedOrder;
    }));
    setTracked(results.filter((entry): entry is TrackedOrder => entry !== null));
    setLoading(false);
  }, []);

  useEffect(() => { void track(recent); }, [recent, track]);

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanId = orderId.trim();
    if (!/^[0-9a-fA-F-]{36}$/.test(cleanId)) { toast.error("Enter the full order number from your confirmation page."); return; }
    const entry: RecentOrder = { id: cleanId, phone: phone.trim(), name: "Your order", total: 0, placedAt: new Date().toISOString() };
    setLoading(true);
    const { data, error } = await supabase.rpc("track_guest_order", { p_order_id: entry.id, p_phone: entry.phone });
    setLoading(false);
    if (error || !data?.length) { toast.error("No order matches that number and phone. Check both and try again."); return; }
    const row = data[0];
    const found: TrackedOrder = {
      id: entry.id, phone: entry.phone, name: row.result_name ?? "Your order", city: row.result_city ?? "",
      items: (row.result_items ?? []) as TrackedOrder["items"], total: row.result_total ?? 0,
      payment_status: row.result_payment_status ?? "pending", status: row.result_status ?? "ordered",
      tracking_number: row.result_tracking ?? null, admin_note: row.result_note ?? null, created_at: row.result_created ?? entry.placedAt,
    };
    setTracked((current) => [found, ...current.filter((existing) => existing.id !== found.id)]);
    const merged = [entry, ...readRecent().filter((existing) => existing.id !== entry.id)].slice(0, 10);
    try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(merged)); } catch { /* Private browsing may block storage. */ }
    setRecent(merged);
    setOrderId(""); setPhone("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Order tracking</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Track your order.</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">Enter your order number (from your confirmation page) and the phone number you ordered with. Orders placed on this device appear automatically.</p>
        <form onSubmit={handleLookup} className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div><Label htmlFor="track-order">Order number</Label><Input id="track-order" required value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Paste the full order number" className="mt-2 h-12" /></div>
          <div><Label htmlFor="track-phone">Phone number</Label><Input id="track-phone" type="tel" required minLength={10} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone used at checkout" className="mt-2 h-12" /></div>
          <Button type="submit" disabled={loading} className="h-12 font-bold"><PackageSearch className="mr-2 h-4 w-4" />{loading ? "Checking…" : "Track order"}</Button>
        </form>
        <div className="mt-10 space-y-8">
          {tracked.map((order) => <TrackedCard key={order.id + order.phone} order={order} />)}
          {tracked.length === 0 && !loading && <p className="border-y border-border py-10 text-center text-sm text-muted-foreground">No tracked orders yet. Place an order, or look one up above.</p>}
        </div>
        {user && (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">{isAdmin ? "Signed in as the store owner." : "Signed in."}</p>
            <div className="flex gap-3">
              {isAdmin && <Button asChild variant="outline"><Link to="/admin">Store management</Link></Button>}
              <Button variant="outline" onClick={() => void signOut()}>Sign out</Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const TrackedCard = ({ order }: { order: TrackedOrder }) => {
  const stepIndex = steps.indexOf(order.status as (typeof steps)[number]);
  return (
    <article className="border-y border-border py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Order · {order.id.slice(0, 8).toUpperCase()}</p>
          <p className="mt-1 font-bold">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <p className="font-display text-xl font-extrabold">{order.total ? formatPrice(order.total) : ""}</p>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="min-w-0">
            <span className={`flex h-9 w-9 items-center justify-center border ${index <= stepIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{index < stepIndex ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</span>
            <p className={`mt-2 text-xs font-semibold ${index <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}>{titles[step]}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-4 text-sm">
        <span>Payment <strong>{order.payment_status === "approved" ? "Approved" : order.payment_status === "rejected" ? "Not approved" : "Under review"}</strong></span>
        {order.tracking_number && <span>Tracking: {order.tracking_number}</span>}
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{order.items.map((item) => <li key={item.slug}>{item.name} × {item.quantity}</li>)}</ul>
      {order.admin_note && <p className="mt-3 text-sm text-muted-foreground">Note from the store: {order.admin_note}</p>}
    </article>
  );
};

export type { StoreOrder };

export default TrackOrder;
