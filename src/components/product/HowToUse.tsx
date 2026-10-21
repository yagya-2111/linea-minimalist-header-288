import { Droplets, Clock, Pipette, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: RefreshCw,
    title: "Shake gently",
    body: "Turn the bottle upside down a few times before each use.",
  },
  {
    icon: Pipette,
    title: "Fill the dropper",
    body: "Squeeze the bulb, then release it in the liquid to the marked line.",
  },
  {
    icon: Droplets,
    title: "Take it",
    body: "Place the drops under the tongue or mix into water, as the label directs.",
  },
  {
    icon: Clock,
    title: "Keep it consistent",
    body: "Take at the same time daily. Store closed, away from heat and sunlight.",
  },
];

const HowToUse = () => (
  <section className="border-t border-border bg-secondary/60">
    <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">How to use</p>
      <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Four steps, under a minute.</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="border border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <step.icon className="h-6 w-6 text-accent-strong" aria-hidden="true" />
              <span className="font-display text-xl font-extrabold text-muted-foreground/50">0{index + 1}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm font-semibold text-muted-foreground">
        <span className="text-accent-strong">Suggested use:</span> follow the dose printed on your bottle label.
      </p>
    </div>
  </section>
);

export default HowToUse;
