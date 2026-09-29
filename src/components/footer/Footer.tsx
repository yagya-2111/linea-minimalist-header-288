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
            <div className="space-y-4 text-sm text-primary-foreground/70">
              <div><p className="mb-1 font-bold text-primary-foreground">Need help?</p><p>Monday–Saturday · 9am–6pm IST</p></div>
              <div><p className="mb-1 font-bold text-primary-foreground">Contact</p><p>care@sanjivani.example</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-4 text-sm font-bold text-accent">Shop</h4>
              <ul className="space-y-2">{["Daily Vitality", "Gut Glow", "Daily Greens", "Calm Cacao"].map((item) => <li key={item}><a href="#shop" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">{item}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold text-accent">Help</h4>
              <ul className="space-y-2">{["How to use", "Ingredients", "Delivery", "Returns", "Contact"].map((item) => <li key={item}><a href="#" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">{item}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold text-accent">Follow</h4>
              <ul className="space-y-2">{["Instagram", "YouTube", "Newsletter"].map((item) => <li key={item}><a href="#" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent">{item}</a></li>)}</ul>
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