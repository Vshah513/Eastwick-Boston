"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MediaFrame from "@/components/MediaFrame";
import ScrollReveal from "@/components/ScrollReveal";
import { SERVICES } from "@/content/services";
import type { MediaItem, Service } from "@/content/types";
import { requestQuoteFor } from "@/lib/quote-events";
import { useMediaQuery } from "@/lib/use-media-query";

const pad = (n: number) => String(n + 1).padStart(2, "0");

function QuoteThisButton({ service, className = "" }: { service: Service; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => requestQuoteFor(service.id)}
      className={`inline-flex items-center gap-2 rounded-full bg-copper px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-copper-hover ${className}`}
    >
      Quote this <span aria-hidden>→</span>
      <span className="sr-only">: {service.title}</span>
    </button>
  );
}

/** Small tap-to-swap thumbnails, shown only when a service has more than one clip/photo. */
function AlbumThumbs({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: number;
  onSelect: (i: number) => void;
}) {
  if (service.media.length < 2) return null;
  return (
    <div className="flex gap-2" role="group" aria-label={`${service.title} media`}>
      {service.media.map((m, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={selected === i}
          aria-label={`Show ${service.title} ${m.kind === "placeholder" ? "item" : m.kind} ${i + 1}`}
          className={`relative h-14 w-12 overflow-hidden rounded-lg border-2 transition-colors ${
            selected === i ? "border-copper-light" : "border-white/15 hover:border-white/40"
          }`}
        >
          <Thumb item={m} />
        </button>
      ))}
    </div>
  );
}

function Thumb({ item }: { item: MediaItem }) {
  if (item.kind === "placeholder") return <span className="absolute inset-0 bg-ink-2" />;
  const src = item.kind === "video" ? item.poster : item.src;
  return <Image src={src} alt="" fill sizes="48px" className="object-cover" />;
}

export default function ServiceReels() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState(0);
  const [album, setAlbum] = useState<Record<string, number>>({});
  const [sectionInView, setSectionInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mediaFor = (s: Service) => s.media[album[s.id] ?? 0] ?? s.media[0];
  const selectMedia = (s: Service, i: number) => setAlbum((prev) => ({ ...prev, [s.id]: i }));

  // Desktop: the list item crossing the middle of the viewport drives the pinned frame.
  useEffect(() => {
    if (!isDesktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isDesktop]);

  // Desktop clips only play while the section itself is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setSectionInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="bg-ink py-16 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 max-w-2xl sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-light">Our services</p>
          <h2 className="mt-3 text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
            Watch the <em className="font-normal text-copper-light">magic happen</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-dark sm:text-lg">
            Real footage from real jobs. Pick a service to get a free quote for it.
          </p>
        </ScrollReveal>

        {/* ───── Phone & tablet: stacked reels ───── */}
        <div className="space-y-6 lg:hidden">
          {SERVICES.map((s, i) => (
            <article key={s.id} aria-labelledby={`svc-m-${s.id}`}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-3xl bg-ink-2">
                {!isDesktop && (
                  <MediaFrame
                    item={mediaFor(s)}
                    frame="portrait"
                    sizes="(min-width: 640px) 576px, 100vw"
                    tone="dark"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="font-heading text-sm italic text-copper-light">{pad(i)}</p>
                  <h3 id={`svc-m-${s.id}`} className="mt-1 text-3xl font-medium sm:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">{s.blurb}</p>
                  <QuoteThisButton service={s} className="mt-4" />
                </div>
              </div>
              {s.media.length > 1 && (
                <div className="mx-auto mt-3 max-w-xl">
                  <AlbumThumbs service={s} selected={album[s.id] ?? 0} onSelect={(m) => selectMedia(s, m)} />
                </div>
              )}
            </article>
          ))}
        </div>

        {/* ───── Desktop: pinned frame + scrolling list ───── */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative mx-auto aspect-[4/5] w-[min(100%,calc(80vh*0.8))] overflow-hidden rounded-3xl bg-ink-2">
                {isDesktop &&
                  SERVICES.map((s, i) => (
                    <div
                      key={s.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden={i !== active}
                    >
                      <MediaFrame
                        item={mediaFor(s)}
                        frame="portrait"
                        sizes="(min-width: 1280px) 640px, 50vw"
                        active={sectionInView && i === active}
                        preload={i === 0 ? "metadata" : "none"}
                        tone="dark"
                      />
                    </div>
                  ))}
                <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {pad(active)} / {pad(SERVICES.length - 1)}
                </div>
              </div>
              <div className="mx-auto mt-4 w-[min(100%,calc(80vh*0.8))]">
                <AlbumThumbs
                  service={SERVICES[active]}
                  selected={album[SERVICES[active].id] ?? 0}
                  onSelect={(m) => selectMedia(SERVICES[active], m)}
                />
              </div>
            </div>
          </div>

          <div>
            {SERVICES.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-[70vh] flex-col justify-center border-t border-white/10 py-12 first:border-t-0"
              >
                <article
                  aria-labelledby={`svc-d-${s.id}`}
                  className={`transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-40"}`}
                >
                  <p className="font-heading text-lg italic text-copper-light">{pad(i)}</p>
                  <h3 id={`svc-d-${s.id}`} className="mt-2 text-5xl font-medium leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-dark">{s.blurb}</p>
                  <QuoteThisButton service={s} className="mt-7" />
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
