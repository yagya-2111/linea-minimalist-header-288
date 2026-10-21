import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IngredientRow {
  name: string;
  amount: string;
  usedFor: string;
}

const ingredientRowsBySlug: Record<string, IngredientRow[]> = {
  "daily-vitality": [
    { name: "Ashwagandha (Withania somnifera) root extract", amount: "250 mg", usedFor: "Stress balance & daily energy" },
    { name: "Safed Musli (Chlorophytum borivilianum) root", amount: "150 mg", usedFor: "Strength & stamina" },
    { name: "Vidarikand (Pueraria tuberosa) tuber", amount: "100 mg", usedFor: "General vitality" },
  ],
  "gut-glow": [
    { name: "Shilajit extract (purified)", amount: "200 mg", usedFor: "Endurance & strength" },
    { name: "Kaunch Beej (Mucuna pruriens) seed", amount: "150 mg", usedFor: "Stamina & drive" },
    { name: "Gokshura (Tribulus terrestris) fruit", amount: "100 mg", usedFor: "Energy & vitality" },
  ],
  "daily-greens": [
    { name: "Shatavari (Asparagus racemosus) root", amount: "200 mg", usedFor: "Recovery & nourishment" },
    { name: "Guduchi (Tinospora cordifolia) stem", amount: "150 mg", usedFor: "Immunity & balance" },
    { name: "Arjuna (Terminalia arjuna) bark", amount: "100 mg", usedFor: "Circulation support" },
  ],
  "wellness-trio": [
    { name: "Vitalis — Ashwagandha · Safed Musli · Vidarikand", amount: "3 herbs per serving", usedFor: "Vitality & stress balance" },
    { name: "Endura — Shilajit · Kaunch Beej · Gokshura", amount: "3 herbs per serving", usedFor: "Stamina & drive" },
    { name: "Reviva — Shatavari · Guduchi · Arjuna", amount: "3 herbs per serving", usedFor: "Recovery & circulation" },
  ],
};

const goodFit = [
  "Are an adult man, 18 or older",
  "Want a simple daily routine",
  "Are also working on sleep, diet and activity",
  "Prefer a liquid over capsules",
];

const askDoctor = [
  "Take prescription medicine or have a heart, liver or kidney condition",
  "Have diabetes or blood pressure concerns",
  "Are under 18",
  "Are allergic to any listed ingredient",
];

const questions = [
  {
    q: "Will the package show what is inside?",
    a: "No. The outer box is plain, and the courier label carries only your name, address and an order number.",
  },
  {
    q: "How long until I notice a difference?",
    a: "Results differ from person to person. Herbal products are meant for steady daily use, often over several weeks, alongside sleep, food and activity.",
  },
  {
    q: "Is it a medicine?",
    a: "No. It is a wellness supplement and does not diagnose, treat, cure or prevent any condition.",
  },
  {
    q: "Can I take it with other medicines?",
    a: "Ask your doctor or pharmacist first, especially if you take prescription medicine.",
  },
  {
    q: "What if I want to return it?",
    a: "You can request a return within 7 days of delivery, and cancel an order any time before it is delivered. Refunds reach the original mode of payment within 2 working days.",
  },
];

const ProductEssentials = ({ slug }: { slug: string }) => {
  const ingredientRows = ingredientRowsBySlug[slug] ?? ingredientRowsBySlug["daily-vitality"];

  return (
  <section className="border-t border-border">
    <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
      {/* Ingredients */}
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Ingredients</p>
      <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">What is in each bottle.</h2>
      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60">
              <th className="px-4 py-3 font-bold">Ingredient</th>
              <th className="px-4 py-3 font-bold">Amount per serving</th>
              <th className="px-4 py-3 font-bold">Traditionally used for</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ingredientRows.map((row) => (
              <tr key={row.name} className="font-light">
                <td className="px-4 py-3 text-foreground">{row.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.amount}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.usedFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Amounts are shown per 1 ml serving of this formulation. The batch label printed on each bottle is the final authority — check it before use.</p>

      {/* Good fit / speak to a doctor */}
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        <div className="border border-border bg-secondary/40 p-6">
          <h3 className="font-display text-xl font-bold">Good fit if you</h3>
          <ul className="mt-4 space-y-2 text-sm font-light text-muted-foreground">
            {goodFit.map((item) => <li key={item} className="flex gap-2"><span className="text-accent-strong">•</span>{item}</li>)}
          </ul>
        </div>
        <div className="border border-border p-6">
          <h3 className="font-display text-xl font-bold">Speak to a doctor first if you</h3>
          <ul className="mt-4 space-y-2 text-sm font-light text-muted-foreground">
            {askDoctor.map((item) => <li key={item} className="flex gap-2"><span className="text-accent-strong">•</span>{item}</li>)}
          </ul>
        </div>
      </div>

      {/* Questions */}
      <div className="mt-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Questions</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Answers before you order.</h2>
        <Accordion type="single" collapsible className="mt-6 border-t border-border">
          {questions.map((item, index) => (
            <AccordionItem key={item.q} value={`q-${index}`} className="border-b border-border">
              <AccordionTrigger className="text-left font-bold hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm font-light leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Notices */}
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        <p className="border-l-4 border-accent bg-background p-5 text-sm leading-relaxed text-muted-foreground">For adults 18 and over. This product is a dietary supplement and is not intended to diagnose, treat, cure or prevent any disease. Individual results vary. Consult a qualified doctor before use if you have a medical condition, take medication, or are unsure.</p>
        <p className="border-l-4 border-accent bg-background p-5 text-sm leading-relaxed text-muted-foreground">Keep out of reach of children. Store in a cool, dry place. Check the batch number, manufacturing date and expiry on the bottle.</p>
      </div>
    </div>
  </section>
);
};

export default ProductEssentials;
