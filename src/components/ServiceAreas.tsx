import ScrollReveal from "@/components/ScrollReveal";
import { BUSINESS } from "@/lib/business";
import { AREAS } from "@/content/areas";

export default function ServiceAreas() {
  return (
    <section id="areas" className="bg-cream py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">Service areas</p>
            <h2 className="mt-3 text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Proudly serving <em className="font-normal text-copper">{BUSINESS.regionLong}</em>
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3">
              {AREAS.map((area) => (
                <li
                  key={area.name}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium sm:text-base ${
                    area.hq ? "border-copper bg-copper text-white" : "border-sand bg-cream-2 text-ink"
                  }`}
                >
                  <span className="truncate">{area.name}</span>
                  {area.hq && (
                    <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      HQ
                    </span>
                  )}
                </li>
              ))}
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
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-sand bg-cream-2 sm:aspect-[4/3] lg:aspect-square">
              <iframe
                title={`Map of ${BUSINESS.mapQuery}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapQuery)}&z=10&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
