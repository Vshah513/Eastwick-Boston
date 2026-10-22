"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import MediaFrame from "@/components/MediaFrame";
import GlassWipe from "@/components/hero/GlassWipe";
import { BUSINESS_LOCATION } from "@/lib/business";
import { HERO } from "@/content/hero";
import { STATS } from "@/content/stats";
import { HAS_REVIEWS, OVERALL_RATING, REVIEW_COUNT } from "@/content/reviews";

/** If the clip never starts (e.g. iOS Low Power Mode blocks autoplay), wipe over the poster. */
const AUTOPLAY_FALLBACK_MS = 2500;
/** Small pause after the clip starts so the dirty glass registers before the wipe. */
const WIPE_DELAY_MS = 500;

function Star() {
  return (
    <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function HeroSection() {
  const [wipeStarted, setWipeStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { mobile, desktop } = HERO.media;
  const singleSource = mobile === desktop;
  const hasVideo = mobile.kind === "video" || desktop.kind === "video";

  const startWipe = useCallback(() => {
    setTimeout(() => setWipeStarted(true), WIPE_DELAY_MS);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setWipeStarted(true), hasVideo ? AUTOPLAY_FALLBACK_MS : 900);
    return () => clearTimeout(t);
  }, [hasVideo]);

  return (
    <>
      <section ref={sectionRef} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink md:h-[88vh] md:min-h-[620px]">
        {/* Hero footage: portrait on phones, landscape on larger screens */}
        {singleSource ? (
          <MediaFrame item={mobile} frame="portrait" sizes="100vw" priority preload="metadata" tone="dark" onPlaying={startWipe} />
        ) : (
          <>
            <div className="absolute inset-0 md:hidden">
              <MediaFrame item={mobile} frame="portrait" sizes="100vw" priority preload="metadata" tone="dark" onPlaying={startWipe} />
            </div>
            <div className="absolute inset-0 hidden md:block">
              <MediaFrame item={desktop} frame="landscape" sizes="100vw" priority preload="metadata" tone="dark" onPlaying={startWipe} />
            </div>
          </>
        )}

        <GlassWipe start={wipeStarted} containerRef={sectionRef} />

        {/* Legibility fade behind the copy */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[70%] bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-[3] pb-8 sm:pb-12 md:pb-16">
          {/* Slide only, no fade: the headline is the LCP element, so it must be visible on first paint. */}
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-xs">
              Exterior cleaning · {BUSINESS_LOCATION}
            </p>
            <h1 className="mt-3 max-w-3xl [overflow-wrap:anywhere] text-[2.6rem] font-medium leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              {HERO.headline.plain}{" "}
              <em className="font-normal text-copper-light">{HERO.headline.accent}</em>
            </h1>

            <ul className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-white sm:text-sm">
              {HAS_REVIEWS && (
                <li className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                  <Star />
                  {OVERALL_RATING.toFixed(1)} · {REVIEW_COUNT}+ Google reviews
                </li>
              )}
              <li className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                <svg className="h-3.5 w-3.5 text-copper-light" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                {HERO.insuredBadge}
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-copper px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-copper-hover"
              >
                Get Your Free Quote
                <span aria-hidden>→</span>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                See the work
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company-wide trust stats */}
      <div className="border-b border-sand bg-cream">
        <dl className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-sand">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-2 py-5 text-center sm:py-7">
              <dt className="order-2 mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-xs">
                {stat.label}
              </dt>
              <dd className="order-1 font-heading text-2xl text-ink sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
