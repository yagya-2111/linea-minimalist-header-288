import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Sanjivani";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12 border-b border-border pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Sanjivani</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: October 1, 2026</p>
        </header>
        <div className="space-y-10">
          <section><h2 className="font-display text-2xl font-bold">About this preview</h2><p className="mt-3 leading-relaxed text-muted-foreground">This Sanjivani website is currently a product catalogue preview. It does not accept orders or process payments. Newsletter submission currently displays a confirmation only; the email address entered is not stored or sent.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Information and use</h2><p className="mt-3 leading-relaxed text-muted-foreground">If you contact Sanjivani directly, we may receive the information you choose to provide, such as your name, email address, and message. We use it only to respond to your enquiry and handle related support. Do not submit sensitive personal or health information through this website.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Cookies and technical data</h2><p className="mt-3 leading-relaxed text-muted-foreground">Your browser or hosting provider may process basic technical information needed to deliver and secure the website. This preview does not intentionally use advertising trackers or store newsletter form entries. Browser settings can be used to manage cookies, though disabling essential browser features may affect site operation.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Sharing, retention, and security</h2><p className="mt-3 leading-relaxed text-muted-foreground">Information you send by direct contact may be handled by service providers that support communications or website operation, or disclosed when required by law. It is retained only as needed for the enquiry or applicable legal requirements. No online service can guarantee absolute security.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Your choices</h2><p className="mt-3 leading-relaxed text-muted-foreground">You may ask to access, correct, or delete personal information you have sent to us, subject to applicable law. To make a privacy enquiry, use the contact details provided by the Sanjivani business through its official channels; no verified business contact details have been supplied for this preview.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Policy updates</h2><p className="mt-3 leading-relaxed text-muted-foreground">This notice may be updated as the website and its services change. The date at the top indicates the latest revision.</p></section>
          <p className="border-l-4 border-accent bg-secondary/70 p-4 text-sm leading-relaxed text-secondary-foreground">This preview policy is general information, not legal advice. Confirm the operating entity, contact details, and actual data practices before opening the store to customers.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;