import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanjivaniProducts } from "@/components/product/sanjivaniCatalog";

const links = [
  { label: "Shop", href: "/#shop" },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Why Sanjivani", href: "/#why" },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = sanjivaniProducts.filter((product) =>
    `${product.name} ${product.ingredients} ${product.tagline}`.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

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
            <Link key={link.label} to={link.href} className="text-sm font-bold text-nav-foreground transition-colors hover:text-nav-hover">{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen((open) => !open)} aria-label="Search"><Search /></Button>
          <Button asChild variant="outline" className="ml-2 hidden rounded-sm font-bold sm:inline-flex"><Link to="/#shop">Shop blends</Link></Button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background p-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className="font-display text-2xl font-bold">{link.label}</Link>)}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background p-5">
          <div className="mx-auto flex max-w-2xl items-center gap-3 border-b-2 border-foreground pb-3">
            <Search className="text-muted-foreground" />
            <input autoFocus type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search Sanjivani blends" aria-label="Search Sanjivani blends" className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground" />
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></Button>
          </div>
          {searchTerm.trim() && (
            <div className="mx-auto mt-4 max-w-2xl divide-y divide-border">
              {filteredProducts.length ? filteredProducts.map((product) => (
                <Link key={product.slug} to={`/products/${product.slug}`} onClick={() => { setSearchOpen(false); setSearchTerm(""); }} className="flex items-center justify-between gap-4 py-3 hover:text-accent-strong">
                  <span><span className="block font-bold">{product.name}</span><span className="text-sm text-muted-foreground">{product.ingredients}</span></span>
                  <span className="shrink-0 font-bold">₹699</span>
                </Link>
              )) : <p className="py-4 text-sm text-muted-foreground">No blends found. Try a product or ingredient name.</p>}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;