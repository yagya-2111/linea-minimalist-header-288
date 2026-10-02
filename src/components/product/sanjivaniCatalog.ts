import vitalityFront from "@/assets/sanjivani-daily-vitality-serum.jpg";
import vitalitySide from "@/assets/sanjivani-daily-vitality-1.jpg";
import vitalityLifestyle from "@/assets/sanjivani-daily-vitality-2.jpg";
import vitalityAngle from "@/assets/sanjivani-daily-vitality-3.jpg";
import vitalityDetail from "@/assets/sanjivani-daily-vitality-4.jpg";
import gutFront from "@/assets/sanjivani-gut-glow-serum.jpg";
import gutSide from "@/assets/sanjivani-gut-glow-1.jpg";
import gutLifestyle from "@/assets/sanjivani-gut-glow-2.jpg";
import gutAngle from "@/assets/sanjivani-gut-glow-3.jpg";
import gutDetail from "@/assets/sanjivani-gut-glow-4.jpg";
import greensFront from "@/assets/sanjivani-daily-greens-serum.jpg";
import greensSide from "@/assets/sanjivani-daily-greens-1.jpg";
import greensLifestyle from "@/assets/sanjivani-daily-greens-2.jpg";
import greensAngle from "@/assets/sanjivani-daily-greens-3.jpg";
import greensDetail from "@/assets/sanjivani-daily-greens-4.jpg";
import cacaoFront from "@/assets/sanjivani-calm-cacao-serum.jpg";
import cacaoSide from "@/assets/sanjivani-calm-cacao-1.jpg";
import cacaoLifestyle from "@/assets/sanjivani-calm-cacao-2.jpg";
import cacaoAngle from "@/assets/sanjivani-calm-cacao-3.jpg";
import cacaoDetail from "@/assets/sanjivani-calm-cacao-4.jpg";

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

const createGallery = (name: string, images: [string, string, string, string, string]) => [
  { src: images[0], alt: `Sanjivani ${name} serum bottle, front view` },
  { src: images[1], alt: `Sanjivani ${name} serum bottle, alternate view` },
  { src: images[2], alt: `Sanjivani ${name} with its botanical ingredients` },
  { src: images[3], alt: `Sanjivani ${name} dropper serum, studio view` },
  { src: images[4], alt: `Sanjivani ${name} serum bottle detail` },
];

export const sanjivaniProducts: SanjivaniProduct[] = [
  {
    slug: "daily-vitality",
    name: "Daily Vitality",
    tagline: "A bright botanical serum for your everyday ritual.",
    ingredients: "Amla · Ginger · Tulsi",
    image: vitalityFront,
    label: "Botanical blend",
    description: "A lively, plant-led nutritional serum bringing together familiar Indian botanicals and a bright, warming flavour. A simple addition to your daily wellness ritual.",
    ritual: "Use the serving and preparation directions printed on the product pack. Follow the label carefully.",
    ingredientsList: [
      { name: "Amla", note: "A tart, fruity botanical note." },
      { name: "Ginger", note: "A familiar, warming flavour." },
      { name: "Tulsi", note: "An aromatic herb with a fresh finish." },
    ],
    highlights: ["Familiar botanical ingredients", "Bright, gently warming flavour", "Dropper-bottle serum format"],
    gallery: createGallery("Daily Vitality", [vitalityFront, vitalitySide, vitalityLifestyle, vitalityAngle, vitalityDetail]),
  },
  {
    slug: "gut-glow",
    name: "Gut Glow",
    tagline: "A zesty citrus and ginger serum for your daily ritual.",
    ingredients: "Citrus · Ginger · Fibre",
    image: gutFront,
    label: "Citrus ritual",
    description: "A bright-tasting nutritional serum with citrus, ginger and fibre, created for an uncomplicated daily wellness ritual.",
    ritual: "Use the serving and preparation directions printed on the product pack. Follow the label carefully.",
    ingredientsList: [
      { name: "Citrus", note: "Adds a bright, tangy flavour." },
      { name: "Ginger", note: "Brings a gentle, warming note." },
      { name: "Fibre", note: "A considered part of this botanical blend." },
    ],
    highlights: ["Citrus-forward flavour", "A simple daily ritual", "Dropper-bottle serum format"],
    gallery: createGallery("Gut Glow", [gutFront, gutSide, gutLifestyle, gutAngle, gutDetail]),
  },
  {
    slug: "daily-greens",
    name: "Daily Greens",
    tagline: "A fresh, garden-inspired greens serum for every day.",
    ingredients: "Moringa · Amla · Mint",
    image: greensFront,
    label: "Everyday greens",
    description: "A green, botanical nutritional serum pairing moringa and amla with a cooling hint of mint, designed for an easy wellness ritual.",
    ritual: "Use the serving and preparation directions printed on the product pack. Follow the label carefully.",
    ingredientsList: [
      { name: "Moringa", note: "A leafy, earthy botanical note." },
      { name: "Amla", note: "A tart fruit note to balance the greens." },
      { name: "Mint", note: "A cool, fresh finish." },
    ],
    highlights: ["Fresh mint finish", "Amla and leafy botanical notes", "Dropper-bottle serum format"],
    gallery: createGallery("Daily Greens", [greensFront, greensSide, greensLifestyle, greensAngle, greensDetail]),
  },
  {
    slug: "calm-cacao",
    name: "Calm Cacao",
    tagline: "A cosy cacao, cinnamon and botanical evening serum.",
    ingredients: "Cacao · Ashwagandha · Cinnamon",
    image: cacaoFront,
    label: "Evening ritual",
    description: "A rich, plant-led nutritional serum with warming cinnamon and a botanical touch, made for an unhurried wellness ritual.",
    ritual: "Use the serving and preparation directions printed on the product pack. Follow the label carefully.",
    ingredientsList: [
      { name: "Cacao", note: "A rich, chocolatey base." },
      { name: "Cinnamon", note: "A familiar warming spice." },
      { name: "Ashwagandha", note: "A botanical ingredient in the blend." },
    ],
    highlights: ["Rich cacao flavour", "A warming cinnamon finish", "Dropper-bottle serum format"],
    gallery: createGallery("Calm Cacao", [cacaoFront, cacaoSide, cacaoLifestyle, cacaoAngle, cacaoDetail]),
  },
];

export const findSanjivaniProduct = (slug?: string) => sanjivaniProducts.find((product) => product.slug === slug);