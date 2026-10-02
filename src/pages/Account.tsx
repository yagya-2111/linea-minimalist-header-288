import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Clock3, PackageCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, formatPrice, type StoreOrder, type StoreProfile } from "@/context/StoreContext";

type CustomerFields = Omit<StoreProfile, "user_id" | "email">;
const emptyCustomer: CustomerFields = { full_name: "", phone: "", alternate_phone: "", address_line1: "", address_line2: "", landmark: "", city: "", state: "", postal_code: "", country: "India" };
const statusSteps: StoreOrder["status"][] = ["ordered", "packed", "shipped", "delivered"];
const titles: Record<StoreOrder["status"], string> = { ordered: "Ordered", packed: "Packed", shipped: "Shipped", delivered: "Delivered" };

const Account = () => {
  const { user, profile, isAdmin, authLoading, profileLoading, orders, signIn, signUp, signOut, saveProfile } = useStore();
  const [params] = useSearchParams();
  const nextPath = params.get("next");
  const safeNextPath = nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : null;
  const [mode, setMode] = useState<"signin" | "signup">(params.get("create") === "1" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [details, setDetails] = useState<CustomerFields>(emptyCustomer);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setDetails({ ...profile, alternate_phone: profile.alternate_phone ?? "", address_line2: profile.address_line2 ?? "", landmark: profile.landmark ?? "" });
  }, [profile]);

  const formError = (error: unknown) => toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true);
    try {
      if (mode === "signin") await signIn(email, password);
      else await signUp(email, password, details);
      toast.success(mode === "signin" ? "Welcome back" : "Your account is ready");
    } catch (error) { formError(error); } finally { setBusy(false); }
  };
  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true);
    try { await saveProfile(details); toast.success("Your delivery details are saved"); } catch (error) { formError(error); } finally { setBusy(false); }
  };

  if (authLoading || profileLoading) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-5xl px-5 py-20"><p className="text-muted-foreground">Loading your account…</p></main><Footer /></div>;
  if (user && safeNextPath) return <Navigate to={safeNextPath} replace />;
  if (!user) return (
    <div className="min-h-screen bg-background"><Header /><main className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
      <section className="flex flex-col justify-center"><p className="text-xs font-extrabold uppercase text-accent-strong">Your Sanjivani account</p><h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{mode === "signin" ? "Welcome back." : "Make it yours."}</h1><p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{mode === "signin" ? "Sign in to see your orders and delivery progress." : "One account for your order history and delivery details."}</p><Link to="/#shop" className="mt-8 inline-flex items-center gap-2 font-bold">Explore the serums <ArrowRight className="h-4 w-4" /></Link></section>
      <form onSubmit={handleAuth} className="space-y-5 border-y border-border py-8 lg:border lg:p-8">
        <div><Label htmlFor="account-email">Email address</Label><Input id="account-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12" /></div>
        <div><Label htmlFor="account-password">Password</Label><Input id="account-password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12" /></div>
        {mode === "signup" && <div className="space-y-4 border-t border-border pt-5"><h2 className="font-display text-2xl font-bold">Delivery details</h2>
          <div><Label htmlFor="full-name">Full name</Label><Input id="full-name" required minLength={2} maxLength={120} value={details.full_name} onChange={(event) => setDetails({ ...details, full_name: event.target.value })} className="mt-2 h-12" /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="phone">Phone number</Label><Input id="phone" type="tel" required minLength={7} maxLength={30} value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} className="mt-2 h-12" /></div><div><Label htmlFor="alternate-phone">Alternate phone (optional)</Label><Input id="alternate-phone" type="tel" value={details.alternate_phone ?? ""} onChange={(event) => setDetails({ ...details, alternate_phone: event.target.value })} className="mt-2 h-12" /></div></div>
          {[{ key: "address_line1", label: "Address" }, { key: "address_line2", label: "Apartment, suite or area (optional)'" }, { key: "landmark", label: "Landmark (optional)" }, { key: "city", label: "City" }, { key: "state", label: "State" }, { key: "postal_code", label: "Postal code" }].map(({ key, label }) => <div key={key}><Label htmlFor={`signup-${key}`}>{label.replace("'", "")}</Label><Input id={`signup-${key}`} required={!key.endsWith("2") && key !== "landmark"} value={details[key as keyof CustomerFields] ?? ""} onChange={(event) => setDetails({ ...details, [key]: event.target.value })} className="mt-2 h-12" /></div>)}
        </div>}
        <Button type="submit" disabled={busy} className="h-12 w-full font-bold">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</Button>
        <p className="text-center text-sm text-muted-foreground">{mode === "signin" ? "New to Sanjivani?" : "Already have an account?"} <button type="button" className="font-bold text-foreground underline underline-offset-4" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create account" : "Sign in"}</button></p>
      </form>
    </main><Footer /></div>
  );

  if (!profile) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-xl px-5 py-20"><h1 className="font-display text-3xl font-extrabold">Finish your delivery details</h1><p className="mt-3 text-muted-foreground">Add a delivery address to start an order.</p><ProfileForm details={details} setDetails={setDetails} busy={busy} onSubmit={handleProfileSave} /></main><Footer /></div>;

  return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:py-16">
    <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase text-accent-strong">Sanjivani account</p><h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Hello, {profile.full_name.split(" ")[0]}.</h1><p className="mt-2 text-muted-foreground">{user.email}</p></div><div className="flex flex-wrap gap-3">{isAdmin && <Button asChild variant="outline"><Link to="/admin"><ShieldCheck /> Store admin</Link></Button>}<Button variant="outline" onClick={() => void signOut()}>Sign out</Button></div></div>
    <section className="grid gap-10 py-10 lg:grid-cols-[0.7fr_1.3fr]"><div><h2 className="font-display text-2xl font-extrabold">Delivery details</h2><p className="mt-2 text-sm text-muted-foreground">Used for your orders and delivery updates.</p><details className="mt-5 border-y border-border"><summary className="cursor-pointer py-4 font-bold">Edit your details</summary><ProfileForm details={{ ...profile, alternate_phone: profile.alternate_phone ?? "", address_line2: profile.address_line2 ?? "", landmark: profile.landmark ?? "" }} setDetails={setDetails} busy={busy} onSubmit={handleProfileSave} /></details></div>
      <div><div className="mb-5 flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-extrabold">Your orders</h2><Button asChild variant="outline"><Link to="/#shop"><ShoppingBag /> Shop serums</Link></Button></div>{orders.length ? <div className="divide-y divide-border border-y border-border">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <div className="border-y border-border py-12 text-center"><PackageCheck className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-4 font-bold">No orders yet</p><p className="mt-1 text-sm text-muted-foreground">Your order history will appear here.</p><Button asChild className="mt-5"><Link to="/#shop">Explore serums</Link></Button></div>}</div></section>
  </main><Footer /></div>;
};

function ProfileForm({ details, setDetails, busy, onSubmit }: { details: CustomerFields; setDetails: (next: CustomerFields) => void; busy: boolean; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <form onSubmit={onSubmit} className="space-y-4 py-5">{[{ key: "full_name", label: "Full name" }, { key: "phone", label: "Phone number" }, { key: "alternate_phone", label: "Alternate phone" }, { key: "address_line1", label: "Address" }, { key: "address_line2", label: "Apartment, suite or area" }, { key: "landmark", label: "Landmark" }, { key: "city", label: "City" }, { key: "state", label: "State" }, { key: "postal_code", label: "Postal code" }].map(({ key, label }) => <div key={key}><Label htmlFor={`profile-${key}`}>{label}</Label><Input id={`profile-${key}`} required={["full_name", "phone", "address_line1", "city", "state", "postal_code"].includes(key)} value={details[key as keyof CustomerFields] ?? ""} onChange={(event) => setDetails({ ...details, [key]: event.target.value })} className="mt-2 h-11" /></div>)}<Button type="submit" disabled={busy} className="w-full">Save details</Button></form>;
}

function OrderCard({ order }: { order: StoreOrder }) {
  const stepIndex = statusSteps.indexOf(order.status);
  return <article className="py-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase text-muted-foreground">Order · {order.id.slice(0, 8).toUpperCase()}</p><p className="mt-1 font-bold">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div><p className="font-display text-xl font-extrabold">{formatPrice(order.total_paise)}</p></div><div className="mt-5 grid grid-cols-4 gap-2">{statusSteps.map((step, index) => <div key={step} className="min-w-0"><span className={`flex h-8 w-8 items-center justify-center border ${index <= stepIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{index < stepIndex ? <Check className="h-4 w-4" /> : index === stepIndex ? <Clock3 className="h-4 w-4" /> : index + 1}</span><p className={`mt-2 text-xs font-semibold ${index <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}>{titles[step]}</p></div>)}</div><div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-4 text-sm"><span>Payment <strong>{order.payment_status === "approved" ? "Approved" : order.payment_status === "rejected" ? "Not approved" : "Under review"}</strong></span>{order.tracking_number && <span>Tracking: {order.tracking_number}</span>}</div><ul className="mt-3 space-y-1 text-sm text-muted-foreground">{order.items.map((item) => <li key={item.slug}>{item.name} × {item.quantity}</li>)}</ul>{order.admin_note && <p className="mt-3 text-sm text-muted-foreground">{order.admin_note}</p>}</article>;
}

export default Account;