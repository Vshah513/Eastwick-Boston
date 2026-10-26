"use client";

import { useState, useRef, useCallback } from "react";
import MediaFrame from "@/components/MediaFrame";
import type { Orientation, Transformation } from "@/content/types";

interface BeforeAfterSliderProps {
  item: Transformation;
  /** Tailwind aspect-ratio classes for the slider area. */
  aspectClassName: string;
  /** Shape of the slider area, used to decide how media fills it. */
  frame: Orientation;
  sizes: string;
  /** Bigger title on the featured card. */
  featured?: boolean;
  /** Extra classes for the title/description caption, e.g. to hide it where a list already shows it. */
  captionClassName?: string;
}

const KEY_STEP = 5;

export default function BeforeAfterSlider({
  item,
  aspectClassName,
  frame,
  sizes,
  featured = false,
  captionClassName = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const clamp = (pct: number) => Math.min(Math.max(pct, 2), 98);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const isOnHandle = !!(e.target as HTMLElement).closest('[data-slider-handle="true"]');

      // On touch, only initiate a drag if the user pressed the handle.
      // This prevents the slider from jumping when the user taps the image.
      if (e.pointerType === "touch" && !isOnHandle) return;

      isDragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);

      // For mouse/pen, jump to the clicked position. For touch (handle only),
      // don't jump — let pointermove drive position so the slider follows the finger.
      if (e.pointerType !== "touch") {
        updatePosition(e.clientX);
      }
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const next: Record<string, number> = {
      ArrowLeft: position - KEY_STEP,
      ArrowDown: position - KEY_STEP,
      ArrowRight: position + KEY_STEP,
      ArrowUp: position + KEY_STEP,
      Home: 2,
      End: 98,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    setPosition(clamp(next[e.key]));
  };

  return (
    <figure className="group">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative ${aspectClassName} cursor-ew-resize select-none overflow-hidden rounded-3xl bg-line`}
      >
        {/* After (full background — clean) */}
        <MediaFrame item={item.after} frame={frame} sizes={sizes} placeholderAlign="right" />

        {/* Before (clipped — dirty) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <MediaFrame item={item.before} frame={frame} sizes={sizes} tone="dark" placeholderAlign="left" />
        </div>

        {/* Slider handle */}
        <div
          data-slider-handle="true"
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, touchAction: "none" }}
        >
          <div className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white shadow-lg" />
          {/* Larger transparent touch target for finger drag (mobile) */}
          <div className="absolute top-1/2 left-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-12 sm:w-12" />
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Before and after: ${item.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-valuetext={`${Math.round(position)}% before`}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 left-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl shadow-black/25"
          >
            <svg className="pointer-events-none h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
          After
        </span>
      </div>

      <figcaption className={`mt-4 px-1 ${captionClassName}`}>
        <h3 className={`font-bold tracking-tight text-ink ${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">{item.description}</p>
      </figcaption>
    </figure>
  );
}
