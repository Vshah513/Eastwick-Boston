"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ScrollReveal from "@/components/ScrollReveal";
import { TRANSFORMATIONS } from "@/content/transformations";
import { useMediaQuery } from "@/lib/use-media-query";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** A numbered list of jobs drives one large before/after slider (chips on phones). */
export default function ResultsShowcase() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState(0);
  const item = TRANSFORMATIONS[active];
  if (!item) return null;
  const landscape = item.after.kind !== "placeholder" && item.after.orientation === "landscape";

  return (
    <section id="results" className="bg-fog py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Before &amp; after</Eyebrow>
            <RevealLines
              lines={["The difference", { text: "is clear.", className: "text-ink/35" }]}
              className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold text-ink sm:text-6xl lg:text-7xl"
            />
          </div>
          <ScrollReveal>
            <p className="max-w-sm text-base leading-relaxed text-muted sm:text-lg">
              Drag the handle to compare. Every pair is from a real Eastwick job.
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12 lg:gap-12">
          {/* Job selector: ruled list on desktop */}
          <ol className="hidden lg:col-span-4 lg:block" aria-label="Jobs">
            {TRANSFORMATIONS.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.id} className="border-t border-ink/10 last:border-b">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group relative flex w-full gap-5 py-6 text-left"
                  >
                    <span
                      className={`absolute top-0 left-0 h-[2px] bg-accent transition-all duration-500 ${on ? "w-full" : "w-0"}`}
                      aria-hidden
                    />
                    <span className={`pt-1 text-sm font-semibold tabular-nums ${on ? "text-accent" : "text-muted"}`}>{pad(i)}</span>
                    <span>
                      <span
                        className={`block font-heading text-2xl font-bold tracking-tight transition-colors ${
                          on ? "text-ink" : "text-ink/40 group-hover:text-ink"
                        }`}
                      >
                        {t.title}
                      </span>
                      <span
                        className={`mt-1 block text-sm leading-relaxed transition-colors ${on ? "text-muted" : "text-muted/60"}`}
                      >
                        {t.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <BeforeAfterSlider
                  item={item}
                  featured
                  frame={item.tall ? "portrait" : isDesktop || landscape ? "landscape" : "portrait"}
                  aspectClassName={
                    item.tall
                      ? "mx-auto max-w-[min(100%,26rem)] aspect-[1179/2083]"
                      : landscape
                        ? "aspect-[4/3]"
                        : "aspect-[4/5] sm:aspect-[4/3]"
                  }
                  sizes="(min-width: 1280px) 800px, (min-width: 1024px) 66vw, 100vw"
                  captionClassName="lg:hidden"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Job selector: chips above the slider on phones and tablets */}
          <div
            className="no-scrollbar order-first -mx-4 flex snap-x gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden"
            role="group"
            aria-label="Jobs"
          >
            {TRANSFORMATIONS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  i === active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
