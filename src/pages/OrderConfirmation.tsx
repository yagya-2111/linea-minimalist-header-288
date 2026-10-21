import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Clock3, Copy, MessageCircle } from "lucide-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { storeContact } from "@/lib/storeContact";

const steps = ["ordered", "packed", "shipped", "delivered"] as const;
const titles = { ordered: "Ordered", packed: "Packed", shipped: "Shipped", delivered: "Delivered" } as const;

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order") ?? "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Order received | Sanjivani";
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(orderId); setCopied(true); toast.success("Order number copied"); } catch { toast.error("Copy failed — select the number manually."); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="border-y border-border py-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-8 w-8" /></span>
          <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-5xl">Order received.</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">Your payment screenshot is with the store administrator for review. You will be contacted on your phone number once payment is verified.</p>
          {orderId && (
            <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 border border-border bg-secondary/60 px-4 py-3">
              <span className="text-xs font-bold uppercase text-muted-foreground">Order number</span>
              <code className="break-all text-sm font-bold">{orderId}</code>
              <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy</Button>
            </div>
          )}
        </div>
        <section className="mt-10">
          <h2 className="font-display text-2xl font-extrabold">What happens next</h2>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {steps.map((step, index) => (
              <div key={step} className="min-w-0">
                <span className={`flex h-9 w-9 items-center justify-center border ${index === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{index === 0 ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</span>
                <p className={`mt-2 text-xs font-semibold ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}>{titles[step]}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">Save your order number. You can check payment review and delivery progress anytime on the <Link to="/track" className="font-bold text-foreground underline underline-offset-4">Track your order</Link> page using this number and your phone.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 flex-1 font-bold"><Link to="/#shop">Continue shopping</Link></Button>
            <Button asChild variant="outline" className="h-12 flex-1 font-bold"><Link to="/track">Track your order</Link></Button>
            <Button asChild variant="outline" className="h-12 flex-1 font-bold"><a href={storeContact.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Ask on WhatsApp</a></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
