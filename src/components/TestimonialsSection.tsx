"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { BUSINESS } from "@/lib/business";
import { HAS_REVIEWS, OVERALL_RATING, REVIEWS, REVIEW_COUNT } from "@/content/reviews";
import type { Review } from "@/content/types";

function Stars({ count, className = "h-4 w-4" }: { count: number; className?: string }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${className} ${i < count ? "text-amber-500" : "text-sand"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function ReviewCard({ review, hidden }: { review: Review; hidden?: boolean }) {
  return (
    <figure
      aria-hidden={hidden}
      className="flex w-[280px] flex-shrink-0 flex-col rounded-2xl border border-sand bg-cream p-6 sm:w-[360px]"
    >
      <span className="font-heading text-5xl leading-none text-copper" aria-hidden>
        &ldquo;
      </span>
      <blockquote className="mt-1 flex-1 text-[15px] leading-relaxed text-ink line-clamp-5">{review.text}</blockquote>
      <figcaption className="mt-5 flex items-center justify-between border-t border-sand pt-4">
        <div>
          <p className="text-sm font-semibold text-ink">{review.name}</p>
          {review.date && <p className="text-xs text-muted">{review.date}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Stars count={review.rating} className="h-3.5 w-3.5" />
          <GoogleG className="h-4 w-4" />
        </div>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const touchResumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const marquee = !reduceMotion;

  // Auto-scroll marquee (off with reduced motion: the strip just scrolls by hand)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !marquee) return;
    let raf: number;
    const speed = 0.5;

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // Loop: when halfway through duplicated content, reset
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, marquee]);

  // Pause while the user touches/swipes on mobile, then resume after a short delay.
  const handleTouchStart = () => {
    if (touchResumeRef.current) {
      clearTimeout(touchResumeRef.current);
      touchResumeRef.current = null;
    }
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (touchResumeRef.current) clearTimeout(touchResumeRef.current);
    touchResumeRef.current = setTimeout(() => setIsPaused(false), 1500);
  };

  useEffect(() => {
    return () => {
      if (touchResumeRef.current) clearTimeout(touchResumeRef.current);
    };
  }, []);

  if (!HAS_REVIEWS) return null;

  // Duplicate reviews for a seamless loop; the copies are hidden from screen readers.
  const cards = marquee ? [...REVIEWS, ...REVIEWS] : REVIEWS;

  return (
    <section id="reviews" className="overflow-hidden bg-cream-2 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto mb-10 max-w-7xl px-4 sm:mb-14 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">Google reviews</p>
            <h2 className="mt-3 text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Neighbors who <em className="font-normal text-copper">noticed</em>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-heading text-6xl text-ink sm:text-7xl">{OVERALL_RATING.toFixed(1)}</span>
            <div>
              <Stars count={Math.round(OVERALL_RATING)} />
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <GoogleG className="h-4 w-4" /> {REVIEW_COUNT}+ reviews on Google
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`no-scrollbar flex gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:gap-6 sm:px-6 ${
          marquee ? "sm:overflow-x-hidden" : "snap-x snap-mandatory"
        }`}
      >
        {cards.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} hidden={i >= REVIEWS.length} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={BUSINESS.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream"
        >
          Read all reviews on Google <span aria-hidden>↗</span>
        </a>
      </div>
    </section>
  );
}
