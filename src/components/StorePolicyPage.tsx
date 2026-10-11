import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { storeContact } from "@/lib/storeContact";

type PolicySection = { title: string; text: string };

export default function StorePolicyPage({ title, intro, sections }: { title: string; intro: string; sections: PolicySection[] }) {
  useEffect(() => { document.title = `${title} | Sanjivani`; }, [title]);
  return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
    <Link to="/#shop" className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Back to shop</Link>
    <header className="mt-8 border-b border-border pb-8"><p className="text-xs font-bold uppercase text-accent-strong">Sanjivani · Customer care</p><h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">{title}</h1><p className="mt-4 leading-relaxed text-muted-foreground">{intro}</p><p className="mt-4 text-xs text-muted-foreground">Last updated: October 11, 2026</p></header>
    <div className="space-y-8 py-8">{sections.map((section) => <section key={section.title}><h2 className="font-display text-2xl font-bold">{section.title}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p></section>)}</div>
    <section className="border-y border-border py-8"><h2 className="font-display text-2xl font-bold">Speak to Sanjivani</h2><p className="mt-3 text-muted-foreground">For order questions, include your order number. Never share your password, PIN or OTP.</p><div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="outline"><a href={storeContact.phoneHref}><Phone className="h-4 w-4" />{storeContact.display}</a></Button><Button asChild><a href={storeContact.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp support</a></Button></div></section>
    <nav aria-label="Store policies" className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">{[["/privacy-policy", "Privacy"], ["/shipping-policy", "Shipping"], ["/return-policy", "Returns & refunds"], ["/terms-of-service", "Terms of use"]].map(([href, label]) => <Link key={href} to={href} className="underline underline-offset-4">{label}</Link>)}</nav>
  </main><Footer /></div>;
}