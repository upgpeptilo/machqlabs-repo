import { reviews, type Review } from "@/lib/reviews";

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="relative inline-flex text-neutral-300" aria-label={`${rating} out of 5 stars`}>
      <StarRow />
      <div className="absolute inset-0 overflow-hidden text-[#f5b400]" style={{ width: `${(rating / 5) * 100}%` }}>
        <StarRow />
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex w-80 shrink-0 flex-col rounded-lg border border-neutral-200 bg-white p-6">
      <Stars rating={review.rating} />
      <p className="mt-3 flex-1 text-sm text-neutral-600">&ldquo;{review.body}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef7f9] font-semibold text-[#1b6b80]">
          {review.name.charAt(0)}
        </span>
        <p className="font-semibold text-neutral-900">{review.name}</p>
      </div>
    </div>
  );
}

export default function Reviews({
  limit,
  title = "What Our Customers Say",
}: {
  limit?: number;
  title?: string;
}) {
  const shown = limit ? reviews.slice(0, limit) : reviews;
  const track = [...shown, ...shown];

  return (
    <section className="py-16">
      <h2 className="text-center text-2xl font-bold text-[#1b6b80]">{title}</h2>
      <div className="group mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div
          className="flex w-max gap-6 animate-reviews-marquee group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${shown.length * 6}s` }}
        >
          {track.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
