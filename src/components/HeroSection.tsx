"use client";

import { motion } from "framer-motion";
import MediaFrame from "@/components/MediaFrame";
import { HERO } from "@/content/hero";
import { HAS_REVIEWS, OVERALL_RATING, REVIEW_COUNT } from "@/content/reviews";

const ease = [0.22, 1, 0.36, 1] as const;

function Star() {
  return (
    <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/** Rises in on mount. Translate only, no fade: the headline is the LCP element. */
function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ y: 22 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const card = "rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md";

/** Inset viewport panel: footage fills a rounded frame, headline on top, actions and proof along the base. */
export default function HeroSection() {
  return (
    <section className="bg-paper p-2.5 sm:p-3 lg:p-4">
      <div className="relative isolate flex min-h-[calc(100svh-1.25rem)] flex-col overflow-hidden rounded-[28px] bg-ink text-white sm:min-h-[calc(100svh-1.5rem)] lg:min-h-[calc(100svh-2rem)] lg:rounded-[32px]">
        <div className="absolute inset-0 -z-10">
          <MediaFrame item={HERO.media.mobile} frame="portrait" sizes="100vw" priority preload="metadata" tone="dark" />
        </div>
        {/* Legibility scrims */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-ink/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-2/3 bg-gradient-to-r from-ink/70 to-transparent lg:block" />

        <div className="flex flex-1 flex-col justify-between gap-10 px-5 pt-24 pb-5 sm:px-8 sm:pt-28 sm:pb-8 lg:px-12 lg:pt-36 lg:pb-12">
          <div>
            <Rise>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-light" aria-hidden />
                {HERO.eyebrow}
              </p>
            </Rise>
            <h1 className="mt-5 max-w-5xl text-[2.75rem] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-7xl lg:text-[5.75rem] xl:text-[6.5rem]">
              <Rise delay={0.05}>
                <span className="block">{HERO.headline.plain}</span>
              </Rise>
              <Rise delay={0.16}>
                <span className="block text-accent-light">{HERO.headline.accent}</span>
              </Rise>
            </h1>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <Rise delay={0.3} className="lg:max-w-lg">
              <p className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
                College-owned window cleaning, pressure washing and house washing across Boston and its western
                suburbs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#quote"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold whitespace-nowrap text-ink transition-colors hover:bg-fog sm:flex-none"
                >
                  <span className="sm:hidden">Free quote</span>
                  <span className="hidden sm:inline">Get a free quote</span> <span aria-hidden>→</span>
                </a>
                <a
                  href="#results"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-white/30 px-6 py-4 text-base font-semibold whitespace-nowrap text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:flex-none"
                >
                  See results
                </a>
              </div>
            </Rise>

            <Rise delay={0.4} className="order-first lg:order-none">
              <ul className="grid grid-cols-2 gap-2.5 lg:w-[30rem] lg:gap-3">
                {HAS_REVIEWS && (
                  <li className={card}>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} />
                      ))}
                    </div>
                    <p className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">{OVERALL_RATING.toFixed(1)}</p>
                    <p className="text-xs text-white/70 sm:text-sm">{REVIEW_COUNT}+ Google reviews</p>
                  </li>
                )}
                <li className={card}>
                  <svg className="h-5 w-5 text-accent-light" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  <p className="mt-2 font-heading text-lg leading-tight font-bold tracking-tight sm:text-xl">{HERO.insuredBadge}</p>
                  <p className="text-xs text-white/70 sm:text-sm">College owned &amp; operated</p>
                </li>
              </ul>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
