"use client";

import { useState } from "react";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import { AREAS } from "@/content/areas";
import { useMediaQuery } from "@/lib/use-media-query";

const pad = (n: number) => String(n + 1).padStart(2, "0");
const hasPin = (i: number) => typeof AREAS[i].lat === "number" && typeof AREAS[i].lng === "number";

/** Width of the floating town card on desktop, kept clear when the map fits its pins. */
const CARD_CLEARANCE = { top: 70, bottom: 70, left: 470, right: 70 };

/**
 * Desktop: the map fills a tall frame and a frosted card floats over its left
 * edge with the towns as a numbered list. Phones: heading, map, then a row of
 * town chips under it.
 */
export default function ServiceAreas() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState<number | null>(null);
  const select = (i: number) => setActive(active === i ? null : i);

  const heading = (
    <>
      <Eyebrow>Service areas</Eyebrow>
      <RevealLines
        lines={["Boston &", { text: "the western suburbs.", className: "text-ink/35" }]}
        className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold text-ink sm:text-6xl lg:text-[2.5rem]"
      />
      <p className="mt-4 text-base leading-relaxed text-muted lg:text-[15px]">
        {AREAS.length} towns, one crew. {isDesktop ? "Pick" : "Tap"} a town to find it on the map.
      </p>
    </>
  );

  return (
    <section id="areas" className="bg-paper py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">{heading}</div>

        <div className="relative mt-10 lg:mt-0 lg:h-[780px] lg:overflow-hidden lg:rounded-[32px] lg:border lg:border-line">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-fog sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none lg:border-0">
            <ServiceAreaMap
              areas={AREAS}
              active={active}
              onSelect={setActive}
              fitPadding={isDesktop ? CARD_CLEARANCE : 50}
              resetClassName={isDesktop ? "top-4 right-14" : "top-3 left-3"}
            />
          </div>

          {/* Desktop: floating frosted card */}
          <div className="absolute top-6 bottom-6 left-6 z-10 hidden w-[400px] flex-col overflow-y-auto rounded-3xl border border-white/70 bg-white/90 p-7 shadow-[0_30px_80px_-30px_rgba(11,27,51,0.45)] backdrop-blur-xl lg:flex">
            {heading}
            <ol className="mt-6 border-t border-line">
              {AREAS.map((area, i) => {
                const on = active === i;
                return (
                  <li key={area.name} className="border-b border-line">
                    <button
                      type="button"
                      disabled={!hasPin(i)}
                      aria-pressed={on}
                      onClick={() => select(i)}
                      className={`group flex w-full items-center gap-4 py-2 text-left transition-colors ${on ? "text-accent" : "text-ink"}`}
                    >
                      <span className="w-6 text-xs font-semibold text-muted tabular-nums">{pad(i)}</span>
                      <span className="flex-1 font-heading text-lg font-bold tracking-tight">{area.name}</span>
                      {area.hq && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
                          HQ
                        </span>
                      )}
                      <span
                        className={`text-sm transition-transform ${on ? "translate-x-0.5 text-accent" : "text-muted group-hover:translate-x-0.5"}`}
                        aria-hidden
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-auto pt-6 text-sm text-muted">
              Don&apos;t see your town?{" "}
              <a href="#quote" className="font-semibold text-accent underline underline-offset-4 hover:text-accent-hover">
                Ask us
              </a>
              . We&apos;re always expanding.
            </p>
          </div>
        </div>

        {/* Phones and tablets: town chips under the map */}
        <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden" role="group" aria-label="Towns">
          {AREAS.map((area, i) => (
            <button
              key={area.name}
              type="button"
              disabled={!hasPin(i)}
              aria-pressed={active === i}
              onClick={() => select(i)}
              className={`inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                active === i ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
              }`}
            >
              {area.name}
              {area.hq && (
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${active === i ? "text-accent-light" : "text-accent"}`}>
                  HQ
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted lg:hidden">
          Don&apos;t see your town?{" "}
          <a href="#quote" className="font-semibold text-accent underline underline-offset-4 hover:text-accent-hover">
            Ask us
          </a>
          . We&apos;re always expanding.
        </p>
      </div>
    </section>
  );
}
