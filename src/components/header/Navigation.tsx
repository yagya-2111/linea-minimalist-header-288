import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Shop", href: "#shop" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "Why Sanjivani", href: "#why" },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="relative border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </Button>

        <Link to="/" className="font-display text-2xl font-extrabold uppercase text-foreground sm:text-3xl" aria-label="Sanjivani home">
          Sanjivani<span className="text-accent-strong">.</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-bold text-nav-foreground transition-colors hover:text-nav-hover">{link.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen((open) => !open)} aria-label="Search"><Search /></Button>
          <Button variant="ghost" size="icon" aria-label="Shopping bag" onClick={() => window.location.assign("#shop")}>
            <ShoppingBag />
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background p-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="font-display text-2xl font-bold">{link.label}</a>)}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background p-5">
          <div className="mx-auto flex max-w-2xl items-center gap-3 border-b-2 border-foreground pb-3">
            <Search className="text-muted-foreground" />
            <input autoFocus type="search" placeholder="Search Sanjivani blends" className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground" />
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;