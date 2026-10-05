import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanjivaniProducts } from "@/components/product/sanjivaniCatalog";
import { formatPrice, useStore } from "@/context/StoreContext";
import { toast } from "sonner";

const MobileBuyBar = () => {
  const { pathname } = useLocation();
  const { products, productPrices, cart, addToCart } = useStore();
  const slug = pathname.startsWith("/products/") ? pathname.split("/")[2] : "daily-vitality";
  const product = pathname.startsWith("/products/")
    ? sanjivaniProducts.find((item) => item.slug === slug && products.some((available) => available.slug === slug && available.active !== false))
    : sanjivaniProducts.find((item) => products.some((available) => available.slug === item.slug && available.active !== false));
  const bagCount = cart.reduce((total, line) => total + line.quantity, 0);

  if (pathname === "/checkout") return <aside aria-label="Mobile checkout bar" className="mobile-buy-bar">
    <div className="mx-auto flex max-w-lg items-center justify-between gap-4"><div><p className="font-display text-base font-extrabold">Checkout</p><p className="text-xs text-muted-foreground">Confirm details and pay online</p></div><Button className="h-11 shrink-0 rounded-sm font-bold" onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}>Continue <ArrowRight /></Button></div>
  </aside>;

  if (pathname === "/bag" && bagCount > 0) return <aside aria-label="Mobile checkout bar" className="mobile-buy-bar">
    <div className="mx-auto flex max-w-lg items-center justify-between gap-4"><div><p className="font-display text-base font-extrabold">Your bag</p><p className="text-xs text-muted-foreground">{bagCount} {bagCount === 1 ? "item" : "items"} · Online payment</p></div><Button asChild className="h-11 shrink-0 rounded-sm font-bold"><Link to="/checkout">Checkout <ArrowRight /></Link></Button></div>
  </aside>;

  if (!product) return null;
  const name = products.find((item) => item.slug === product.slug)?.name ?? product.name;

  return <aside aria-label="Mobile buy bar" className="mobile-buy-bar px-3">
    <div className="mx-auto flex max-w-lg items-center gap-2.5">
      <Link to={`/products/${product.slug}`} className="h-12 w-12 shrink-0 overflow-hidden bg-secondary" aria-label={`View ${name}`}><img src={product.image} alt="" className="h-full w-full object-cover" /></Link>
      <div className="min-w-0 flex-1"><p className="truncate font-display text-sm font-extrabold">{name}</p><p className="text-sm font-bold text-accent-strong">{formatPrice(productPrices[product.slug] ?? 69900)}</p></div>
      <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-sm border-primary" aria-label={`Add ${name} to bag`} onClick={() => { addToCart(product.slug); toast.success(`${name} added to your bag`); }}><ShoppingBag /></Button>
      <Button asChild className="h-11 shrink-0 rounded-sm px-3 font-bold"><Link to={`/checkout?buy=${product.slug}`}>Buy now <ArrowRight /></Link></Button>
    </div>
  </aside>;
};

export default MobileBuyBar;