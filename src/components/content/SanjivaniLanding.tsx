import { useState } from "react";
import { ArrowRight, BadgeCheck, CreditCard, Leaf, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import heroImage from "@/assets/sanjivani-daily-vitality-serum.jpg";
import dailyGreensImage from "@/assets/sanjivani-daily-greens-serum.jpg";
import { sanjivaniProducts } from "@/components/product/sanjivaniCatalog";
import Serum3DViewer from "@/components/product/Serum3DViewer";
import { useStore, formatPrice } from "@/context/StoreContext";

const benefits = [
  { icon: Leaf, title: "Plant-led formulas", copy: "Thoughtful blends made with familiar herbs, fruits and botanicals." },
  { icon: ShieldCheck, title: "Clearly considered", copy: "Straightforward ingredients and serving guidance on every pack." },
  { icon: Sun, title: "Made for every day", copy: "Easy rituals designed to fit naturally into your routine." },
];

const ritualChoices = [
  { slug: "daily-vitality", label: "Bright & lively", note: "Amla, ginger and tulsi" },
  { slug: "daily-greens", label: "Fresh & green", note: "Moringa, amla and mint" },
  { slug: "gut-glow", label: "Zesty & bright", note: "Citrus, ginger and fibre" },
  { slug: "calm-cacao", label: "Warm & cosy", note: "Cacao, cinnamon and botanicals" },
];

const shoppingSteps = [
  { icon: Leaf, title: "Choose your blend", copy: "Explore the four Sanjivani botanical serums." },
  { icon: CreditCard, title: "Confirm and pay online", copy: "Add delivery details, then follow the payment instructions at checkout." },
  { icon: PackageCheck, title: "Follow your order", copy: "Sign in to see payment review and delivery progress in your account." },
];

const SanjivaniLanding = () => {
  const { products, productPrices, addToCart } = useStore();
  const [selectedRitual, setSelectedRitual] = useState(ritualChoices[0].slug);
  const availableProducts = products.flatMap((item) => {
    if (item.active === false) return [];
    const catalogueItem = sanjivaniProducts.find((entry) => entry.slug === item.slug);
    return catalogueItem ? [{ ...catalogueItem, ...item }] : [];
  });
  const selectedProduct = availableProducts.find((product) => product.slug === selectedRitual);
  const startingPrice = availableProducts.length ? Math.min(...availableProducts.map((product) => productPrices[product.slug] ?? 69900)) : 69900;

  return (
    <main>
      <section className="relative min-h-[570px] overflow-hidden bg-primary text-primary-foreground sm:min-h-[620px]" aria-label="Shop Sanjivani serums">
        <img src={heroImage} alt="Sanjivani Daily Vitality botanical serum with amla and ginger" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/10 sm:to-transparent" />
        <div className="relative mx-auto flex min-h-[570px] max-w-[1440px] flex-col justify-center px-6 py-14 sm:min-h-[620px] sm:px-10 lg:px-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">Botanical serums · From {formatPrice(startingPrice)}</p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl font-extrabold leading-tight sm:text-7xl">Sanjivani.<span className="mt-1 block text-accent">Your daily ritual, bottled.</span></h1>
          <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-primary-foreground/90 sm:text-lg">Explore four distinct botanical serum blends. Pick the flavour that fits your day and shop directly.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-14 rounded-sm bg-accent px-7 text-base font-extrabold text-accent-foreground hover:bg-accent/90"><a href="#shop">Shop the serums <ArrowRight className="h-5 w-5" /></a></Button>
            {availableProducts.some((product) => product.slug === "daily-vitality") && <Button asChild size="lg" variant="outline" className="h-14 rounded-sm border-primary-foreground bg-transparent px-6 font-bold text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/checkout?buy=daily-vitality">Buy Daily Vitality</Link></Button>}
          </div>
          <p className="mt-8 text-sm font-semibold text-primary-foreground/80">Online payment only · Order updates in your account</p>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Shop botanical serums</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Choose your Sanjivani serum.</h2>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Find the blend for your routine.</p>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {availableProducts.map((product) => (
            <article key={product.slug} className="product-card group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Link to={`/products/${product.slug}`} aria-label={`View Sanjivani ${product.name}`}><img src={product.image} alt={`Sanjivani ${product.name} botanical serum`} width={1024} height={1024} loading="lazy" className="product-card-image h-full w-full object-cover" /></Link>
                <span className="absolute left-3 top-3 bg-background px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-foreground">{product.label}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold"><Link to={`/products/${product.slug}`} className="hover:text-accent-strong">{product.name}</Link></h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.ingredients}</p>
                </div>
                <p className="font-bold">{formatPrice(productPrices[product.slug] ?? 69900)}</p>
              </div>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">{product.tagline}</p>
              <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" className="rounded-sm border-primary px-2 font-bold" onClick={() => { addToCart(product.slug); toast.success(`${product.name} added to your bag`, { action: { label: "View bag", onClick: () => { window.location.assign("/bag"); } } }); }}><ShoppingBag className="h-4 w-4" /> Add to bag</Button><Button asChild className="rounded-sm px-2 font-bold"><Link to={`/checkout?buy=${product.slug}`}>Buy now <ArrowRight className="h-4 w-4" /></Link></Button></div>
              <Link to={`/products/${product.slug}`} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">View ingredients & details</Link>
            </article>
          ))}
        </div>
      </section>

      {availableProducts.length > 0 && <section className="border-y border-border bg-secondary px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-label="Explore Sanjivani bottles in 3D">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-bold uppercase text-accent-strong">The collection, up close</p><h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Meet your next ritual.</h2></div>
            <p className="max-w-sm text-sm text-muted-foreground">Explore the bottles from every side. Actual product details are on each serum page.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {availableProducts.map((product) => <article key={product.slug} className="min-w-0">
              <Serum3DViewer slug={product.slug} className="aspect-[4/5] w-full" />
              <div className="mt-4 flex items-center justify-between gap-2"><Link to={`/products/${product.slug}`} className="font-display text-lg font-bold hover:text-accent-strong">{product.name}</Link><span className="shrink-0 font-bold">{formatPrice(productPrices[product.slug] ?? 69900)}</span></div>
              <Button asChild className="mt-3 w-full rounded-sm font-bold"><Link to={`/checkout?buy=${product.slug}`}>Buy now <ArrowRight className="h-4 w-4" /></Link></Button>
            </article>)}
          </div>
        </div>
      </section>}

      <section id="find-your-ritual" className="border-y border-border bg-secondary px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Not sure which one?</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">Find your blend.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">Choose the taste that sounds right to you. Explore its ingredients and product details before you decide.</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Choose a serum flavour">
              {ritualChoices.map((choice) => (
                <Button key={choice.slug} type="button" variant={selectedRitual === choice.slug ? "default" : "outline"} aria-pressed={selectedRitual === choice.slug} onClick={() => setSelectedRitual(choice.slug)} className="h-auto min-h-16 whitespace-normal rounded-sm px-3 py-3 text-center text-sm font-bold">
                  {choice.label}
                </Button>
              ))}
            </div>
            {selectedProduct && (
              <div className="mt-4 grid gap-4 border-t border-border pt-5 sm:grid-cols-[88px_1fr_auto] sm:items-center">
                <Link to={`/products/${selectedProduct.slug}`} aria-label={`Explore ${selectedProduct.name}`} className="aspect-square overflow-hidden bg-background">
                  <img src={selectedProduct.image} alt={`${selectedProduct.name} botanical serum`} width={256} height={256} loading="lazy" className="h-full w-full object-cover" />
                </Link>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-strong">{ritualChoices.find((choice) => choice.slug === selectedProduct.slug)?.note}</p>
                  <Link to={`/products/${selectedProduct.slug}`} className="mt-1 block font-display text-2xl font-bold hover:text-accent-strong">{selectedProduct.name}</Link>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedProduct.tagline}</p>
                </div>
                <Button asChild variant="outline" className="rounded-sm border-foreground bg-transparent font-bold hover:bg-foreground hover:text-background">
                  <Link to={`/products/${selectedProduct.slug}`}>View serum <ArrowRight /></Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="ingredients" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[500px] overflow-hidden lg:min-h-[720px]">
            <img src={dailyGreensImage} alt="Sanjivani Daily Greens with amla and moringa" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What’s inside matters</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">Good things, clearly chosen.</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/72">
              We bring together recognizable botanicals in practical blends. Every formula is designed around a moment in your day—not a miracle promise.
            </p>
            <div className="mt-10 divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
              {["Amla for a bright, tart base", "Moringa for everyday greens", "Ginger for warmth and flavour"].map((item, index) => (
                <div key={item} className="flex items-center gap-5 py-5">
                  <span className="font-display text-2xl font-bold text-accent">0{index + 1}</span>
                  <span className="text-base font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-[1440px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <div className="flex h-12 w-12 items-center justify-center bg-accent text-accent-foreground"><Sparkles /></div>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Wellness without the guesswork.</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">Simple products. Straightforward rituals. A warmer way to support your everyday.</p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="bg-background p-7 lg:p-9">
                <Icon className="h-7 w-7 text-accent-strong" />
                <h3 className="mt-8 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">From browsing to delivery</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">A clear way to shop.</h2>
          </div>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
            {shoppingSteps.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="bg-background p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7 text-accent-strong" />
                  <span className="font-display text-2xl font-bold text-accent-strong">0{index + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="questions" className="mx-auto grid max-w-[1280px] gap-10 px-6 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 lg:py-24">
        <div>
          <BadgeCheck className="h-8 w-8 text-accent-strong" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Good to know</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Your questions, answered.</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="product-guidance">
            <AccordionTrigger className="text-left font-display text-lg font-bold">Where can I find serving directions?</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">Follow the serving and preparation directions printed on the product pack. Product pages also remind you to follow the label carefully.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-methods">
            <AccordionTrigger className="text-left font-display text-lg font-bold">Can I place a cash-on-delivery order?</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">Orders are online-payment only. Checkout shows the available payment instructions before you submit an order.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="order-tracking">
            <AccordionTrigger className="text-left font-display text-lg font-bold">Where can I see my order updates?</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">Sign in and open your account to view your order history, payment review, and delivery progress.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-review">
            <AccordionTrigger className="text-left font-display text-lg font-bold">What happens after I place an order?</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">Your order and payment proof are available for store review. You can check the latest payment and delivery status in your account.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="bg-accent px-6 py-16 text-accent-foreground lg:py-20"><div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center"><h2 className="font-display text-3xl font-extrabold sm:text-5xl">Find your daily ritual.</h2><Button asChild size="lg" variant="secondary"><a href="#shop">Explore the serums <ArrowRight /></a></Button></div></section>
    </main>
  );
};

export default SanjivaniLanding;