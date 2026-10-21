import drop1View1 from "@/assets/vitalis-1.jpg";
import drop1View2 from "@/assets/vitalis-2.jpg";
import drop1View3 from "@/assets/vitalis-3.jpg";
import drop1View4 from "@/assets/vitalis-4.jpg";
import drop2View1 from "@/assets/endura-1.jpg";
import drop2View2 from "@/assets/endura-2.jpg";
import drop2View3 from "@/assets/endura-3.jpg";
import drop2View4 from "@/assets/endura-4.jpg";
import drop3View1 from "@/assets/reviva-1.jpg";
import drop3View2 from "@/assets/reviva-2.jpg";
import drop3View3 from "@/assets/reviva-3.jpg";
import drop3View4 from "@/assets/reviva-4.jpg";

import trioView1 from "@/assets/wellness-trio-1.jpg";
import trioView2 from "@/assets/wellness-trio-2.jpg";
import trioView3 from "@/assets/wellness-trio-3.jpg";
import trioView4 from "@/assets/wellness-trio-4.jpg";

export interface SanjivaniProduct {
  slug: string;
  name: string;
  tagline: string;
  ingredients: string;
  image: string;
  label: string;
  description: string;
  ritual: string;
  ingredientsList: { name: string; note: string }[];
  highlights: string[];
  gallery: { src: string; alt: string }[];
  active?: boolean;
  defaultPricePaise: number;
  isCombo?: boolean;
}

export const sanjivaniProducts: SanjivaniProduct[] = [
  {
    defaultPricePaise: 69900, slug: "daily-vitality", name: "Sanjivani Vitalis", tagline: "Vitality. A focus for your wellness routine.",
    ingredients: "Ashwagandha · Safed Musli · Vidarikand", image: drop1View1, label: "Vitality",
    description: "The vitality-themed drop in the Sanjivani collection, for men exploring a daily wellness routine. Energy and stress-related benefits have not been verified.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Vitality-themed collection", "Dropper-bottle format", "Check the complete label before use"],
    gallery: [drop1View1, drop1View2, drop1View3, drop1View4].map((src, index) => ({ src, alt: `Sanjivani Vitalis packaging concept, ${["front view", "angled view", "side view", "label detail"][index]}` })),
  },
  {
    defaultPricePaise: 69900, slug: "gut-glow", name: "Sanjivani Endura", tagline: "Stamina. A focus for your wellness routine.",
    ingredients: "Formula details awaiting confirmation", image: drop2View1, label: "Stamina",
    description: "The stamina-themed drop in the Sanjivani collection. Sexual performance and endurance benefits have not been verified; this product is not a treatment for sexual-health concerns.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Stamina-themed collection", "Dropper-bottle format", "Check the complete label before use"],
    gallery: [drop2View1, drop2View2, drop2View3, drop2View4].map((src, index) => ({ src, alt: `Sanjivani Endura packaging concept, ${["front view", "angled view", "side view", "label detail"][index]}` })),
  },
  {
    defaultPricePaise: 69900, slug: "daily-greens", name: "Sanjivani Reviva", tagline: "Recovery. A focus for your wellness routine.",
    ingredients: "Formula details awaiting confirmation", image: drop3View1, label: "Recovery",
    description: "The recovery-themed drop in the Sanjivani collection. Circulation, sperm count and fertility benefits have not been verified; this product is not a treatment for reproductive or circulatory conditions.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Recovery-themed collection", "Dropper-bottle format", "Check the complete label before use"],
    gallery: [drop3View1, drop3View2, drop3View3, drop3View4].map((src, index) => ({ src, alt: `Sanjivani Reviva packaging concept, ${["front view", "angled view", "side view", "label detail"][index]}` })),
  },
  {
    slug: "wellness-trio", name: "Sanjivani Wellness Trio", defaultPricePaise: 199900, isCombo: true,
    tagline: "Vitalis. Endura. Reviva. All three, together.", label: "Three-drop combo",
    ingredients: "Includes one of each drop", image: trioView1,
    description: "The complete Sanjivani collection: one Vitalis, one Endura and one Reviva bottle in a single purchase. Three distinct drops, individually labelled. This bundle does not imply that the products should be taken together or that combined benefits have been verified.",
    ritual: "Read each product’s verified label separately. Ask a qualified healthcare professional whether any of these products, alone or together, are appropriate for you before use.",
    ingredientsList: [], highlights: ["One Vitalis + one Endura + one Reviva", "Three individual dropper bottles", "₹1,999 for the complete collection"],
    gallery: [trioView1, trioView2, trioView3, trioView4].map((src, index) => ({ src, alt: `Sanjivani Wellness Trio packaging concept, ${["front view", "angled view", "flat lay", "label details"][index]}` })),
  }
];

export const findSanjivaniProduct = (slug?: string) => sanjivaniProducts.find((product) => product.slug === slug);
