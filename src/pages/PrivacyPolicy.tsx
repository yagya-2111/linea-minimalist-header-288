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
          <p className="mt-4 text-sm text-muted-foreground">Last updated: October 2, 2026</p>
        </header>
        <div className="space-y-10">
          <section><h2 className="font-display text-2xl font-bold">Information collected</h2><p className="mt-3 leading-relaxed text-muted-foreground">When you create an account, we store your email, name, phone number, and delivery address. When you place an order, we store its items, total, payment-review status, delivery progress, and the payment screenshot you submit.</p></section>
          <section><h2 className="font-display text-2xl font-bold">How information is used</h2><p className="mt-3 leading-relaxed text-muted-foreground">Account and order information is used to provide account access, review payment proof, prepare and deliver orders, and show order history. The store administrator can access information needed to fulfil and support your order.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Payment screenshots</h2><p className="mt-3 leading-relaxed text-muted-foreground">Payment screenshots are kept in private storage and can be viewed by you and authorized store administrators for order review. Do not upload screenshots containing unrelated sensitive information.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Security and retention</h2><p className="mt-3 leading-relaxed text-muted-foreground">Access controls restrict customer records to their owner and authorized store administration. Records may be retained as needed for order fulfilment, support, security, and legal obligations.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Your choices</h2><p className="mt-3 leading-relaxed text-muted-foreground">You can review and update your delivery details from your account. For requests about account data or deletion, contact the Sanjivani store through its official business channel.</p></section>
          <section><h2 className="font-display text-2xl font-bold">Policy updates</h2><p className="mt-3 leading-relaxed text-muted-foreground">This notice may be updated as the website and its services change. The date at the top indicates the latest revision.</p></section>
          <p className="border-l-4 border-accent bg-secondary/70 p-4 text-sm leading-relaxed text-secondary-foreground">This notice describes the account and order features currently provided by the store. The business should confirm its contact details and legal obligations before accepting customer orders.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;