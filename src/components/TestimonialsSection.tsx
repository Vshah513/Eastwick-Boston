"use client";

import { useEffect, useRef, useState } from "react";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ScrollReveal from "@/components/ScrollReveal";
import { BUSINESS } from "@/lib/business";
import { HAS_REVIEWS, OVERALL_RATING, REVIEWS, REVIEW_COUNT } from "@/content/reviews";
import type { Review } from "@/content/types";

// The fuller reviews read best as featured statements, so they lead.
const ORDERED = [...REVIEWS].sort((a, b) => b.text.length - a.text.length);
const pad = (n: number) => String(n).padStart(2, "0");

function Stars({ count, className = "h-4 w-4" }: { count: number; className?: string }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${className} ${i < count ? "text-amber-500" : "text-line"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
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

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <figure
      data-index={index}
      aria-label={`Review ${index + 1} of ${ORDERED.length}`}
      className="flex w-[86%] shrink-0 snap-start flex-col justify-between rounded-[28px] border border-line bg-white p-7 sm:w-[70%] sm:p-10 lg:w-[62%] lg:p-14"
    >
      <div>
        <svg className="h-8 w-8 text-accent sm:h-10 sm:w-10" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
          <path d="M9.3 26C5.2 26 2 22.7 2 18.4 2 11.6 7.1 6.3 13.6 6v3.6c-3.4.6-5.8 3-6.3 6.1.6-.2 1.3-.3 2-.3 3.8 0 6.5 2.7 6.5 5.4S13.2 26 9.3 26Zm16.4 0c-4.1 0-7.3-3.3-7.3-7.6 0-6.8 5.1-12.1 11.6-12.4v3.6c-3.4.6-5.8 3-6.3 6.1.6-.2 1.3-.3 2-.3 3.8 0 6.5 2.7 6.5 5.4S29.6 26 25.7 26Z" />
        </svg>
        <blockquote className="mt-6 font-heading text-lg leading-snug font-semibold tracking-[-0.02em] text-ink sm:text-2xl lg:text-[1.9rem] lg:leading-[1.3]">
          {review.text}
        </blockquote>
      </div>
      <figcaption className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-heading text-base font-bold text-white" aria-hidden>
            {review.name[0]}
          </span>
          <div>
            <p className="font-semibold text-ink">{review.name}</p>
            {review.date ? <p className="text-sm text-muted">{review.date}</p> : <p className="text-sm text-muted">Google review</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stars count={review.rating} className="h-4 w-4" />
          <GoogleG className="hidden h-5 w-5 sm:block" />
        </div>
      </figcaption>
    </figure>
  );
}

/** One review at a time, set large; swipe on phones or use the arrows. */
export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // The card nearest the track's start edge is current (works for swipes, arrows and keyboard
  // scrolling alike). Once scrolled to the end, the last card counts as current.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        setCurrent(ORDERED.length - 1);
        return;
      }
      const start = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).scrollPaddingLeft || "0");
      let best = 0;
      let bestDist = Infinity;
      track.querySelectorAll("figure").forEach((el, i) => {
        const d = Math.abs(el.getBoundingClientRect().left - start);
        if (d < bestDist) [best, bestDist] = [i, d];
      });
      setCurrent(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const next = Math.min(Math.max(current + dir, 0), ORDERED.length - 1);
    trackRef.current
      ?.querySelector<HTMLElement>(`figure[data-index="${next}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  if (!HAS_REVIEWS) return null;

  const arrow =
    "flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <section id="reviews" className="overflow-hidden bg-fog py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Google reviews</Eyebrow>
            <RevealLines
              lines={["Neighbors", { text: "who noticed.", className: "text-ink/35" }]}
              className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold text-ink sm:text-6xl lg:text-7xl"
            />
          </div>
          <ScrollReveal className="flex items-center gap-4">
            <span className="font-heading text-6xl font-extrabold tracking-[-0.05em] text-ink sm:text-7xl">
              {OVERALL_RATING.toFixed(1)}
            </span>
            <div>
              <Stars count={Math.round(OVERALL_RATING)} />
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                <GoogleG className="h-4 w-4" /> {REVIEW_COUNT}+ reviews on Google
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar mt-12 -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 sm:-mx-6 sm:mt-16 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
        >
          {ORDERED.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} index={i} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => go(-1)} disabled={current === 0} className={arrow} aria-label="Previous review">
              <span aria-hidden>←</span>
            </button>
            <button type="button" onClick={() => go(1)} disabled={current === ORDERED.length - 1} className={arrow} aria-label="Next review">
              <span aria-hidden>→</span>
            </button>
            <p className="ml-2 text-sm font-semibold text-ink tabular-nums" aria-live="polite">
              {pad(current + 1)} <span className="text-muted">/ {pad(ORDERED.length)}</span>
            </p>
          </div>
          <a
            href={BUSINESS.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Read all reviews on Google <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
