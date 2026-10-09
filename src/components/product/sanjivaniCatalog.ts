import drop1View1 from "@/assets/drop-1-1.jpg";
import drop1View2 from "@/assets/drop-1-2.jpg";
import drop1View3 from "@/assets/drop-1-3.jpg";
import drop1View4 from "@/assets/drop-1-4.jpg";
import drop2View1 from "@/assets/drop-2-1.jpg";
import drop2View2 from "@/assets/drop-2-2.jpg";
import drop2View3 from "@/assets/drop-2-3.jpg";
import drop2View4 from "@/assets/drop-2-4.jpg";
import drop3View1 from "@/assets/drop-3-1.jpg";
import drop3View2 from "@/assets/drop-3-2.jpg";
import drop3View3 from "@/assets/drop-3-3.jpg";
import drop3View4 from "@/assets/drop-3-4.jpg";

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
}

export const sanjivaniProducts: SanjivaniProduct[] = [
  {
    slug: "daily-vitality", name: "Sanjivani Drop 1", tagline: "Vitality. A focus for your wellness routine.",
    ingredients: "Formula details awaiting confirmation", image: drop1View1, label: "01 · Vitality",
    description: "The vitality-themed drop in the Sanjivani collection, for men exploring a daily wellness routine. Energy and stress-related benefits have not been verified.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Vitality-themed collection", "Numbered dropper-bottle format", "Check the complete label before use"],
    gallery: [drop1View1, drop1View2, drop1View3, drop1View4].map((src, index) => ({ src, alt: `Sanjivani Drop 1 packaging concept, ${["front view", "angled view", "side view", "label detail"][index]}` })),
  },
  {
    slug: "gut-glow", name: "Sanjivani Drop 2", tagline: "Stamina. A focus for your wellness routine.",
    ingredients: "Formula details awaiting confirmation", image: drop2View1, label: "02 · Stamina",
    description: "The stamina-themed drop in the Sanjivani collection. Sexual performance and endurance benefits have not been verified; this product is not a treatment for sexual-health concerns.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Stamina-themed collection", "Numbered dropper-bottle format", "Check the complete label before use"],
    gallery: [drop2View1, drop2View2, drop2View3, drop2View4].map((src, index) => ({ src, alt: `Sanjivani Drop 2 packaging concept, ${["front view", "angled view", "side view", "label detail"][index]}` })),
  },
  {
    slug: "daily-greens", name: "Sanjivani Drop 3", tagline: "Recovery. A focus for your wellness routine.",
    ingredients: "Formula details awaiting confirmation", image: drop3View1, label: "03 · Recovery",
    description: "The recovery-themed drop in the Sanjivani collection. Circulation, sperm count and fertility benefits have not been verified; this product is not a treatment for reproductive or circulatory conditions.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Recovery-themed collection", "Numbered dropper-bottle format", "Check the complete label before use"],
    gallery: [drop3View1, drop3View2, drop3View3, drop3View4].map((src, index) => ({ src, alt: `Sanjivani Drop 3 packaging concept, ${["front view", "angled view", "side view", "label detail"][index]}` })),
  }
];

export const findSanjivaniProduct = (slug?: string) => sanjivaniProducts.find((product) => product.slug === slug);
