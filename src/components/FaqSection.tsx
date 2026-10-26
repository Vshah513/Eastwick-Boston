"use client";

import { useState } from "react";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ScrollReveal from "@/components/ScrollReveal";
import { FAQS } from "@/content/faq";
import { SMS_HREF } from "@/lib/business";

/** Narrow heading column beside a ruled accordion. */
export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-fog py-20 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>FAQ</Eyebrow>
            <RevealLines
              lines={["Good", { text: "questions.", className: "text-ink/35" }]}
              className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold text-ink sm:text-6xl"
            />
            <ScrollReveal>
              <p className="mt-5 max-w-xs text-base leading-relaxed text-muted">
                Something else on your mind? Send us a text and a real person will get back to you.
              </p>
              <a
                href={SMS_HREF}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                Text us <span aria-hidden>→</span>
              </a>
            </ScrollReveal>
          </div>
        </div>

        <ul className="border-t border-ink/10 lg:col-span-8">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <li key={item.q} className="border-b border-ink/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={id}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left lg:py-7"
                  >
                    <span className="font-heading text-lg font-bold tracking-tight text-ink sm:text-2xl">{item.q}</span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen ? "rotate-45 border-accent bg-accent text-white" : "border-ink/15 text-ink group-hover:border-ink"
                      }`}
                      aria-hidden
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-2xl pr-12 pb-7 text-base leading-relaxed text-muted sm:text-lg">{item.a}</p>
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
