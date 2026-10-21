import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";

// Shopping is account-free. This page is only for the store owner to sign in
// and manage the store; customers never need an account to order.
const Account = () => {
  const { user, isAdmin, authLoading, signIn, signOut } = useStore();
  const [params] = useSearchParams();
  const nextPath = params.get("next");
  const safeNextPath = nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Store owner sign in | Sanjivani";
  }, []);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true);
    try {
      await signIn(email, password);
      toast.success("Signed in");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  if (authLoading) return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-5xl px-5 py-20"><p className="text-muted-foreground">Loading…</p></main><Footer /></div>;
  if (user && safeNextPath && isAdmin) return <Navigate to={safeNextPath} replace />;
  if (user && isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
        <section className="flex flex-col justify-center">
          <p className="text-xs font-extrabold uppercase text-accent-strong">Sanjivani store</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">Store owner sign in.</h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">This sign-in is for the store administrator only. Shopping never needs an account — add a drop to your bag and check out directly.</p>
          <Link to="/#shop" className="mt-8 inline-flex items-center gap-2 font-bold">Explore the drops <ArrowRight className="h-4 w-4" /></Link>
        </section>
        {user && !isAdmin ? (
          <div className="space-y-5 border-y border-border py-8 lg:border lg:p-8">
            <h2 className="font-display text-2xl font-bold">This sign-in is for the store owner.</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">Shopping and ordering stay open to everyone without an account. To manage the store, sign in with the administrator account.</p>
            <Button variant="outline" onClick={() => void signOut()}>Sign out</Button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-5 border-y border-border py-8 lg:border lg:p-8">
            <div><Label htmlFor="account-email">Email address</Label><Input id="account-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12" /></div>
            <div><Label htmlFor="account-password">Password</Label><Input id="account-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12" /></div>
            <Button type="submit" disabled={busy} className="h-12 w-full font-bold"><ShieldCheck className="mr-2 h-4 w-4" />{busy ? "Please wait…" : "Sign in"}</Button>
            <p className="text-center text-sm text-muted-foreground">Only the store administrator uses this page.</p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;
