import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import { storeContact } from "@/lib/storeContact";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Use | Sanjivani";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12 border-b border-border pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Sanjivani</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Terms of Use</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: October 12, 2026</p>
        </header>
        <div className="space-y-10">
          <section><h2 className="font-display text-2xl font-bold">Orders and payment</h2><p className="mt-3 leading-relaxed text-muted-foreground">Orders are submitted after online transfer by UPI or bank transfer and a payment screenshot. An order remains under review until the store administrator verifies the payment. Cash on delivery is not offered. An order is not confirmed until payment is approved.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Product and health information</h2><p className="mt-3 leading-relaxed text-muted-foreground">Product images and descriptions provide information about the listed drops. Check the actual package for the complete ingredient list, serving instructions, and precautions. Product information is not medical advice or a promise to prevent, treat, or cure a condition. Consult a qualified professional about health or dietary questions.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Order updates</h2><p className="mt-3 leading-relaxed text-muted-foreground">Customers can view payment review and delivery progress in their account. Delivery stages are updated by the store administrator. Any tracking information shown is supplied by the store.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Use of the website</h2><p className="mt-3 leading-relaxed text-muted-foreground">You may browse this site for personal, non-commercial purposes. You must not misuse the website, interfere with its operation, attempt unauthorised access, or reproduce its content for commercial use without permission.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Intellectual property</h2><p className="mt-3 leading-relaxed text-muted-foreground">Website text, visual design, brand marks, and images are provided for use with the Sanjivani storefront. You may not reproduce them commercially without permission.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Availability and policies</h2><p className="mt-3 leading-relaxed text-muted-foreground">Prices, available products, delivery charges, and service availability are shown during ordering and may change. Applicable consumer rights and laws continue to apply.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Shipping, returns and refunds</h2><p className="mt-3 leading-relaxed text-muted-foreground">Orders can be cancelled at any time until they are delivered. Returns are accepted within 7 days of delivery, and approved refunds are processed within 2 working days to the original mode of payment. Read the <Link to="/shipping-policy" className="font-semibold underline">Shipping Policy</Link> and <Link to="/return-policy" className="font-semibold underline">Returns & Refunds</Link> pages for the full terms.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Contact</h2><p className="mt-3 leading-relaxed text-muted-foreground">For order support, call <a href={storeContact.phoneHref} className="font-semibold underline">{storeContact.display}</a> or <a href={storeContact.whatsappHref} target="_blank" rel="noreferrer" className="font-semibold underline">message WhatsApp support</a>.</p></section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;