"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import MediaFrame from "@/components/MediaFrame";
import ScrollReveal from "@/components/ScrollReveal";
import { GALLERY, TRANSFORMATIONS } from "@/content/transformations";
import { useMediaQuery } from "@/lib/use-media-query";

export default function Transformations() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [featured, ...rest] = TRANSFORMATIONS;
  if (!featured) return null;

  return (
    <section id="transformations" className="bg-cream py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">Before &amp; after</p>
            <h2 className="mt-3 text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              See the <em className="font-normal text-copper">difference</em>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            Drag the handle on any photo to compare. Every pair is from a real Eastwick job.
          </p>
        </ScrollReveal>

        <div className="space-y-10 lg:space-y-14">
          <ScrollReveal>
            <BeforeAfterSlider
              item={featured}
              featured
              frame={isDesktop ? "landscape" : "portrait"}
              aspectClassName="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9]"
              sizes="(min-width: 1280px) 1216px, 100vw"
            />
          </ScrollReveal>
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
              {rest.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 0.08}>
                  <BeforeAfterSlider
                    item={t}
                    frame={isDesktop ? "landscape" : "portrait"}
                    aspectClassName="aspect-[4/5] sm:aspect-[4/3]"
                    sizes="(min-width: 1024px) 600px, 100vw"
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {GALLERY.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {GALLERY.map((g, i) => (
              <figure key={i}>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <MediaFrame item={g} frame="portrait" sizes="(min-width: 1024px) 300px, 50vw" />
                </div>
                {g.caption && <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
