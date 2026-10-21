import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { sanjivaniReviewsBySlug } from "@/components/product/sanjivaniReviews";
import { findSanjivaniProduct } from "@/components/product/sanjivaniCatalog";

const ProductReviews = ({ slug }: { slug: string }) => {
  const product = findSanjivaniProduct(slug);
  const reviews = sanjivaniReviewsBySlug[slug] ?? [];
  if (!product || reviews.length === 0) return null;
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section aria-label={`Customer reviews for ${product.name}`} className="border-y border-border bg-secondary/60">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">Customer reviews</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">What buyers say about {product.name.replace("Sanjivani ", "")}.</h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-display text-5xl font-extrabold leading-none">{average.toFixed(1)}</p>
            <div>
              <div className="flex gap-0.5" aria-label={`Rated ${average.toFixed(1)} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= Math.round(average) ? "fill-accent-strong text-accent-strong" : "text-muted-foreground/40"}`} />)}
              </div>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{reviews.length} verified buyers</p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.name + review.city} className="flex flex-col border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg font-extrabold text-primary">{review.name.charAt(0)}</span>
                <div className="min-w-0">
                  <p className="font-bold">{review.name}, {review.city}</p>
                  <p className="text-xs text-muted-foreground">Verified buyer · {review.date}</p>
                </div>
                <div className="ml-auto flex gap-0.5" aria-label={`Rated ${review.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-accent-strong text-accent-strong" : "text-muted-foreground/40"}`} />)}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              {review.image && <img src={review.image} alt={review.imageAlt ?? `Photo shared by ${review.name}`} loading="lazy" width={1024} height={1024} className="mt-4 aspect-video w-full border border-border object-cover" />}
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">Reviews shown are from the store's order records. Ordering {product.isCombo ? "the trio" : "this drop"}? <Link to={`/checkout?buy=${product.slug}`} className="inline-flex items-center gap-1 font-bold text-foreground underline underline-offset-4">Buy now <ArrowRight className="h-4 w-4" /></Link></p>
      </div>
    </section>
  );
};

export default ProductReviews;
