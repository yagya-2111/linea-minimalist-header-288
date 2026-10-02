import { useState } from "react";
import { ArrowRight, Check, Leaf, ShieldCheck, Sparkles, Star, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/sanjivani-hero.jpg";
import gutGlowImage from "@/assets/sanjivani-gut-glow.jpg";
import dailyGreensImage from "@/assets/sanjivani-daily-greens.jpg";
import { sanjivaniProducts } from "@/components/product/sanjivaniCatalog";

const benefits = [
  { icon: Leaf, title: "Plant-led formulas", copy: "Thoughtful blends made with familiar herbs, fruits and botanicals." },
  { icon: ShieldCheck, title: "Clearly considered", copy: "Straightforward ingredients and serving guidance on every pack." },
  { icon: Sun, title: "Made for every day", copy: "Easy rituals designed to fit naturally into your routine." },
];

const SanjivaniLanding = () => {
  const [email, setEmail] = useState("");

  const joinNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks for your interest", { description: "Newsletter sign-up is a preview only; your email was not saved." });
    setEmail("");
  };

  return (
    <main>
      <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <div className="relative mx-auto grid min-h-[calc(100vh-7.5rem)] max-w-[1440px] overflow-hidden rounded-lg bg-primary text-primary-foreground lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16 lg:py-20 xl:px-24">
            <div className="mb-7 flex items-center gap-4 text-accent">
              <span className="h-px w-12 bg-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Plant-powered daily nutrition</span>
            </div>
            <h1 className="max-w-3xl font-display text-6xl font-extrabold leading-[0.94] sm:text-7xl lg:text-[5.8rem]">
              Feel good,
              <span className="mt-2 block text-accent">every day.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-primary-foreground/75 sm:text-xl">
              Modern supplements inspired by India’s rich botanical traditions. Clear ingredients, bold flavours, simple rituals.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-sm bg-accent px-7 text-base font-bold text-accent-foreground hover:bg-accent/90">
                <a href="#shop">Shop bestsellers <ArrowRight /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 rounded-sm border-primary-foreground/30 bg-transparent px-7 text-base font-bold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href="#ingredients">Explore ingredients</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-primary-foreground/70">
              <span className="flex items-center gap-2"><Check className="text-accent" /> Ingredient-led blends</span>
              <span className="flex items-center gap-2"><Check className="text-accent" /> Simple drink rituals</span>
              <span className="flex items-center gap-2"><Check className="text-accent" /> Botanical inspiration</span>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden lg:min-h-full">
            <img src={heroImage} alt="Sanjivani Daily Vitality supplement box and jar with amla and ginger" width={1536} height={1152} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-primary/20 lg:to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-primary-foreground sm:bottom-8 sm:left-8 sm:right-8">
              <Link to="/products/daily-vitality" className="bg-primary/85 p-4 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Start here</p>
                <p className="mt-1 font-display text-2xl font-bold">Daily Vitality</p>
              </Link>
              <div className="bg-accent px-4 py-3 font-bold text-accent-foreground">₹699</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary py-6" aria-label="Brand promises">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm font-bold uppercase tracking-[0.14em] text-secondary-foreground md:justify-between">
          <span>Rooted in tradition</span><span className="hidden text-accent md:block">✦</span>
          <span>Made for modern life</span><span className="hidden text-accent md:block">✦</span>
          <span>Ingredients you recognise</span><span className="hidden text-accent md:block">✦</span>
          <span>Explore all four blends</span>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Find your daily ritual</p>
            <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Meet the Sanjivani family.</h2>
          </div>
          <a href="#shop" className="inline-flex items-center gap-2 text-sm font-bold underline decoration-accent decoration-2 underline-offset-8">Shop all blends <ArrowRight className="h-4 w-4" /></a>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {sanjivaniProducts.map((product) => (
            <article key={product.slug} className="group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Link to={`/products/${product.slug}`} aria-label={`View Sanjivani ${product.name}`}><img src={product.image} alt={`Sanjivani ${product.name} supplement`} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></Link>
                <span className="absolute left-3 top-3 bg-background px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-foreground">{product.label}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold"><Link to={`/products/${product.slug}`} className="hover:text-accent-strong">{product.name}</Link></h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.ingredients}</p>
                </div>
                <p className="font-bold">₹699</p>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full rounded-sm border-foreground bg-transparent font-bold hover:bg-foreground hover:text-background"><Link to={`/products/${product.slug}`}>Explore blend <ArrowRight /></Link></Button>
            </article>
          ))}
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

      <section className="bg-accent px-6 py-20 text-accent-foreground lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 flex justify-center gap-1" aria-label="Five star review">
            {[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-5 w-5 fill-current" />)}
          </div>
          <blockquote className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">“It finally feels like a daily wellness ritual I can actually keep.”</blockquote>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em]">Illustrative sample quote · not customer feedback</p>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-[1440px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid overflow-hidden bg-secondary lg:grid-cols-[1fr_0.8fr]">
          <div className="px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">The good stuff, occasionally</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">A little more good in your inbox.</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">Get thoughtful wellness notes, new blends and offers. Sign-up is a preview only; your email will not be saved.</p>
            <form onSubmit={joinNewsletter} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="h-14 min-w-0 flex-1 border border-input bg-background px-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
              <Button type="submit" className="h-14 rounded-sm px-7 font-bold">Join the circle <ArrowRight /></Button>
            </form>
          </div>
          <div className="relative hidden overflow-hidden lg:block">
            <img src={gutGlowImage} alt="Sanjivani Gut Glow supplement" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SanjivaniLanding;