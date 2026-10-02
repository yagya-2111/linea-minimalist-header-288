import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowUpRight, Check, ChevronRight, ExternalLink, PackageCheck, Save, Settings2, ShieldCheck, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore, formatPrice, type StoreOrder } from "@/context/StoreContext";
import { supabase } from "@/integrations/supabase/client";

type SettingsForm = { upi_id: string; payee_name: string; bank_name: string; account_name: string; account_number: string; ifsc: string; qr_image_path: string; shipping_paise: string; checkout_enabled: boolean };

const DELIVERY: StoreOrder["status"][] = ["ordered", "packed", "shipped", "delivered"];
const deliveryLabel: Record<StoreOrder["status"], string> = { ordered: "Ordered", packed: "Packed", shipped: "Shipped", delivered: "Delivered" };

const Admin = () => {
  const { user, isAdmin, authLoading, profileLoading, orders, productPrices, products, paymentSettings, reloadStoreData, updateOrder, updatePaymentSettings, updateProduct, getProofUrl } = useStore();
  const [settings, setSettings] = useState<SettingsForm>({ upi_id: "", payee_name: "", bank_name: "", account_name: "", account_number: "", ifsc: "", qr_image_path: "", shipping_paise: "", checkout_enabled: false });
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProduct, setSavingProduct] = useState<string | null>(null);
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [proofBusy, setProofBusy] = useState<string | null>(null);
  const [qrBusy, setQrBusy] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [productDrafts, setProductDrafts] = useState<Record<string, { name: string; description: string; price: string; active: boolean }>>({});

  useEffect(() => {
    if (!paymentSettings) return;
    setSettings({ upi_id: paymentSettings.upi_id, payee_name: paymentSettings.payee_name, bank_name: paymentSettings.bank_name, account_name: paymentSettings.account_name, account_number: paymentSettings.account_number, ifsc: paymentSettings.ifsc, qr_image_path: paymentSettings.qr_image_path, shipping_paise: paymentSettings.shipping_paise == null ? "" : String(paymentSettings.shipping_paise / 100), checkout_enabled: paymentSettings.checkout_enabled });
  }, [paymentSettings]);

  useEffect(() => {
    setProductDrafts(Object.fromEntries(products.map((product) => ({
      [product.slug]: { name: product.name, description: product.description, price: String((productPrices[product.slug] ?? 0) / 100), active: true },
    })).map((entry) => Object.entries(entry)).flat()));
  }, [productPrices, products]);

  const showError = (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not save these changes.");
  const pending = orders.filter((order) => order.payment_status === "pending");
  const activeOrders = orders.filter((order) => order.payment_status === "approved" && order.status !== "delivered");

  const openProof = async (order: StoreOrder) => {
    setProofBusy(order.id);
    try {
      const url = await getProofUrl(order.proof_path);
      setProofUrls((current) => ({ ...current, [order.id]: url }));
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) { showError(error); } finally { setProofBusy(null); }
  };

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const shipping = Number(settings.shipping_paise);
    if (!Number.isFinite(shipping) || shipping < 0 || shipping > 100000 || !Number.isInteger(shipping * 100)) { toast.error("Enter a valid delivery fee in rupees."); return; }
    if (settings.checkout_enabled && !settings.upi_id.trim() && !settings.account_number.trim()) { toast.error("Add at least a UPI ID or bank account before opening checkout."); return; }
    setSavingSettings(true);
    try {
      await updatePaymentSettings({ upi_id: settings.upi_id.trim(), payee_name: settings.payee_name.trim(), bank_name: settings.bank_name.trim(), account_name: settings.account_name.trim(), account_number: settings.account_number.trim(), ifsc: settings.ifsc.trim().toUpperCase(), qr_image_path: settings.qr_image_path, shipping_paise: Math.round(shipping * 100), checkout_enabled: settings.checkout_enabled });
      toast.success("Payment and delivery settings saved");
    } catch (error) { showError(error); } finally { setSavingSettings(false); }
  };

  const uploadQr = async () => {
    if (!qrFile || !user) { toast.error("Choose a QR image first."); return; }
    if (!qrFile.type.startsWith("image/") || qrFile.size > 5 * 1024 * 1024) { toast.error("Choose an image up to 5 MB."); return; }
    setQrBusy(true);
    try {
      const suffix = qrFile.type === "image/png" ? "png" : qrFile.type === "image/webp" ? "webp" : "jpg";
      const path = `${user.id}/store/payment-qr-${Date.now()}.${suffix}`;
      const { error } = await supabase.storage.from("payment-proofs").upload(path, qrFile, { contentType: qrFile.type, upsert: false });
      if (error) throw error;
      setSettings((current) => ({ ...current, qr_image_path: path }));
      const urlResult = await supabase.storage.from("payment-proofs").createSignedUrl(path, 3600);
      setQrUrl(urlResult.data?.signedUrl ?? null);
      setQrFile(null);
      toast.success("Payment QR image uploaded. Save payment settings to publish it.");
    } catch (error) { showError(error); } finally { setQrBusy(false); }
  };

  const handleOrderUpdate = async (order: StoreOrder, update: Parameters<typeof updateOrder>[1], success: string) => {
    try { await updateOrder(order.id, update); toast.success(success); } catch (error) { showError(error); }
  };

  const saveProduct = async (slug: string) => {
    const draft = productDrafts[slug];
    if (!draft) return;
    const rupees = Number(draft.price);
    if (!draft.name.trim() || draft.name.trim().length > 120 || !Number.isFinite(rupees) || rupees < 1 || rupees > 100000) { toast.error("Check the product name and price."); return; }
    setSavingProduct(slug);
    try {
      await updateProduct(slug, { name: draft.name.trim(), description: draft.description.trim(), price_paise: Math.round(rupees * 100), active: draft.active });
      toast.success(`${draft.name} saved`);
    } catch (error) { showError(error); } finally { setSavingProduct(null); }
  };

  if (authLoading || profileLoading) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-7xl px-5 py-20 text-muted-foreground">Loading store controls…</main><Footer /></div>;
  if (!user) return <Navigate to="/account" replace />;
  if (!isAdmin) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-3xl px-5 py-24 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" /><h1 className="mt-5 font-display text-3xl font-extrabold">Administrator access only</h1><p className="mt-3 text-muted-foreground">This area is only available to the store administrator.</p><Button asChild className="mt-6"><Link to="/">Back to Sanjivani</Link></Button></main><Footer /></div>;

  return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:py-16">
    <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase text-accent-strong">Store controls</p><h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Orders & settings</h1><p className="mt-2 text-muted-foreground">Payment checks, delivery progress, and product pricing.</p></div><Button asChild variant="outline"><Link to="/account">My account</Link></Button></div>
    <section className="grid gap-6 border-b border-border py-8 sm:grid-cols-3"><Stat label="Orders to review" count={pending.length} /><Stat label="In delivery" count={activeOrders.length} /><Stat label="All orders" count={orders.length} /></section>

     <section id="payment-settings" className="grid gap-8 border-b border-border py-10 lg:grid-cols-[0.8fr_1.2fr]"><div><div className="flex h-10 w-10 items-center justify-center bg-secondary"><Settings2 className="h-5 w-5" /></div><h2 className="mt-4 font-display text-2xl font-extrabold">Payment & delivery</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">The current payment details are demo placeholders and cannot receive money. Replace them with your real UPI, bank, QR, and delivery fee before opening checkout.</p></div>
      <form onSubmit={saveSettings} className="grid gap-x-5 gap-y-4 sm:grid-cols-2"><div><Label htmlFor="upi">UPI ID</Label><Input id="upi" autoComplete="off" maxLength={120} value={settings.upi_id} onChange={(event) => setSettings({ ...settings, upi_id: event.target.value })} className="mt-2 h-11" /></div><div><Label htmlFor="payee">Payee name</Label><Input id="payee" maxLength={120} value={settings.payee_name} onChange={(event) => setSettings({ ...settings, payee_name: event.target.value })} className="mt-2 h-11" /></div><div><Label htmlFor="bank-name">Bank name</Label><Input id="bank-name" maxLength={120} value={settings.bank_name} onChange={(event) => setSettings({ ...settings, bank_name: event.target.value })} className="mt-2 h-11" /></div><div><Label htmlFor="account-name">Account name</Label><Input id="account-name" maxLength={120} value={settings.account_name} onChange={(event) => setSettings({ ...settings, account_name: event.target.value })} className="mt-2 h-11" /></div><div><Label htmlFor="account-number">Account number</Label><Input id="account-number" inputMode="numeric" maxLength={40} value={settings.account_number} onChange={(event) => setSettings({ ...settings, account_number: event.target.value })} className="mt-2 h-11" /></div><div><Label htmlFor="ifsc">IFSC</Label><Input id="ifsc" maxLength={20} value={settings.ifsc} onChange={(event) => setSettings({ ...settings, ifsc: event.target.value.toUpperCase() })} className="mt-2 h-11" /></div><div><Label htmlFor="shipping-fee">Delivery fee (₹)</Label><Input id="shipping-fee" type="number" min="0" max="100000" step="0.01" required value={settings.shipping_paise} onChange={(event) => setSettings({ ...settings, shipping_paise: event.target.value })} className="mt-2 h-11" /></div>
        <div className="sm:col-span-2"><Label htmlFor="payment-qr">Store payment QR image</Label><div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">{(qrUrl || settings.qr_image_path) && <button type="button" title="Refresh QR preview" onClick={() => { if (settings.qr_image_path) void getProofUrl(settings.qr_image_path).then(setQrUrl).catch(showError); }} className="flex h-36 w-36 shrink-0 items-center justify-center border border-border bg-secondary">{qrUrl ? <img src={qrUrl} alt="Store payment QR preview" className="h-full w-full object-contain" /> : <span className="text-xs text-muted-foreground">Saved QR image</span>}</button>}<div className="flex min-w-0 flex-1 flex-col gap-3"><Input id="payment-qr" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setQrFile(event.target.files?.[0] ?? null)} className="h-11" /><Button type="button" variant="outline" disabled={!qrFile || qrBusy} onClick={() => void uploadQr()}>{qrBusy ? "Uploading…" : <>Upload QR image <UploadCloud className="ml-2 h-4 w-4" /></>}</Button><p className="text-xs text-muted-foreground">Image only · maximum 5 MB. Upload first, then save settings.</p></div></div></div>
        <label className="flex items-start gap-3 border-y border-border py-4 text-sm sm:col-span-2"><input type="checkbox" checked={settings.checkout_enabled} onChange={(event) => setSettings({ ...settings, checkout_enabled: event.target.checked })} className="mt-1 h-4 w-4 accent-primary" /><span><strong>Open checkout</strong><span className="mt-1 block text-muted-foreground">Customers can pay by transfer and submit orders with payment screenshots.</span></span></label>
        <Button type="submit" disabled={savingSettings} className="sm:col-span-2">{savingSettings ? "Saving…" : <>Save payment & delivery settings <Save className="ml-2 h-4 w-4" /></>}</Button>
      </form>
    </section>

    <section className="border-b border-border py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-accent-strong">Needs attention</p><h2 className="mt-2 font-display text-3xl font-extrabold">Payment review <span className="text-muted-foreground">({pending.length})</span></h2></div></div>
      {pending.length ? <div className="mt-6 divide-y divide-border border-y border-border">{pending.map((order) => <OrderAdminCard key={order.id} order={order} notes={notes} setNotes={setNotes} tracking={tracking} setTracking={setTracking} proofUrl={proofUrls[order.id]} proofBusy={proofBusy === order.id} onProof={() => void openProof(order)} onUpdate={handleOrderUpdate} />)}</div> : <p className="border-y border-border py-9 text-sm text-muted-foreground">No payments waiting for review.</p>}
    </section>

    <section className="border-b border-border py-10"><div><p className="text-xs font-bold uppercase text-accent-strong">After payment approval</p><h2 className="mt-2 font-display text-3xl font-extrabold">Delivery progress <span className="text-muted-foreground">({activeOrders.length})</span></h2><p className="mt-2 text-sm text-muted-foreground">Confirm each delivery stage to update the customer’s order history.</p></div>
      {activeOrders.length ? <div className="mt-6 divide-y divide-border border-y border-border">{activeOrders.map((order) => <OrderAdminCard key={order.id} order={order} notes={notes} setNotes={setNotes} tracking={tracking} setTracking={setTracking} proofUrl={proofUrls[order.id]} proofBusy={proofBusy === order.id} onProof={() => void openProof(order)} onUpdate={handleOrderUpdate} />)}</div> : <p className="mt-5 border-y border-border py-9 text-sm text-muted-foreground">Approved, active orders will appear here.</p>}
      {orders.filter((order) => order.status === "delivered").length > 0 && <p className="mt-5 text-sm text-muted-foreground">{orders.filter((order) => order.status === "delivered").length} delivered orders are in the order list above.</p>}
    </section>

    <section className="py-10"><div><p className="text-xs font-bold uppercase text-accent-strong">Catalogue</p><h2 className="mt-2 font-display text-3xl font-extrabold">Products & prices</h2></div><div className="mt-6 divide-y divide-border border-y border-border">{products.map((product) => { const draft = productDrafts[product.slug]; if (!draft) return null; return <article key={product.slug} className="grid gap-5 py-6 lg:grid-cols-[120px_1fr_160px]"><img src={product.image} alt={product.name} className="aspect-square w-28 bg-secondary object-cover" /><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor={`product-name-${product.slug}`}>Product name</Label><Input id={`product-name-${product.slug}`} value={draft.name} maxLength={120} onChange={(event) => setProductDrafts((current) => ({ ...current, [product.slug]: { ...draft, name: event.target.value } }))} className="mt-2 h-10" /></div><div><Label htmlFor={`product-price-${product.slug}`}>Price (₹)</Label><Input id={`product-price-${product.slug}`} type="number" min="1" max="100000" step="0.01" value={draft.price} onChange={(event) => setProductDrafts((current) => ({ ...current, [product.slug]: { ...draft, price: event.target.value } }))} className="mt-2 h-10" /></div><div className="sm:col-span-2"><Label htmlFor={`product-description-${product.slug}`}>Description</Label><Textarea id={`product-description-${product.slug}`} value={draft.description} maxLength={2000} onChange={(event) => setProductDrafts((current) => ({ ...current, [product.slug]: { ...draft, description: event.target.value } }))} className="mt-2 min-h-20" /></div><label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={draft.active} onChange={(event) => setProductDrafts((current) => ({ ...current, [product.slug]: { ...draft, active: event.target.checked } }))} className="h-4 w-4 accent-primary" />Visible in the shop</label></div><Button variant="outline" disabled={savingProduct === product.slug} onClick={() => void saveProduct(product.slug)}>{savingProduct === product.slug ? "Saving…" : <>Save product <Save className="ml-2 h-4 w-4" /></>}</Button></article>; })}</div>
    </section>

    <section className="border-t border-border py-8"><Button asChild variant="outline"><Link to="/"><ArrowUpRight className="mr-2 h-4 w-4" /> View storefront</Link></Button></section>
  </main><Footer /></div>;
};

function Stat({ label, count }: { label: string; count: number }) { return <div className="border-l-2 border-accent-strong pl-5"><p className="font-display text-4xl font-extrabold">{count}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>; }

function OrderAdminCard({ order, notes, setNotes, tracking, setTracking, proofUrl, proofBusy, onProof, onUpdate }: { order: StoreOrder; notes: Record<string, string>; setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>; tracking: Record<string, string>; setTracking: React.Dispatch<React.SetStateAction<Record<string, string>>>; proofUrl?: string; proofBusy: boolean; onProof: () => void; onUpdate: (order: StoreOrder, update: Parameters<ReturnType<typeof useStore>["updateOrder"]>[1], success: string) => Promise<void> }) {
  const stepIndex = DELIVERY.indexOf(order.status);
  const next = DELIVERY[stepIndex + 1];
  return <article className="grid gap-6 py-7 xl:grid-cols-[1fr_320px]"><div><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-muted-foreground">Order · {order.id.slice(0, 8).toUpperCase()}</p><h3 className="mt-1 font-display text-xl font-extrabold">{order.customer_name}</h3><p className="mt-1 text-sm text-muted-foreground">{order.email} · {order.phone}</p></div><span className="border border-border px-3 py-1 text-xs font-bold">{order.payment_status === "pending" ? "Payment review" : `Payment ${order.payment_status}`}</span></div>
    <p className="mt-4 text-sm leading-relaxed">{order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ""}{order.landmark ? `, ${order.landmark}` : ""}<br />{order.city}, {order.state} {order.postal_code}, {order.country}</p><ul className="mt-4 space-y-1 text-sm text-muted-foreground">{order.items.map((item) => <li key={item.slug}>{item.name} × {item.quantity} · {formatPrice(item.price_paise * item.quantity)}</li>)}</ul><p className="mt-3 font-bold">Total {formatPrice(order.total_paise)} <span className="font-normal text-muted-foreground">(delivery {formatPrice(order.shipping_paise)})</span></p>
    <div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" disabled={proofBusy} onClick={onProof}>{proofBusy ? "Loading screenshot…" : <>View payment screenshot <ExternalLink className="ml-2 h-4 w-4" /></>}</Button>{proofUrl && <a href={proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold underline underline-offset-4">Open again <ExternalLink className="ml-2 h-4 w-4" /></a>}</div>
    {order.status !== "ordered" || order.payment_status === "approved" ? <div className="mt-6 grid grid-cols-4 gap-2">{DELIVERY.map((step, index) => <div key={step} className="min-w-0"><span className={`flex h-8 w-8 items-center justify-center border ${index <= stepIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{index <= stepIndex ? <Check className="h-4 w-4" /> : index + 1}</span><p className="mt-2 text-xs text-muted-foreground">{deliveryLabel[step]}</p></div>)}</div> : null}
  </div><div className="space-y-4 border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
    {order.payment_status === "pending" && <><div><Label htmlFor={`note-${order.id}`}>Note for customer</Label><Textarea id={`note-${order.id}`} maxLength={500} placeholder="Optional note" value={notes[order.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [order.id]: event.target.value }))} className="mt-2 min-h-20" /></div><div className="grid grid-cols-2 gap-3"><Button onClick={() => void onUpdate(order, { payment_status: "approved", status: "ordered", admin_note: notes[order.id]?.trim() || null }, "Payment approved; order is confirmed")}><Check className="mr-2 h-4 w-4" />Approve payment</Button><Button variant="outline" onClick={() => void onUpdate(order, { payment_status: "rejected", admin_note: notes[order.id]?.trim() || "Payment could not be verified." }, "Payment marked for correction")}>Reject</Button></div></>}
    {order.payment_status === "rejected" && <div className="border-l-2 border-destructive pl-4"><p className="font-bold">Payment was not approved</p><p className="mt-1 text-sm text-muted-foreground">{order.admin_note || "No note provided."}</p></div>}
    {order.payment_status === "approved" && next && <><div><Label htmlFor={`tracking-${order.id}`}>Tracking number (optional)</Label><Input id={`tracking-${order.id}`} maxLength={100} value={tracking[order.id] ?? order.tracking_number ?? ""} onChange={(event) => setTracking((current) => ({ ...current, [order.id]: event.target.value }))} className="mt-2 h-10" /></div><Button className="w-full" onClick={() => void onUpdate(order, { status: next, tracking_number: tracking[order.id]?.trim() || order.tracking_number }, `Order marked ${deliveryLabel[next].toLowerCase()}`)}>Mark {deliveryLabel[next].toLowerCase()} <ChevronRight className="ml-2 h-4 w-4" /></Button>{order.admin_note && <p className="text-sm text-muted-foreground">Note: {order.admin_note}</p>}</>}
    {order.status === "delivered" && <div className="flex items-center gap-2 font-bold"><PackageCheck className="h-5 w-5 text-accent-strong" /> Delivered</div>}
  </div></article>;
}

export default Admin;