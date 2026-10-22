"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type AutoVideoProps = {
  src: string;
  poster: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Controlled playback. When omitted, the clip plays while at least half of
   * it is on screen and pauses when scrolled away.
   */
  active?: boolean;
  preload?: "none" | "metadata" | "auto";
  onPlaying?: () => void;
};

/**
 * Muted, looping, inline clip that only plays when visible. With reduced
 * motion enabled it never autoplays; a play button is shown instead.
 */
export default function AutoVideo({
  src,
  poster,
  label,
  className = "",
  style,
  active,
  preload = "none",
  onPlaying,
}: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [userPlaying, setUserPlaying] = useState(false);

  useEffect(() => {
    if (active !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.5,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  const visible = active ?? inView;
  const shouldPlay = reduceMotion ? userPlaying && visible : visible;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={preload}
        aria-label={label}
        onPlaying={onPlaying}
        className={className}
        style={style}
      />
      {reduceMotion && (
        <button
          type="button"
          onClick={() => setUserPlaying((p) => !p)}
          className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
          aria-label={userPlaying ? `Pause ${label}` : `Play ${label}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            {userPlaying ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 2.5v11l9-5.5z" />}
          </svg>
        </button>
      )}
    </>
  );
}
