import vitalityFront from "@/assets/sanjivani-hero.jpg";
import vitalitySide from "@/assets/sanjivani-vitality-side.jpg";
import vitalityLifestyle from "@/assets/sanjivani-vitality-lifestyle.jpg";
import vitalityAngle from "@/assets/sanjivani-vitality-angle.jpg";
import gutFront from "@/assets/sanjivani-gut-glow.jpg";
import gutSide from "@/assets/sanjivani-gut-side.jpg";
import gutLifestyle from "@/assets/sanjivani-gut-lifestyle.jpg";
import gutAngle from "@/assets/sanjivani-gut-angle.jpg";
import greensFront from "@/assets/sanjivani-daily-greens.jpg";
import greensSide from "@/assets/sanjivani-greens-side.jpg";
import greensLifestyle from "@/assets/sanjivani-greens-lifestyle.jpg";
import greensAngle from "@/assets/sanjivani-greens-angle.jpg";
import cacaoFront from "@/assets/sanjivani-calm-cacao.jpg";
import cacaoSide from "@/assets/sanjivani-cacao-side.jpg";
import cacaoLifestyle from "@/assets/sanjivani-cacao-lifestyle.jpg";
import cacaoAngle from "@/assets/sanjivani-cacao-angle.jpg";

export interface ProductReview {
  name: string;
  rating: number;
  title: string;
  text: string;
}

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
  reviews: ProductReview[];
}

const sampleReviewers = ["Aanya R.", "Rohan M.", "Meera S.", "Kabir P.", "Ira D.", "Devika N.", "Arjun T.", "Nisha K.", "Samar B.", "Tara V."];
const sampleReviewTitles = ["A lovely little ritual", "Easy to make", "A flavour I enjoy", "Fits into my day", "A thoughtful blend", "Nicely balanced", "Simple and convenient", "Good in a smoothie", "Pleasant and easy", "A nice everyday option"];
const createSampleReviews = (flavour: string, preparation: string): ProductReview[] => sampleReviewers.map((name, index) => ({
  name,
  rating: index === 1 || index === 3 || index === 6 || index === 8 ? 4 : 5,
  title: sampleReviewTitles[index],
  text: [
    `I like the ${flavour} notes and how easy it is to prepare.`,
    `The ${preparation} suggestion makes this simple to fit into my routine.`,
    `A pleasant ${flavour} drink that I enjoy making at home.`,
    `The flavour feels balanced, and I appreciate the straightforward preparation.`,
    `I have been enjoying this as an easy addition to my usual drink routine.`,
    `The ${flavour} notes come through nicely when mixed as directed.`,
    `A convenient format and an enjoyable taste for a simple daily ritual.`,
    `I like having another easy way to enjoy a ${flavour} drink.`,
    `It is quick to prepare and works well with the suggested ${preparation}.`,
    `An enjoyable blend with a flavour that suits my preferences.`,
  ][index],
}));

const createGallery = (name: string, images: [string, string, string, string]) => [
  { src: images[0], alt: `Sanjivani ${name} product packaging, front view` },
  { src: images[1], alt: `Sanjivani ${name} product packaging, alternate view` },
  { src: images[2], alt: `Sanjivani ${name} with its botanical ingredients` },
  { src: images[3], alt: `Sanjivani ${name} carton and jar, studio view` },
];

export const sanjivaniProducts: SanjivaniProduct[] = [
  {
    slug: "daily-vitality",
    name: "Daily Vitality",
    tagline: "A bright botanical blend for your everyday ritual.",
    ingredients: "Amla · Ginger · Tulsi",
    image: vitalityFront,
    label: "Bestseller",
    description: "A lively, plant-led powder bringing together familiar Indian botanicals and a bright, warming flavour. Made to be an easy addition to a daily drink or smoothie.",
    ritual: "Stir a serving into a glass of water, or blend into your favourite morning smoothie. Follow the directions printed on the product pack.",
    ingredientsList: [
      { name: "Amla", note: "A tart, fruity botanical note." },
      { name: "Ginger", note: "A familiar, warming flavour." },
      { name: "Tulsi", note: "An aromatic herb with a fresh finish." },
    ],
    highlights: ["Familiar botanical ingredients", "Bright, gently warming flavour", "Easy to mix into water or smoothies"],
    gallery: createGallery("Daily Vitality", [vitalityFront, vitalitySide, vitalityLifestyle, vitalityAngle]),
    reviews: createSampleReviews("bright amla and warming ginger", "water or a smoothie"),
  },
  {
    slug: "gut-glow",
    name: "Gut Glow",
    tagline: "A zesty citrus and ginger blend for a refreshing daily drink.",
    ingredients: "Citrus · Ginger · Fibre",
    image: gutFront,
    label: "Citrus ritual",
    description: "A bright-tasting blend of citrus, ginger and fibre, created for an uncomplicated drink ritual. Mix it with water for a refreshing citrus-forward sip.",
    ritual: "Stir a serving into cool or room-temperature water until smooth. Follow the directions printed on the product pack.",
    ingredientsList: [
      { name: "Citrus", note: "Adds a bright, tangy flavour." },
      { name: "Ginger", note: "Brings a gentle, warming note." },
      { name: "Fibre", note: "A considered part of this botanical blend." },
    ],
    highlights: ["Citrus-forward flavour", "A simple water-mix ritual", "Made with familiar pantry botanicals"],
    gallery: createGallery("Gut Glow", [gutFront, gutSide, gutLifestyle, gutAngle]),
    reviews: createSampleReviews("zesty citrus and ginger", "cool water"),
  },
  {
    slug: "daily-greens",
    name: "Daily Greens",
    tagline: "A fresh, garden-inspired greens blend for everyday sipping.",
    ingredients: "Moringa · Amla · Mint",
    image: greensFront,
    label: "Everyday greens",
    description: "A green, botanical blend pairing moringa and amla with a cooling hint of mint. Designed for easy mixing into water or a smoothie.",
    ritual: "Shake or stir a serving into water, or add to a smoothie. Follow the directions printed on the product pack.",
    ingredientsList: [
      { name: "Moringa", note: "A leafy, earthy botanical note." },
      { name: "Amla", note: "A tart fruit note to balance the greens." },
      { name: "Mint", note: "A cool, fresh finish." },
    ],
    highlights: ["Fresh mint finish", "Amla and leafy botanical notes", "Easy to add to a smoothie"],
    gallery: createGallery("Daily Greens", [greensFront, greensSide, greensLifestyle, greensAngle]),
    reviews: createSampleReviews("fresh mint and leafy greens", "a smoothie"),
  },
  {
    slug: "calm-cacao",
    name: "Calm Cacao",
    tagline: "A cosy cacao, cinnamon and botanical evening blend.",
    ingredients: "Cacao · Ashwagandha · Cinnamon",
    image: cacaoFront,
    label: "Evening ritual",
    description: "A rich cacao drink blend with warming cinnamon and a botanical touch. Made for a comforting, unhurried drink whenever it suits your routine.",
    ritual: "Whisk a serving into warm milk or your preferred plant-based drink. Follow the directions printed on the product pack.",
    ingredientsList: [
      { name: "Cacao", note: "A rich, chocolatey base." },
      { name: "Cinnamon", note: "A familiar warming spice." },
      { name: "Ashwagandha", note: "A botanical ingredient in the blend." },
    ],
    highlights: ["Rich cacao flavour", "A warming cinnamon finish", "Enjoy warm or blended into a drink"],
    gallery: createGallery("Calm Cacao", [cacaoFront, cacaoSide, cacaoLifestyle, cacaoAngle]),
    reviews: createSampleReviews("rich cacao and warming cinnamon", "a warm drink"),
  },
];

export const findSanjivaniProduct = (slug?: string) => sanjivaniProducts.find((product) => product.slug === slug);