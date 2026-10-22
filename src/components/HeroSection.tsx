"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import MediaFrame from "@/components/MediaFrame";
import { BUSINESS_LOCATION } from "@/lib/business";
import { HERO } from "@/content/hero";
import { STATS } from "@/content/stats";
import { HAS_REVIEWS, OVERALL_RATING, REVIEW_COUNT } from "@/content/reviews";

/** If the clip never starts (e.g. iOS Low Power Mode blocks autoplay), wipe over the poster. */
const AUTOPLAY_FALLBACK_MS = 2500;
/** Small pause after the clip starts so the dirty glass registers before the wipe. */
const WIPE_DELAY_MS = 500;

/* ───────────────────────────────────────────────────────
   Squeegee-on-glass reveal, played once over the hero
   video: dirty glass is wiped clean top to bottom, then
   the layers unmount and the footage plays clean.
   ─────────────────────────────────────────────────────── */
function WindowWipe({ start }: { start: boolean }) {
  const progress = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start || reduceMotion) return;
    const controls = animate(progress, 1, {
      duration: 3,
      ease: [0.3, 0.05, 0.25, 1],
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [start, reduceMotion, progress]);

  const dirtyClip = useTransform(progress, (p) => `inset(${p * 100}% 0% 0% 0%)`);
  const squeegeeY = useTransform(progress, (p) => `${p * 100}%`);
  const squeegeeOpacity = useTransform(progress, [0, 0.008, 0.96, 1], [0, 1, 1, 0]);

  if (done || reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {/* ───── DIRTY GLASS (clipped away by the squeegee) ───── */}
      <motion.div className="absolute inset-0" style={{ clipPath: dirtyClip, willChange: "clip-path" }}>
        {/* Fog / grime base */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 600px 400px at 18% 25%, rgba(110,112,110,0.5) 0%, transparent 70%),
              radial-gradient(ellipse 500px 350px at 72% 55%, rgba(100,102,98,0.45) 0%, transparent 65%),
              radial-gradient(ellipse 400px 300px at 45% 80%, rgba(105,106,100,0.4) 0%, transparent 60%),
              radial-gradient(ellipse 350px 250px at 85% 15%, rgba(115,116,112,0.35) 0%, transparent 55%),
              linear-gradient(180deg, rgba(62,64,62,0.6) 0%, rgba(52,54,52,0.68) 40%, rgba(58,60,58,0.6) 100%)
            `,
          }}
        />
        {/* Dried water spots */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle 40px at 10% 18%, rgba(190,192,188,0.2) 0%, transparent 100%),
              radial-gradient(circle 55px at 32% 42%, rgba(180,182,178,0.16) 0%, transparent 100%),
              radial-gradient(circle 25px at 52% 12%, rgba(200,200,196,0.22) 0%, transparent 100%),
              radial-gradient(circle 65px at 76% 50%, rgba(170,172,168,0.18) 0%, transparent 100%),
              radial-gradient(circle 30px at 20% 68%, rgba(185,186,182,0.24) 0%, transparent 100%),
              radial-gradient(circle 45px at 62% 78%, rgba(175,176,172,0.17) 0%, transparent 100%),
              radial-gradient(circle 20px at 88% 30%, rgba(195,196,192,0.26) 0%, transparent 100%),
              radial-gradient(circle 50px at 45% 90%, rgba(165,166,162,0.2) 0%, transparent 100%),
              radial-gradient(circle 35px at 5% 50%, rgba(205,206,202,0.15) 0%, transparent 100%),
              radial-gradient(circle 28px at 95% 72%, rgba(190,190,186,0.2) 0%, transparent 100%)
            `,
          }}
        />
        {/* Vertical water streaks */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(178deg, transparent 5%, rgba(200,205,205,0.1) 25%, rgba(200,205,205,0.06) 60%, transparent 95%) 7% 0 / 2px 55% no-repeat,
              linear-gradient(179deg, transparent 10%, rgba(200,205,205,0.08) 35%, transparent 90%) 19% 8% / 1.5px 40% no-repeat,
              linear-gradient(177deg, transparent 5%, rgba(200,205,205,0.12) 20%, rgba(200,205,205,0.04) 70%, transparent 95%) 34% 3% / 2px 60% no-repeat,
              linear-gradient(180deg, transparent 15%, rgba(200,205,205,0.07) 40%, transparent 85%) 48% 12% / 1px 35% no-repeat,
              linear-gradient(178deg, transparent 5%, rgba(200,205,205,0.1) 30%, transparent 90%) 63% 0% / 1.5px 50% no-repeat,
              linear-gradient(181deg, transparent 10%, rgba(200,205,205,0.09) 25%, rgba(200,205,205,0.03) 65%, transparent 95%) 79% 5% / 2px 45% no-repeat,
              linear-gradient(179deg, transparent 8%, rgba(200,205,205,0.06) 30%, transparent 88%) 91% 15% / 1px 38% no-repeat
            `,
          }}
        />
        {/* Fingerprint smudges */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80px 60px at 25% 35%, rgba(150,150,146,0.12) 0%, transparent 100%),
              radial-gradient(ellipse 60px 80px at 68% 25%, rgba(145,145,140,0.1) 0%, transparent 100%),
              radial-gradient(ellipse 90px 50px at 50% 70%, rgba(155,155,150,0.08) 0%, transparent 100%)
            `,
          }}
        />
        {/* Grit grain: a pre-rendered tile is far cheaper than an SVG filter over playing video */}
        <div
          className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
          style={{ backgroundImage: "url(/media/hero/noise.png)", backgroundSize: "192px 192px" }}
        />
      </motion.div>

      {/* ───── SQUEEGEE ───── */}
      <motion.div className="absolute left-0 right-0" style={{ top: squeegeeY, opacity: squeegeeOpacity }}>
        {/* Handle */}
        <div className="absolute left-1/2 -top-16 flex -translate-x-1/2 flex-col items-center">
          <div
            className="h-7 w-[14px] rounded-t-md"
            style={{
              background: "linear-gradient(90deg, #3a2a20, #5a4030, #6b4c38, #5a4030, #3a2a20)",
              boxShadow: "2px 0 4px rgba(0,0,0,0.3), -1px 0 3px rgba(0,0,0,0.2)",
            }}
          />
          <div
            className="h-8 w-[10px]"
            style={{ background: "linear-gradient(90deg, #6b6b6b, #9a9a9a, #6b6b6b)", boxShadow: "1px 0 3px rgba(0,0,0,0.25)" }}
          />
          <div
            className="h-[6px] w-[28px] rounded-sm"
            style={{ background: "linear-gradient(90deg, #707070, #a0a0a0, #707070)", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          />
        </div>
        {/* Water pushed ahead of the blade */}
        <div
          className="-mb-1 mx-[6%] h-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(200,225,235,0.06) 0%, rgba(215,235,242,0.16) 50%, rgba(225,240,245,0.08) 100%)",
            borderRadius: "0 0 2px 2px",
          }}
        />
        {/* Suds line */}
        <div
          className="mx-[6%] h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 5%, rgba(255,255,255,0.34) 15%, rgba(255,255,255,0.14) 25%, rgba(255,255,255,0.3) 35%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.28) 55%, rgba(255,255,255,0.16) 65%, rgba(255,255,255,0.32) 75%, rgba(255,255,255,0.14) 85%, rgba(255,255,255,0.22) 95%, transparent 100%)`,
          }}
        />
        {/* Rubber blade */}
        <div
          className="mx-[6%] h-[6px]"
          style={{
            background: "linear-gradient(180deg, #1c1917 0%, #2f2a27 40%, #1c1917 100%)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            borderRadius: "0 0 1px 1px",
          }}
        />
        {/* Metal channel */}
        <div
          className="mx-[5.5%] h-[3px]"
          style={{
            background: "linear-gradient(180deg, #8a8a8a 0%, #b0b0b0 50%, #8a8a8a 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            borderRadius: "0 0 2px 2px",
          }}
        />
        {/* Drip trails */}
        {[
          { side: { left: "6%" }, h: "h-14" },
          { side: { right: "6%" }, h: "h-10" },
          { side: { left: "30%" }, h: "h-8" },
          { side: { right: "25%" }, h: "h-12" },
        ].map((drip, i) => (
          <div key={i} className="absolute top-[38px]" style={drip.side}>
            <div
              className={`w-[2px] ${drip.h} rounded-b-full`}
              style={{ background: "linear-gradient(180deg, rgba(220,235,240,0.2) 0%, transparent 100%)" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Star() {
  return (
    <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function HeroSection() {
  const [wipeStarted, setWipeStarted] = useState(false);
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
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink md:h-[88vh] md:min-h-[620px]">
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

        <WindowWipe start={wipeStarted} />

        {/* Legibility fade behind the copy */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[70%] bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-[3] pb-8 sm:pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-xs">
              Exterior cleaning · {BUSINESS_LOCATION}
            </p>
            <h1 className="mt-3 max-w-3xl text-[2.6rem] font-medium leading-[1.02] text-white sm:text-6xl lg:text-7xl">
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
