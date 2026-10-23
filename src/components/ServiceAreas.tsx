"use client";

import { useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import { BUSINESS } from "@/lib/business";
import { AREAS } from "@/content/areas";

const hasPin = (i: number) => typeof AREAS[i].lat === "number" && typeof AREAS[i].lng === "number";

export default function ServiceAreas() {
  const [active, setActive] = useState<number | null>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);

  const selectCity = (i: number) => {
    setActive(active === i ? null : i);
    // On phones the map sits below the list; bring it into view so the fly-to is visible.
    if (active !== i && window.matchMedia("(max-width: 1023px)").matches) {
      mapBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const anyPins = AREAS.some((_, i) => hasPin(i));

  return (
    <section id="areas" className="bg-cream py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">Service areas</p>
            <h2 className="mt-3 text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Proudly serving <em className="font-normal text-copper">{BUSINESS.regionLong}</em>
            </h2>
            {anyPins && <p className="mt-4 text-sm text-muted sm:text-base">Tap a city to find it on the map.</p>}
            <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3">
              {AREAS.map((area, i) => {
                const selected = active === i;
                const base = `flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors sm:text-base ${
                  area.hq || selected ? "border-copper bg-copper text-white" : "border-sand bg-cream-2 text-ink"
                }`;
                const content = (
                  <>
                    <span className="truncate">{area.name}</span>
                    {area.hq && (
                      <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        HQ
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={area.name}>
                    {hasPin(i) ? (
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => selectCity(i)}
                        className={`${base} ${selected ? "ring-2 ring-copper ring-offset-2 ring-offset-cream" : "hover:border-copper"}`}
                      >
                        {content}
                      </button>
                    ) : (
                      <div className={base}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-muted sm:text-base">
              Don&apos;t see your area?{" "}
              <a href="#contact" className="font-semibold text-copper underline underline-offset-4 hover:text-copper-hover">
                Contact us
              </a>
              . We&apos;re always expanding.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div ref={mapBoxRef} className="relative aspect-square overflow-hidden rounded-3xl border border-sand bg-cream-2 sm:aspect-[4/3] lg:aspect-square">
              <ServiceAreaMap areas={AREAS} active={active} onSelect={setActive} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
