import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

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
          <p className="mt-4 text-sm text-muted-foreground">Last updated: October 1, 2026</p>
        </header>
        <div className="space-y-10">
          <section><h2 className="font-display text-2xl font-bold">Catalogue preview</h2><p className="mt-3 leading-relaxed text-muted-foreground">This website is provided as a Sanjivani product catalogue preview. Prices shown in Indian rupees are illustrative display prices. The site does not currently accept orders, take payment, or confirm product availability, delivery, or a sale.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Product and health information</h2><p className="mt-3 leading-relaxed text-muted-foreground">Product names, images, ingredient descriptions, preparation suggestions, and benefits are illustrative catalogue content and may not reflect final commercial products or packaging. They are not medical advice, a diagnosis, or a promise to prevent, treat, or cure a condition. Review the actual product label and consult an appropriately qualified professional about health or dietary questions.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Sample reviews</h2><p className="mt-3 leading-relaxed text-muted-foreground">Reviews and ratings on this preview are fictional examples created to demonstrate page layout. They are not genuine customer statements, verified purchases, or evidence of product results.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Use of the website</h2><p className="mt-3 leading-relaxed text-muted-foreground">You may browse this site for personal, non-commercial purposes. You must not misuse the website, interfere with its operation, attempt unauthorised access, or reproduce its content for commercial use without permission.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Intellectual property</h2><p className="mt-3 leading-relaxed text-muted-foreground">Website text, visual design, brand marks, and images are presented for this Sanjivani preview. Rights remain with their respective owners. No licence to use them commercially is granted by browsing this site.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Changes and availability</h2><p className="mt-3 leading-relaxed text-muted-foreground">The preview may be changed, suspended, or removed without notice. Content may be incomplete or contain errors; it should not be relied upon as a live offer to sell goods.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Applicable terms and contact</h2><p className="mt-3 leading-relaxed text-muted-foreground">Mandatory consumer rights and applicable law are not limited by this notice. The operating business, jurisdiction, and verified contact details have not been supplied for this preview; final terms should be reviewed and completed by the Sanjivani business before accepting orders.</p></section>
          <p className="border-l-4 border-accent bg-secondary/70 p-4 text-sm leading-relaxed text-secondary-foreground">This is a general preview notice, not legal advice. No shipping, returns, payment, or warranty terms are represented as active because checkout is not enabled.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;