"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Squeegee, { BLADE_X, VIEWBOX_H, VIEWBOX_W } from "@/components/hero/Squeegee";
import { bandCount, bladeLength, wipeDuration, wipeStateAt } from "@/components/hero/wipe-path";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/* ───────────────────────────────────────────────────────
   Frosted glass over the hero footage, cleaned once by a
   squeegee in the pro "fanning" S-stroke, then a glint.
   The animation writes styles straight to refs each frame
   (no React re-renders) and only uses clip-path, transform
   and opacity, so it never causes layout shift.
   ─────────────────────────────────────────────────────── */

const MAX_TURNS = 4;
const DRIPS_PER_TURN = 3;
const FINISH_MS = 1400;

/** Grime painted on the glass, on top of the backdrop blur. */
const GRIME_BACKGROUND = [
  // dried water-spot rings
  ...[
    [12, 16, 26], [31, 40, 34], [54, 11, 18], [77, 47, 40], [21, 66, 22], [63, 76, 30],
    [88, 28, 16], [44, 58, 14], [83, 84, 24], [7, 88, 20], [69, 22, 12], [38, 90, 18],
  ].map(
    ([x, y, r]) =>
      `radial-gradient(circle ${r}px at ${x}% ${y}%, transparent 52%, rgba(255,255,250,0.2) 64%, rgba(255,255,250,0.06) 74%, transparent 80%)`
  ),
  // fingerprint smudges
  "radial-gradient(ellipse 80px 60px at 25% 35%, rgba(210,208,202,0.16) 0%, transparent 100%)",
  "radial-gradient(ellipse 60px 80px at 68% 25%, rgba(205,203,198,0.14) 0%, transparent 100%)",
  // milky haze + fog banks
  "radial-gradient(ellipse 600px 400px at 18% 25%, rgba(190,188,182,0.3) 0%, transparent 70%)",
  "radial-gradient(ellipse 500px 350px at 72% 60%, rgba(180,178,172,0.28) 0%, transparent 65%)",
  "linear-gradient(180deg, rgba(150,148,142,0.42) 0%, rgba(120,118,112,0.5) 45%, rgba(130,128,122,0.42) 100%)",
].join(", ");

const FROST_FILTER = "blur(18px) saturate(0.45) brightness(0.8) contrast(0.85)";

/** Deterministic pseudo-random in [0,1) so drips vary without Math.random churn. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className="absolute h-7 w-7 text-white" style={style} aria-hidden>
      <path
        d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function GlassWipe({
  start,
  containerRef,
}: {
  start: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"wiping" | "finish" | "done">("wiping");

  const frostRef = useRef<HTMLDivElement>(null);
  const squeegeeRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const seamRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dripRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!start || reduceMotion) return;
    const host = containerRef.current;
    const frost = frostRef.current;
    const squeegee = squeegeeRef.current;
    const sheen = sheenRef.current;
    if (!host || !frost || !squeegee || !sheen) return;

    let W = host.clientWidth;
    let H = host.clientHeight;
    const bands = bandCount(H);
    const ro = new ResizeObserver(() => {
      W = host.clientWidth;
      H = host.clientHeight;
    });
    ro.observe(host);

    let seamsShown = -1;
    let dripsShown = -1;

    const apply = (p: number) => {
      const s = wipeStateAt(p, W, H, bands);
      const L = bladeLength(H, bands);
      const bandH = H / bands;
      const svgW = L * (VIEWBOX_W / VIEWBOX_H);
      const bladeX = svgW * (BLADE_X / VIEWBOX_W);

      frost.style.clipPath = `polygon(${s.dirty})`;

      squeegee.style.width = `${svgW}px`;
      squeegee.style.height = `${L}px`;
      squeegee.style.transformOrigin = `${bladeX}px ${L / 2}px`;
      squeegee.style.transform = `translate3d(${s.x - bladeX}px, ${s.y - L / 2}px, 0) rotate(${s.angle}deg)`;
      squeegee.style.opacity = "1";

      // Wet sheen trailing the blade on the freshly cleaned glass.
      const sheenW = Math.min(110, W * 0.22);
      sheen.style.width = `${sheenW}px`;
      sheen.style.height = `${bandH}px`;
      sheen.style.background =
        s.dir === 1
          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.32))"
          : "linear-gradient(270deg, transparent, rgba(255,255,255,0.32))";
      const sheenLeft = s.dir === 1 ? s.x - sheenW : s.x;
      sheen.style.transform = `translate3d(${sheenLeft}px, ${s.pass * bandH}px, 0)`;
      sheen.style.opacity = s.inTurn ? String(1 - s.segment) : "1";

      // Entering a U-turn: leave a water seam on the band edge and shed drips.
      if (s.inTurn && s.pass > seamsShown && s.pass < MAX_TURNS) {
        seamsShown = s.pass;
        const seam = seamRefs.current[s.pass];
        if (seam) {
          seam.style.transform = `translate3d(0, ${(s.pass + 1) * bandH - 1}px, 0)`;
          seam.style.animation = "seam-fade 1.8s ease-out forwards";
        }
      }
      if (s.inTurn && s.pass > dripsShown && s.pass < MAX_TURNS) {
        dripsShown = s.pass;
        const edge = s.dir === 1 ? W : 0;
        for (let d = 0; d < DRIPS_PER_TURN; d++) {
          const drip = dripRefs.current[s.pass * DRIPS_PER_TURN + d];
          if (!drip) continue;
          const r = rand(s.pass * 10 + d);
          const x = edge - s.dir * (10 + r * 46);
          const y = s.y + (r - 0.3) * L * 0.6;
          drip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          drip.style.animation = `drip-fall ${0.9 + r * 0.6}s ${d * 0.08}s cubic-bezier(0.5, 0, 0.9, 0.6) forwards`;
        }
      }
    };

    apply(0);
    const controls = animate(0, 1, {
      duration: wipeDuration(bands),
      ease: "linear",
      onUpdate: apply,
      onComplete: () => setPhase("finish"),
    });

    return () => {
      controls.stop();
      ro.disconnect();
    };
  }, [start, reduceMotion, containerRef]);

  useEffect(() => {
    if (phase !== "finish") return;
    const t = setTimeout(() => setPhase("done"), FINISH_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (reduceMotion || phase === "done") return null;

  if (phase === "finish") {
    // Glint across the clean glass + a few sparkles, then unmount.
    return (
      <div className="glass-wipe pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
        <div
          className="absolute inset-y-[-20%] left-0 w-[45%] mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 70%, transparent 100%)",
            animation: "glint-sweep 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        />
        <Sparkle style={{ top: "16%", left: "76%", animation: "sparkle-pop 0.9s 0.25s ease-out both" }} />
        <Sparkle style={{ top: "34%", left: "14%", animation: "sparkle-pop 0.8s 0.45s ease-out both", scale: "0.7" }} />
        <Sparkle style={{ top: "48%", left: "58%", animation: "sparkle-pop 0.9s 0.6s ease-out both", scale: "0.85" }} />
      </div>
    );
  }

  return (
    <div className="glass-wipe pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {/* Frosted, grimy glass: blurs the footage behind it; clipped away as it's cleaned */}
      <div
        ref={frostRef}
        className="absolute inset-0"
        style={{
          backdropFilter: FROST_FILTER,
          WebkitBackdropFilter: FROST_FILTER,
          background: GRIME_BACKGROUND,
          willChange: "clip-path",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{ backgroundImage: "url(/media/hero/noise.png)", backgroundSize: "192px 192px" }}
        />
      </div>

      {/* Water seams left where passes overlap */}
      {Array.from({ length: MAX_TURNS }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            seamRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 h-[3px] w-full opacity-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 15%, rgba(220,235,240,0.35) 50%, rgba(255,255,255,0.55) 85%, transparent)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        />
      ))}

      <div ref={sheenRef} className="absolute left-0 top-0 mix-blend-soft-light" style={{ opacity: 0 }} />

      {/* Drips shed at each turn */}
      {Array.from({ length: MAX_TURNS * DRIPS_PER_TURN }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            dripRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 opacity-0"
        >
          <div
            className="h-3.5 w-[5px] rounded-full"
            style={{
              background: "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.95), rgba(200,225,235,0.55) 60%, rgba(160,190,200,0.2))",
              boxShadow: "0 0 3px rgba(255,255,255,0.5), 0 2px 3px rgba(0,0,0,0.3)",
            }}
          />
          <div className="mx-auto -mt-8 h-8 w-px bg-gradient-to-b from-transparent to-white/40" />
        </div>
      ))}

      <div
        ref={squeegeeRef}
        className="absolute left-0 top-0 opacity-0"
        style={{ filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.5)) drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}
      >
        <Squeegee className="h-full w-full" />
      </div>
    </div>
  );
}
