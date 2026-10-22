"use client";

import { useSyncExternalStore } from "react";

/** Live result of a CSS media query. Always false during server rendering. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * The OS "reduce motion" setting, safe to branch rendering on: it is false
 * while hydrating (matching the server HTML) and updates right after, unlike
 * framer-motion's useReducedMotion, which differs on the first client render.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
