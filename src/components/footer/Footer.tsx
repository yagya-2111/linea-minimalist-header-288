import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-primary px-6 pb-6 pt-14 text-primary-foreground">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-4xl font-extrabold uppercase text-accent">Sanjivani.</p>
            <p className="mb-6 mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/70">
              Plant-powered daily nutrition, rooted in tradition and made for modern life.
            </p>
            <p className="text-sm text-primary-foreground/70">Thoughtful botanical blends for everyday wellness.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-4 text-sm font-bold text-accent">Shop</h4>
              <ul className="space-y-2">{[{ name: "Daily Vitality", slug: "daily-vitality" }, { name: "Gut Glow", slug: "gut-glow" }, { name: "Daily Greens", slug: "daily-greens" }, { name: "Calm Cacao", slug: "calm-cacao" }].map((item) => <li key={item.slug}><Link to={`/products/${item.slug}`} className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">{item.name}</Link></li>)}</ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold text-accent">Help</h4>
              <ul className="space-y-2">{[{ label: "Ingredients", href: "/#ingredients" }, { label: "Why Sanjivani", href: "/#why" }, { label: "My account", href: "/account" }, { label: "My bag", href: "/bag" }].map((item) => <li key={item.label}><Link to={item.href} className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">{item.label}</Link></li>)}</ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold text-accent">Your orders</h4>
              <ul className="space-y-2"><li><Link to="/account" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">Order history</Link></li><li><Link to="/terms-of-service" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">Terms & delivery</Link></li></ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-5 md:flex-row">
          <p className="text-sm text-primary-foreground/60">© 2026 Sanjivani. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">Privacy</Link>
            <Link to="/terms-of-service" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;