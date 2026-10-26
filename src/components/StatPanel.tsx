"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import { STATS } from "@/content/stats";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/** "1000+" → { n: 1000, decimals: 0, suffix: "+" }. Non-numeric values aren't animated. */
function parse(value: string) {
  const m = value.match(/^(\d+(?:\.(\d+))?)(.*)$/);
  return m ? { n: Number(m[1]), decimals: m[2]?.length ?? 0, suffix: m[3] } : null;
}

/**
 * Counts up once when scrolled into view. Server HTML (and reduced motion)
 * shows the final value; it only resets to 0 if the figure starts off screen.
 */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = usePrefersReducedMotion();
  const parsed = parse(value);
  const [shown, setShown] = useState(value);
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!parsed || reduceMotion || !el || el.getBoundingClientRect().top < window.innerHeight) return;
    armed.current = true;
    setShown((0).toFixed(parsed.decimals) + parsed.suffix);
    // Runs once on mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || !armed.current || !parsed) return;
    const controls = animate(0, parsed.n, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v.toFixed(parsed.decimals) + parsed.suffix),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}

/** Inset navy panel: statement top-left, four big figures across the base. */
export default function StatPanel() {
  return (
    <section aria-label="Eastwick by the numbers" className="bg-paper px-2.5 py-2 sm:px-3 lg:px-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-6 py-14 text-white sm:px-10 sm:py-16 lg:rounded-[32px] lg:px-16 lg:py-24">
        <div
          className="pointer-events-none absolute -top-1/3 -right-1/4 -z-10 h-[140%] w-[80%] rounded-full bg-[radial-gradient(closest-side,rgba(31,95,191,0.45),transparent)]"
          aria-hidden
        />
        <div className="mx-auto max-w-7xl">
          <Eyebrow dark>By the numbers</Eyebrow>
          <RevealLines
            lines={["Run by students.", { text: "Held to a professional standard.", className: "text-white/45" }]}
            className="mt-4 max-w-4xl text-[2.1rem] leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl"
          />
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 lg:mt-24 lg:grid-cols-4 lg:gap-x-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col border-t border-white/15 pt-5">
                <dt className="order-2 mt-2 text-sm text-muted-dark">{stat.label}</dt>
                <dd className="order-1 font-heading text-5xl font-extrabold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
