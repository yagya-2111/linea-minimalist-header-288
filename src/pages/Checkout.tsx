import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, LockKeyhole, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore, formatPrice } from "@/context/StoreContext";
import paymentQr from "@/assets/sanjivani-payment-qr.png.asset.json";

const Checkout = () => {
  const { user, profile, authLoading, profileLoading, cart, products, productPrices, paymentSettings, submitOrder, getProofUrl } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buySlug = searchParams.get("buy") ?? undefined;
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);

  const lines = useMemo(() => (buySlug ? [{ slug: buySlug, quantity: 1 }] : cart).flatMap((line) => {
    const product = products.find((item) => item.slug === line.slug);
    const price = productPrices[line.slug];
    return product && product.active !== false && price !== undefined ? [{ ...line, product, price }] : [];
  }), [buySlug, cart, productPrices, products]);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = paymentSettings?.shipping_paise ?? 0;
  const qrPath = paymentSettings?.qr_image_path;
  const isDemoPayment = Boolean(paymentSettings?.upi_id.endsWith(".invalid"));
  const showDefaultQr = !qrPath;
  const hasPaymentDetails = Boolean(paymentSettings && (isDemoPayment || (paymentSettings.checkout_enabled && paymentSettings.shipping_paise != null && (paymentSettings.upi_id.trim() || paymentSettings.account_number.trim()))));

  useEffect(() => {
    if (!qrPath) { setQrUrl(null); return; }
    let active = true;
    void getProofUrl(qrPath).then((url) => { if (active) setQrUrl(url); }).catch(() => { if (active) setQrUrl(null); });
    return () => { active = false; };
  }, [getProofUrl, qrPath]);

  useEffect(() => {
    if (!proof) { setPreview(null); return; }
    const url = URL.createObjectURL(proof);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!proof) { toast.error("Add your payment screenshot to continue."); return; }
    setBusy(true);
    try {
      const orderId = await submitOrder(proof, buySlug);
      toast.success("Your order is under review");
      navigate(`/account?order=${encodeURIComponent(orderId)}`);
    } catch (error) { toast.error(error instanceof Error ? error.message : "We could not submit your order."); }
    finally { setBusy(false); }
  };

  if (authLoading || profileLoading) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-6xl px-5 py-20 text-muted-foreground">Loading checkout…</main><Footer /></div>;
  if (!user) return <Navigate to={`/account?next=${encodeURIComponent(`/checkout${buySlug ? `?buy=${encodeURIComponent(buySlug)}` : ""}`)}`} replace />;
  if (!profile) return <Navigate to="/account" replace />;
  if (!lines.length) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-3xl px-5 py-20"><h1 className="font-display text-4xl font-extrabold">{buySlug ? "This serum is unavailable" : "Your bag is empty"}</h1><Button asChild className="mt-6"><Link to="/#shop">Explore serums</Link></Button></main><Footer /></div>;

  return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16"><Link to={buySlug ? `/products/${buySlug}` : "/bag"} className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> {buySlug ? "Back to serum" : "Back to your bag"}</Link><h1 className="mt-6 font-display text-4xl font-extrabold sm:text-5xl">Checkout</h1><p className="mt-2 text-muted-foreground">Confirm delivery details, then pay online. Cash on delivery is not available.</p>
    {!hasPaymentDetails ? <section className="mt-9 border-y border-border py-10"><h2 className="font-display text-2xl font-bold">Checkout is temporarily unavailable</h2><p className="mt-2 max-w-xl text-muted-foreground">Payment instructions and delivery fee are not configured yet. Please check back later.</p><Button asChild variant="outline" className="mt-6"><Link to="/bag">Return to bag</Link></Button></section> : <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]"><div className="space-y-8">
      <section className="border-y border-border py-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase text-muted-foreground">Step 1 · Confirm delivery</p><h2 className="mt-2 font-display text-xl font-extrabold">{profile.full_name}</h2></div><Button asChild variant="outline" size="sm"><Link to="/account">Edit details</Link></Button></div><p className="mt-3 text-sm">{user.email}</p><p className="mt-1 text-sm text-muted-foreground">{profile.phone}{profile.alternate_phone ? ` · ${profile.alternate_phone}` : ""}<br />{profile.address_line1}{profile.address_line2 ? `, ${profile.address_line2}` : ""}{profile.landmark ? `, ${profile.landmark}` : ""}<br />{profile.city}, {profile.state} {profile.postal_code}, {profile.country}</p><label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-sm"><input type="checkbox" checked={detailsConfirmed} onChange={(event) => setDetailsConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" /><span><strong>My name, contact number, and delivery address are correct.</strong><span className="mt-1 block text-muted-foreground">The store uses these details to deliver your order.</span></span></label>{!paymentStep && <Button type="button" disabled={!detailsConfirmed} onClick={() => setPaymentStep(true)} className="mt-5 h-12 w-full font-bold"><CreditCard className="mr-2 h-4 w-4" />Continue to payment</Button>}</section>
      {paymentStep && <section className="border-y border-border py-6"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-secondary"><CreditCard className="h-4 w-4" /></span><div><p className="text-xs font-bold uppercase text-muted-foreground">Step 2 · Payment</p><h2 className="font-display text-2xl font-extrabold">Pay by UPI or bank transfer</h2><p className="text-sm text-muted-foreground">Pay the exact order total shown on the right.</p></div></div>
        {isDemoPayment && <div role="note" className="mt-5 border border-destructive/40 bg-destructive/5 p-4 text-sm"><strong>DEMO ONLY — DO NOT SEND MONEY.</strong><p className="mt-1 text-muted-foreground">The sample payment details below are not real and cannot accept payment. Order submission is disabled until verified payment details are added.</p></div>}
        {!isDemoPayment && <div role="note" className="mt-5 border border-border bg-secondary/50 p-4 text-sm"><strong>Why direct payment?</strong><p className="mt-1 text-muted-foreground">We currently accept UPI and bank transfer directly while our integrated payment gateway is being finalized. Every payment is matched with your private screenshot and reviewed before the order is confirmed. If you need help, call or WhatsApp 9131338236.</p></div>}
        {(qrUrl || showDefaultQr) && <div className="mt-6 flex flex-col items-start gap-3"><img src={showDefaultQr ? paymentQr.url : qrUrl ?? ""} alt="SM Trading UPI payment QR code" className="h-52 w-52 border border-border bg-background object-contain" /><p className="text-xs text-muted-foreground">Scan to pay SM Trading, or use the verified details below.</p></div>}
        <dl className="mt-6 divide-y divide-border border-y border-border">{paymentSettings.upi_id && <div className="flex flex-wrap justify-between gap-3 py-3"><dt className="text-sm text-muted-foreground">UPI ID</dt><dd className="break-all text-right font-bold">{paymentSettings.upi_id}</dd></div>}{paymentSettings.payee_name && <div className="flex flex-wrap justify-between gap-3 py-3"><dt className="text-sm text-muted-foreground">Payee</dt><dd className="text-right font-bold">{paymentSettings.payee_name}</dd></div>}{paymentSettings.bank_name && <div className="flex flex-wrap justify-between gap-3 py-3"><dt className="text-sm text-muted-foreground">Bank</dt><dd className="text-right font-bold">{paymentSettings.bank_name}</dd></div>}{paymentSettings.account_name && <div className="flex flex-wrap justify-between gap-3 py-3"><dt className="text-sm text-muted-foreground">Account name</dt><dd className="text-right font-bold">{paymentSettings.account_name}</dd></div>}{paymentSettings.account_number && <div className="flex flex-wrap justify-between gap-3 py-3"><dt className="text-sm text-muted-foreground">Account number</dt><dd className="text-right font-bold">{paymentSettings.account_number}</dd></div>}{paymentSettings.ifsc && <div className="flex flex-wrap justify-between gap-3 py-3"><dt className="text-sm text-muted-foreground">IFSC</dt><dd className="text-right font-bold">{paymentSettings.ifsc}</dd></div>}</dl>
        {!isDemoPayment && <div className="mt-7"><Label htmlFor="payment-proof">Payment screenshot <span className="text-destructive">*</span></Label><p className="mt-1 text-sm text-muted-foreground">Upload a clear screenshot of your completed transfer. JPG, PNG or WebP · up to 5 MB.</p><label htmlFor="payment-proof" className="mt-3 flex min-h-36 cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-secondary/50 p-5 text-center transition-colors hover:bg-secondary">{preview ? <img src={preview} alt="Payment screenshot preview" className="max-h-64 max-w-full object-contain" /> : <><UploadCloud className="h-7 w-7 text-muted-foreground" /><span className="mt-3 font-bold">Choose payment screenshot</span><span className="mt-1 text-xs text-muted-foreground">Only you and the store administrator can view this image.</span></>}<input id="payment-proof" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setProof(event.target.files?.[0] ?? null)} required /></label>{proof && <p className="mt-2 break-all text-xs text-muted-foreground">{proof.name}</p>}</div>}
      </section>}
      {paymentStep && !isDemoPayment && <div className="flex items-start gap-3 text-sm text-muted-foreground"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" /><p>Payment screenshots are stored privately. Your order stays under review until the store administrator verifies payment.</p></div>}
    </div><aside className="h-fit border-y border-border py-6 lg:border lg:p-6"><h2 className="font-display text-xl font-extrabold">Order summary</h2><div className="mt-5 divide-y divide-border">{lines.map((line) => <div key={line.slug} className="flex justify-between gap-4 py-3 text-sm"><span>{line.product.name} × {line.quantity}</span><strong>{formatPrice(line.price * line.quantity)}</strong></div>)}</div><div className="mt-4 flex justify-between border-t border-border pt-4 text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="mt-3 flex justify-between text-sm"><span>Delivery</span><span>{formatPrice(shipping)}</span></div><div className="mt-5 flex justify-between border-t border-border pt-5 text-lg font-extrabold"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>{paymentStep && !isDemoPayment && <><Button type="submit" disabled={busy || !proof || !paymentSettings?.checkout_enabled} className="mt-6 h-12 w-full font-bold">{busy ? "Submitting order…" : <>Place order <Check className="ml-2 h-4 w-4" /></>}</Button><p className="mt-4 text-center text-xs text-muted-foreground">Order confirmation follows payment review.</p></>}{paymentStep && isDemoPayment && <p className="mt-6 border-t border-border pt-4 text-center text-sm font-bold text-muted-foreground">Demo mode · Orders cannot be placed</p>}</aside></form>}
  </main><Footer /></div>;
};

export default Checkout;