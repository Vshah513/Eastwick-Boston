"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Line = string | { text: string; className?: string };

/**
 * A heading that rises in one designed line at a time when it scrolls into
 * view. Each line sits in its own clipping mask, padded so descenders aren't
 * cropped. Visibility is watched on the heading itself: the lines start fully
 * clipped, so they can't report their own visibility. Reduced motion is
 * handled globally by MotionProvider.
 */
export default function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  id,
}: {
  lines: Line[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => {
        const { text, className: lineClass = "" } = typeof line === "string" ? { text: line } : line;
        return (
          <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <motion.span
              className={`block ${lineClass}`}
              initial={{ y: "105%" }}
              animate={inView ? { y: 0 } : { y: "105%" }}
              transition={{ duration: 0.9, delay: delay + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

/** Small uppercase label with a leading rule, used above every section heading. */
export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${dark ? "text-accent-light" : "text-accent"}`}>
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </p>
  );
}
