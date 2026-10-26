"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MediaFrame from "@/components/MediaFrame";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ScrollReveal from "@/components/ScrollReveal";
import { SERVICES } from "@/content/services";
import type { MediaItem, Service } from "@/content/types";
import { requestQuoteFor } from "@/lib/quote-events";

const pad = (n: number) => String(n + 1).padStart(2, "0");

function Thumb({ item }: { item: MediaItem }) {
  if (item.kind === "placeholder") return <span className="absolute inset-0 bg-line" />;
  const src = item.kind === "video" ? item.poster : item.src;
  return <Image src={src} alt="" fill sizes="48px" className="object-cover" />;
}

function ServicePanel({ service, open, playing }: { service: Service; open: boolean; playing: boolean }) {
  const [selected, setSelected] = useState(0);
  const media = service.media[selected] ?? service.media[0];

  return (
    <div className="grid gap-5 pb-8 lg:grid-cols-12 lg:gap-12 lg:pb-12">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink sm:max-w-md lg:col-span-5 lg:max-w-none">
        <MediaFrame
          item={media}
          frame="portrait"
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 448px, 100vw"
          active={playing}
          preload={open ? "metadata" : "none"}
          tone="dark"
        />
      </div>
      <div className="flex flex-col justify-between gap-6 lg:col-span-6 lg:col-start-7 lg:py-2">
        <div>
          <p className="text-base leading-relaxed text-muted sm:text-lg lg:font-heading lg:text-3xl lg:leading-snug lg:font-semibold lg:tracking-tight lg:text-ink">
            {service.blurb}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-ink">
            {["Free estimate", "Fully insured", "Satisfaction guaranteed"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-fog px-3 py-1.5">
                <svg className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
          {service.media.length > 1 && (
            <div className="mt-5 flex gap-2" role="group" aria-label={`${service.title} media`}>
              {service.media.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  aria-label={`Show ${service.title} ${m.kind === "placeholder" ? "item" : m.kind} ${i + 1}`}
                  className={`relative h-14 w-12 overflow-hidden rounded-lg border-2 transition-colors ${
                    selected === i ? "border-accent" : "border-transparent hover:border-line"
                  }`}
                >
                  <Thumb item={m} />
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => requestQuoteFor(service.id)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-hover sm:w-auto sm:self-start"
        >
          Quote {service.title.toLowerCase()} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

/** Numbered rail of services; each row opens to its footage and a "Quote this" action. */
export default function ServicesRail() {
  const [open, setOpen] = useState<number | null>(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Clips only play while the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="bg-paper py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>Services</Eyebrow>
            <RevealLines
              lines={["Three services.", { text: "One spotless finish.", className: "text-ink/35" }]}
              className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold text-ink sm:text-6xl lg:text-7xl"
            />
          </div>
          <ScrollReveal className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Real footage from real Eastwick jobs. Open a service to see it in action, then get a free quote for it.
            </p>
          </ScrollReveal>
        </div>

        <ul className="mt-12 border-t border-line sm:mt-16">
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            const panelId = `svc-panel-${s.id}`;
            return (
              <li key={s.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full items-center gap-4 py-6 text-left sm:gap-8 lg:py-8"
                  >
                    <span className="w-7 shrink-0 text-sm font-semibold text-accent tabular-nums">{pad(i)}</span>
                    <span
                      className={`flex-1 font-heading text-[1.75rem] leading-tight font-bold tracking-[-0.035em] transition-colors sm:text-4xl lg:text-5xl ${
                        isOpen ? "text-ink" : "text-ink/45 group-hover:text-ink"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className={`hidden w-[32%] text-sm leading-relaxed text-muted transition-opacity xl:block ${isOpen ? "opacity-0" : ""}`}>
                      {s.blurb}
                    </span>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-12 sm:w-12 ${
                        isOpen ? "rotate-45 border-ink bg-ink text-white" : "border-line text-ink group-hover:border-ink"
                      }`}
                      aria-hidden
                    >
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-label={s.title}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <ServicePanel service={s} open={isOpen} playing={isOpen && inView} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
