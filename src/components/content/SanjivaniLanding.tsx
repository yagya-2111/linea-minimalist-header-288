import { useState } from "react";
import { ArrowRight, BadgeCheck, CreditCard, Leaf, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import heroImage from "@/assets/vitalis-hero.jpg";
import mobileHeroImage from "@/assets/vitalis-hero-mobile.jpg";
import dailyGreensImage from "@/assets/reviva-1.jpg";
import { sanjivaniProducts } from "@/components/product/sanjivaniCatalog";
import { useStore, formatPrice } from "@/context/StoreContext";

const benefits = [
  { icon: Leaf, title: "Three clear choices", copy: "Vitalis, Endura and Reviva — individually or as the Wellness Trio." },
  { icon: ShieldCheck, title: "Know what you choose", copy: "Check the actual label and confirmed formula before purchase or use." },
  { icon: Sun, title: "Your routine, your pace", copy: "Wellness is personal. Make informed choices without miracle promises." },
];

const ritualChoices = [
  { slug: "daily-vitality", label: "Vitalis · Vitality", note: "Vitalis" },
  { slug: "gut-glow", label: "Endura · Stamina", note: "Endura" },
  { slug: "daily-greens", label: "Reviva · Recovery", note: "Reviva" },
];

const shoppingSteps = [
  { icon: Leaf, title: "Choose your blend", copy: "Explore the three Sanjivani drops." },
  { icon: CreditCard, title: "Confirm and pay online", copy: "Add delivery details, then follow the payment instructions at checkout." },
  { icon: PackageCheck, title: "Follow your order", copy: "Track payment review and delivery progress anytime with your order number — no account needed." },
];

const SanjivaniLanding = () => {
  const { products, productPrices, addToCart } = useStore();
  const navigate = useNavigate();
  const [selectedRitual, setSelectedRitual] = useState(ritualChoices[0].slug);
  const availableProducts = products.flatMap((item) => {
    if (item.active === false) return [];
    const catalogueItem = sanjivaniProducts.find((entry) => entry.slug === item.slug);
    return catalogueItem ? [{ ...catalogueItem, ...item }] : [];
  });
  const selectedProduct = availableProducts.find((product) => product.slug === selectedRitual);
  const startingPrice = availableProducts.length ? Math.min(...availableProducts.map((product) => productPrices[product.slug] ?? product.defaultPricePaise)) : 69900;

  return (
    <main>
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col md:min-h-[580px]" aria-label="Shop Sanjivani drops">
        <img src={heroImage} alt="Sanjivani Vitalis drop and its gold botanical carton" width={1600} height={900} className="hero-image-reveal absolute inset-0 hidden h-full w-full object-cover object-right md:block" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-5 pt-8 text-center sm:px-10 md:py-20 md:text-left lg:px-16">
          <p className="hero-fade-up font-extrabold uppercase text-accent-strong md:text-xs">The Sanjivani collection</p>
          <h1 className="hero-fade-up font-display text-3xl font-extrabold leading-tight [animation-delay:90ms] md:mt-3 md:max-w-xl md:text-6xl">Sanjivani drops.<br />A ritual of your own.</h1>
          <p className="hero-fade-up mx-auto mt-2 max-w-[420px] text-sm leading-snug text-muted-foreground [animation-delay:180ms] md:mx-0 md:mt-3 md:text-base md:leading-relaxed"><span className="md:hidden">Vitalis, Endura & Reviva. Find your drop.</span><span className="hidden md:inline">Meet Vitalis, Endura and Reviva. Three distinct drops. One thoughtfully chosen routine.</span></p>
          <p className="hidden font-extrabold md:mt-4 md:block md:text-3xl">From {formatPrice(startingPrice)}</p>
          <div className="hero-fade-up mt-4 flex flex-wrap justify-center gap-2 [animation-delay:300ms] md:mt-5 md:justify-start">
            <Button asChild size="lg" className="h-11 rounded-sm px-4 font-bold md:h-12 md:px-5"><a href="#shop">Shop the drops <ArrowRight className="h-4 w-4" /></a></Button>
            {availableProducts.some((product) => product.slug === "daily-vitality") && <Button asChild size="lg" variant="outline" className="h-11 rounded-sm border-primary bg-background/80 px-4 font-bold md:h-12 md:px-5"><Link to="/checkout?buy=daily-vitality">Buy Vitalis</Link></Button>}
          </div>
          <p className="hero-fade-up mt-3 text-xs font-semibold text-muted-foreground [animation-delay:380ms] md:mt-4">Online payment · Personal order tracking</p>
        </div>
        <Link to="/products/daily-vitality" aria-label="View Sanjivani Vitalis" className="relative block w-full flex-1 overflow-hidden md:hidden">
          <img src={mobileHeroImage} alt="Sanjivani Vitalis bottle and botanical carton" width={900} height={900} fetchPriority="high" className="hero-image-reveal absolute inset-0 h-full w-full object-cover object-center" />
        </Link>
      </section>

      <section id="shop" className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Shop the drop collection</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Choose your Sanjivani drop.</h2>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Find the blend for your routine.</p>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {availableProducts.map((product) => (
            <article key={product.slug} className="product-card group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`}><img src={product.image} alt={`${product.name} botanical drop`} width={1024} height={1024} loading="lazy" className="product-card-image h-full w-full object-cover" /></Link>
                <span className="absolute left-3 top-3 bg-background px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-foreground">{product.label}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div>
                  <h3 className="font-display text-xl font-bold"><Link to={`/products/${product.slug}`} className="hover:text-accent-strong">{product.name}</Link></h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.isCombo ? "One of each drop" : product.label + " wellness drops"}</p>
                </div>
                <p className="text-3xl font-extrabold">{formatPrice(productPrices[product.slug] ?? product.defaultPricePaise)}</p>
              </div>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">{product.tagline}</p>
              <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" className="rounded-sm border-primary px-2 font-bold" onClick={() => { addToCart(product.slug); toast.success(`${product.name} added to your bag`, { action: { label: "View bag", onClick: () => navigate("/bag") } }); }}><ShoppingBag className="h-4 w-4" /> Add to bag</Button><Button asChild className="rounded-sm px-2 font-bold"><Link to={`/checkout?buy=${product.slug}`}>Buy now <ArrowRight className="h-4 w-4" /></Link></Button></div>
              <Link to={`/products/${product.slug}`} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">View ingredients & details</Link>
            </article>
          ))}
        </div>
      </section>

      {availableProducts.find((product) => product.isCombo) && <section className="border-y border-border bg-secondary px-5 py-12 sm:px-10">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 md:grid-cols-2">
          <Link to="/products/wellness-trio" className="aspect-square overflow-hidden"><img src={sanjivaniProducts.find((product) => product.isCombo)?.image} alt="Vitalis, Endura and Reviva Wellness Trio" width={768} height={768} loading="lazy" className="h-full w-full object-cover" /></Link>
          <div><p className="text-xs font-bold uppercase text-accent-strong">The complete collection</p><h2 className="mt-3 font-display text-4xl font-extrabold">Three drops.<br />One beautiful trio.</h2><p className="mt-4 leading-relaxed text-muted-foreground">One Vitalis, one Endura and one Reviva. Discover all three Sanjivani drops in a single purchase.</p><p className="mt-5 text-4xl font-extrabold">{formatPrice(productPrices["wellness-trio"] ?? 199900)}</p><Button asChild size="lg" className="mt-6 h-14 rounded-sm font-bold"><Link to="/checkout?buy=wellness-trio">Buy the trio <ArrowRight /></Link></Button><Link to="/products/wellness-trio" className="ml-4 inline-block py-4 text-sm font-bold underline underline-offset-4">Explore the set</Link></div>
        </div>
      </section>}

      <section id="find-your-ritual" className="border-y border-border bg-secondary px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Not sure which one?</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">Find your blend.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">Choose a theme to explore. Read the product information and check the actual label before deciding.</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Choose a drop theme">
              {ritualChoices.map((choice) => (
                <Button key={choice.slug} type="button" variant={selectedRitual === choice.slug ? "default" : "outline"} aria-pressed={selectedRitual === choice.slug} onClick={() => setSelectedRitual(choice.slug)} className="h-auto min-h-16 whitespace-normal rounded-sm px-3 py-3 text-center text-sm font-bold">
                  {choice.label}
                </Button>
              ))}
            </div>
            {selectedProduct && (
              <div className="mt-4 grid gap-4 border-t border-border pt-5 sm:grid-cols-[88px_1fr_auto] sm:items-center">
                <Link to={`/products/${selectedProduct.slug}`} aria-label={`Explore ${selectedProduct.name}`} className="aspect-square overflow-hidden bg-background">
                  <img src={selectedProduct.image} alt={`${selectedProduct.name} botanical drop`} width={256} height={256} loading="lazy" className="h-full w-full object-cover" />
                </Link>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-strong">{ritualChoices.find((choice) => choice.slug === selectedProduct.slug)?.note}</p>
                  <Link to={`/products/${selectedProduct.slug}`} className="mt-1 block font-display text-2xl font-bold hover:text-accent-strong">{selectedProduct.name}</Link>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedProduct.tagline}</p>
                </div>
                <Button asChild variant="outline" className="rounded-sm border-foreground bg-transparent font-bold hover:bg-foreground hover:text-background">
                  <Link to={`/products/${selectedProduct.slug}`}>View drop <ArrowRight /></Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="ingredients" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[500px] overflow-hidden lg:min-h-[720px]">
            <img src={dailyGreensImage} alt="Sanjivani Reviva packaging concept" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What’s inside matters</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">Your formula. Full transparency.</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/72">
              Complete ingredient lists, amounts and usage directions are awaiting confirmation. No ingredient or health result should be assumed from the collection themes or packaging concepts.
            </p>
            <div className="mt-10 divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
              {["Full ingredient list: awaiting confirmation", "Ingredient amounts: awaiting confirmation", "Serving directions: follow the verified label"].map((item, index) => (
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
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">Three clear themes. Product information without exaggerated promises. A thoughtful approach to your routine.</p>
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
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">Open the Track your order page and enter your order number and phone to see your order history, payment review, and delivery progress.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment-review">
            <AccordionTrigger className="text-left font-display text-lg font-bold">What happens after I place an order?</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">Your order and payment proof are available for store review. Track the latest payment and delivery status on the Track your order page with your order number and phone.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="bg-accent px-6 py-16 text-accent-foreground lg:py-20"><div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center"><h2 className="font-display text-3xl font-extrabold sm:text-5xl">Find your daily ritual.</h2><Button asChild size="lg" variant="secondary"><a href="#shop">Explore the drops <ArrowRight /></a></Button></div></section>
    </main>
  );
};

export default SanjivaniLanding;