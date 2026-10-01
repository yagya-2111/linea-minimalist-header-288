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

const sampleReviews: ProductReview[] = [
  { name: "Aanya R.", rating: 5, title: "A lovely morning ritual", text: "The flavour is bright and easy to work into my breakfast routine." },
  { name: "Rohan M.", rating: 4, title: "Simple and thoughtful", text: "I like the familiar ingredient blend and the straightforward preparation." },
  { name: "Meera S.", rating: 5, title: "Enjoyable taste", text: "A pleasant everyday drink, especially when mixed into a smoothie." },
  { name: "Kabir P.", rating: 4, title: "Fits my routine", text: "The serving is convenient and the flavour feels nicely balanced." },
  { name: "Ira D.", rating: 5, title: "A new favourite", text: "I enjoy the botanical notes and the easy-to-mix powder." },
  { name: "Devika N.", rating: 5, title: "Well considered", text: "The ingredient combination feels familiar, and it tastes good chilled." },
  { name: "Arjun T.", rating: 4, title: "Good everyday option", text: "A convenient addition to my kitchen shelf and morning routine." },
  { name: "Nisha K.", rating: 5, title: "Bright and delicious", text: "I enjoy the flavour with water or blended into a fruit smoothie." },
  { name: "Samar B.", rating: 4, title: "Easy to prepare", text: "No complicated routine—just mix, stir, and enjoy." },
  { name: "Tara V.", rating: 5, title: "Thoughtful blend", text: "A tasty way to enjoy these familiar ingredients in one drink." },
];

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
    reviews: sampleReviews,
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
    reviews: sampleReviews,
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
    reviews: sampleReviews,
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
    reviews: sampleReviews,
  },
];

export const findSanjivaniProduct = (slug?: string) => sanjivaniProducts.find((product) => product.slug === slug);