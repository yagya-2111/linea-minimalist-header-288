import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { findSanjivaniProduct, sanjivaniProducts } from "@/components/product/sanjivaniCatalog";
import { useStore, formatPrice } from "@/context/StoreContext";
import { toast } from "sonner";

const SanjivaniProduct = () => {
  const { slug } = useParams();
  const { products, productPrices, addToCart } = useStore();
  const product = findSanjivaniProduct(slug);
  const storeProduct = products.find((item) => item.slug === slug);
  const productName = storeProduct?.name ?? product?.name;
  const productDescription = storeProduct?.description || product?.description;
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    document.title = productName ? `${productName} | Sanjivani` : "Sanjivani Product Catalogue";
  }, [productName]);

  useEffect(() => {
    setActiveImage(0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Sanjivani catalogue</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold">We couldn’t find that blend.</h1>
          <p className="mt-4 text-muted-foreground">Explore the current Sanjivani collection instead.</p>
          <Button asChild className="mt-8 rounded-sm font-bold"><Link to="/#shop">Browse all blends <ArrowRight /></Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = sanjivaniProducts.filter((item) => item.slug !== product.slug && products.some((available) => available.slug === item.slug && available.active !== false));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <Link to="/#shop" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All blends</Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <section aria-label={`${product.name} product images`}>
              <div className="group relative aspect-square overflow-hidden bg-muted">
                <img key={product.gallery[activeImage].src} src={product.gallery[activeImage].src} alt={product.gallery[activeImage].alt} width={1024} height={1024} className="product-gallery-image h-full w-full object-cover" />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
                  <Button type="button" variant="secondary" size="icon" className="h-11 w-11 rounded-sm shadow-sm" aria-label="Previous product image" onClick={() => setActiveImage((index) => (index + product.gallery.length - 1) % product.gallery.length)}><ChevronLeft /></Button>
                  <span className="bg-background/95 px-3 py-2 text-xs font-bold tabular-nums text-foreground">{activeImage + 1} / {product.gallery.length}</span>
                  <Button type="button" variant="secondary" size="icon" className="h-11 w-11 rounded-sm shadow-sm" aria-label="Next product image" onClick={() => setActiveImage((index) => (index + 1) % product.gallery.length)}><ChevronRight /></Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.gallery.map((image, index) => (
                  <Button key={image.src} type="button" variant="ghost" onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1} of ${product.name}`} aria-pressed={activeImage === index} className={`aspect-square h-auto w-full overflow-hidden rounded-none border-2 p-0 transition-colors hover:bg-transparent ${activeImage === index ? "border-accent-strong" : "border-transparent"}`}>
                    <img src={image.src} alt={image.alt} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
                  </Button>
                ))}
              </div>
            </section>

            <section className="lg:sticky lg:top-28 lg:h-fit">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">{product.label} · Sanjivani</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{productName}</h1>
              <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Botanical nutritional serum</span>
              </div>
              <div className="mt-7 flex items-end justify-between border-y border-border py-5">
                <div>
                  <p className="text-3xl font-extrabold">{formatPrice(productPrices[product.slug] ?? 69900)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Price in Indian rupees</p>
                </div>
                <span className="text-sm font-bold text-muted-foreground">{product.ingredients}</span>
              </div>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{productDescription}</p>
              <div className="mt-7 space-y-3">
                {product.highlights.map((highlight) => <p key={highlight} className="flex items-start gap-3 text-sm font-semibold"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />{highlight}</p>)}
              </div>
              {storeProduct?.active !== false ? <div className="mt-8 grid grid-cols-2 gap-3"><Button size="lg" variant="outline" className="h-14 rounded-sm border-primary font-bold" onClick={() => { addToCart(product.slug); toast.success(`${product.name} added to your bag`, { action: { label: "View bag", onClick: () => { window.location.assign("/bag"); } } }); }}><ShoppingBag className="h-4 w-4" /> Add to bag</Button><Button asChild size="lg" className="h-14 rounded-sm font-bold"><Link to={`/checkout?buy=${product.slug}`}>Buy now <ArrowRight className="h-4 w-4" /></Link></Button></div> : <p className="mt-8 border border-border p-4 text-sm font-semibold text-muted-foreground">This serum is currently unavailable.</p>}
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">For ingredients, serving size, and directions, refer to the product label.</p>
            </section>
          </div>
        </div>

        <section id="product-details" className="mt-20 border-y border-border bg-secondary/60">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-12 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">A closer look</p>
              <h2 className="mt-4 font-display text-4xl font-extrabold">A serum, thoughtfully chosen.</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{productDescription}</p>
              <h3 className="mt-9 font-display text-2xl font-bold">Ingredients at a glance</h3>
              <div className="mt-4 divide-y divide-border border-y border-border">
                {product.ingredientsList.map((ingredient, index) => (
                  <div key={ingredient.name} className="flex gap-5 py-4">
                    <span className="font-display text-xl font-bold text-accent-strong">0{index + 1}</span>
                    <div><h4 className="font-bold">{ingredient.name}</h4><p className="mt-1 text-sm text-muted-foreground">{ingredient.note}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Make it your own</p>
              <h3 className="mt-4 font-display text-3xl font-extrabold">Your everyday ritual</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{product.ritual}</p>
              <div className="mt-8 border-l-4 border-accent bg-background p-5">
                <p className="font-bold">Please read before use</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Check the product label for the complete ingredient list, serving directions, and important usage information before use.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-primary px-6 py-14 text-primary-foreground sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Find another favourite</p><h2 className="mt-2 font-display text-3xl font-extrabold">Meet the other blends.</h2></div>
            <div className="flex flex-wrap gap-3">{relatedProducts.map((item) => <Button key={item.slug} asChild variant="outline" className="rounded-sm border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to={`/products/${item.slug}`}>{item.name}</Link></Button>)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SanjivaniProduct;