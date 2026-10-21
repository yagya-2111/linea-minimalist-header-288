import drop1View1 from "@/assets/vitalis-1.jpg";
import drop1View2 from "@/assets/vitalis-2.jpg";
import drop1View3 from "@/assets/vitalis-3.jpg";
import drop1View4 from "@/assets/vitalis-4.jpg";
import drop1Store from "@/assets/vitalis-store.jpg";
import drop1Godown from "@/assets/vitalis-godown.jpg";
import drop1Doctor from "@/assets/vitalis-doctor.jpg";
import drop1Clinic from "@/assets/vitalis-clinic.jpg";
import drop1Packing from "@/assets/vitalis-packing.jpg";
import drop2View1 from "@/assets/endura-1.jpg";
import drop2View2 from "@/assets/endura-2.jpg";
import drop2View3 from "@/assets/endura-3.jpg";
import drop2View4 from "@/assets/endura-4.jpg";
import drop2Store from "@/assets/endura-store.jpg";
import drop2Godown from "@/assets/endura-godown.jpg";
import drop2Doctor from "@/assets/endura-doctor.jpg";
import drop2Clinic from "@/assets/endura-clinic.jpg";
import drop2Packing from "@/assets/endura-packing.jpg";
import drop3View1 from "@/assets/reviva-1.jpg";
import drop3View2 from "@/assets/reviva-2.jpg";
import drop3View3 from "@/assets/reviva-3.jpg";
import drop3View4 from "@/assets/reviva-4.jpg";
import drop3Store from "@/assets/reviva-store.jpg";
import drop3Godown from "@/assets/reviva-godown.jpg";
import drop3Doctor from "@/assets/reviva-doctor.jpg";
import drop3Clinic from "@/assets/reviva-clinic.jpg";
import drop3Packing from "@/assets/reviva-packing.jpg";

import trioView1 from "@/assets/wellness-trio-1.jpg";
import trioView2 from "@/assets/wellness-trio-2.jpg";
import trioView3 from "@/assets/wellness-trio-3.jpg";
import trioView4 from "@/assets/wellness-trio-4.jpg";
import trioGodown from "@/assets/trio-godown.jpg";

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

const packShotAlts = ["front view", "angled view", "side view", "label detail"];
const contextAlts = [
  "on a medical store shelf",
  "in the storage godown",
  "on a doctor's consultation desk",
  "at the clinic counter",
  "being packed for dispatch",
];

const buildGallery = (packShots: string[], contextShots: string[], name: string) => [
  ...packShots.map((src, index) => ({ src, alt: `Sanjivani ${name} packaging concept, ${packShotAlts[index]}` })),
  ...contextShots.map((src, index) => ({ src, alt: `Sanjivani ${name} bottle ${contextAlts[index]}` })),
];

export const sanjivaniProducts: SanjivaniProduct[] = [
  {
    defaultPricePaise: 69900, slug: "daily-vitality", name: "Sanjivani Vitalis", tagline: "Vitality. A focus for your wellness routine.",
    ingredients: "Ashwagandha · Safed Musli · Vidarikand", image: drop1View1, label: "Vitality",
    description: "The vitality-themed drop in the Sanjivani collection, for men exploring a daily wellness routine. Energy and stress-related benefits have not been verified.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Vitality-themed collection", "Dropper-bottle format", "Check the complete label before use"],
    gallery: buildGallery([drop1View1, drop1View2, drop1View3, drop1View4], [drop1Store, drop1Godown, drop1Doctor, drop1Clinic, drop1Packing], "Vitalis"),
  },
  {
    defaultPricePaise: 69900, slug: "gut-glow", name: "Sanjivani Endura", tagline: "Stamina. A focus for your wellness routine.",
    ingredients: "Shilajit · Kaunch Beej · Gokshura", image: drop2View1, label: "Stamina",
    description: "The stamina-themed drop in the Sanjivani collection. Sexual performance and endurance benefits have not been verified; this product is not a treatment for sexual-health concerns.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Stamina-themed collection", "Dropper-bottle format", "Check the complete label before use"],
    gallery: buildGallery([drop2View1, drop2View2, drop2View3, drop2View4], [drop2Store, drop2Godown, drop2Doctor, drop2Clinic, drop2Packing], "Endura"),
  },
  {
    defaultPricePaise: 69900, slug: "daily-greens", name: "Sanjivani Reviva", tagline: "Recovery. A focus for your wellness routine.",
    ingredients: "Shatavari · Guduchi · Arjuna", image: drop3View1, label: "Recovery",
    description: "The recovery-themed drop in the Sanjivani collection. Circulation, sperm count and fertility benefits have not been verified; this product is not a treatment for reproductive or circulatory conditions.",
    ritual: "Use only according to the verified directions on the actual product label. Consult a qualified healthcare professional before use, particularly if you take medication or have a health condition.",
    ingredientsList: [],
    highlights: ["Recovery-themed collection", "Dropper-bottle format", "Check the complete label before use"],
    gallery: buildGallery([drop3View1, drop3View2, drop3View3, drop3View4], [drop3Store, drop3Godown, drop3Doctor, drop3Clinic, drop3Packing], "Reviva"),
  },
  {
    slug: "wellness-trio", name: "Sanjivani Wellness Trio", defaultPricePaise: 199900, isCombo: true,
    tagline: "Vitalis. Endura. Reviva. All three, together.", label: "Three-drop combo",
    ingredients: "Includes one of each drop", image: trioView1,
    description: "The complete Sanjivani collection: one Vitalis, one Endura and one Reviva bottle in a single purchase. Three distinct drops, individually labelled. This bundle does not imply that the products should be taken together or that combined benefits have been verified.",
    ritual: "Read each product’s verified label separately. Ask a qualified healthcare professional whether any of these products, alone or together, are appropriate for you before use.",
    ingredientsList: [], highlights: ["One Vitalis + one Endura + one Reviva", "Three individual dropper bottles", "₹1,999 for the complete collection"],
    gallery: [
      ...[trioView1, trioView2, trioView3, trioView4].map((src, index) => ({ src, alt: `Sanjivani Wellness Trio packaging concept, ${packShotAlts[index]}` })),
      { src: trioGodown, alt: "Sanjivani Wellness Trio bottles in the storage godown" },
    ],
  }
];

export const findSanjivaniProduct = (slug?: string) => sanjivaniProducts.find((product) => product.slug === slug);
