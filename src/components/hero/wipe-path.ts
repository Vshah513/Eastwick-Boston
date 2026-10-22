/**
 * Geometry and timing for the hero's "fanning" squeegee stroke: the blade
 * cleans the glass in horizontal bands, alternating direction, with a pivoting
 * U-turn at each edge — the S-shaped stroke professional window cleaners use.
 *
 * Pure functions only, so the animation driver can call `wipeStateAt` every
 * frame and write the result straight to the DOM.
 */

/** Seconds for one left↔right pass. */
export const PASS_S = 0.55;
/** Seconds for one U-turn between passes. */
export const TURN_S = 0.22;

/** Number of bands for a given hero height (≈4 on phones and desktops). */
export function bandCount(height: number): number {
  return Math.min(5, Math.max(3, Math.round(height / 210)));
}

export function wipeDuration(bands: number): number {
  return bands * PASS_S + (bands - 1) * TURN_S;
}

/** Blade length: one band plus a little overlap so no dirty strip is left between passes. */
export function bladeLength(height: number, bands: number): number {
  return height / bands + 12;
}

const easeInOut = (f: number) => 0.5 - 0.5 * Math.cos(Math.PI * f);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export type WipeState = {
  /** Blade centre, px from the hero's top-left. */
  x: number;
  y: number;
  /** Rotation in degrees. 0 = handle trailing left (moving right), 180 = moving left. */
  angle: number;
  /** CSS polygon() points for the area that is still dirty. */
  dirty: string;
  /** Current pass index, or the pass that just finished while turning. */
  pass: number;
  /** +1 moving right, -1 moving left. */
  dir: 1 | -1;
  inTurn: boolean;
  /** 0→1 progress through the current pass or turn (eased). */
  segment: number;
  done: boolean;
};

const NOTHING_DIRTY = "0px 0px, 0px 0px, 0px 0px";

export function wipeStateAt(p: number, width: number, height: number, bands: number): WipeState {
  const W = width;
  const H = height;
  const bandH = H / bands;
  const L = bladeLength(H, bands);
  const overshoot = L * 0.75; // start/finish just off-screen
  const t = clamp(p, 0, 1) * wipeDuration(bands);

  if (p >= 1) {
    const lastDir: 1 | -1 = (bands - 1) % 2 === 0 ? 1 : -1;
    return {
      x: lastDir === 1 ? W + overshoot : -overshoot,
      y: (bands - 0.5) * bandH,
      angle: lastDir === 1 ? 0 : 180,
      dirty: NOTHING_DIRTY,
      pass: bands - 1,
      dir: lastDir,
      inTurn: false,
      segment: 1,
      done: true,
    };
  }

  for (let i = 0; i < bands; i++) {
    const start = i * (PASS_S + TURN_S);
    const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const top = i * bandH;
    const bottom = i === bands - 1 ? H : (i + 1) * bandH;

    if (t < start + PASS_S) {
      const e = easeInOut((t - start) / PASS_S);
      const from = i === 0 ? -overshoot : dir === 1 ? 0 : W;
      const to = i === bands - 1 ? (dir === 1 ? W + overshoot : -overshoot) : dir === 1 ? W : 0;
      const x = from + (to - from) * e;
      const cx = clamp(x, 0, W);
      const dirty =
        dir === 1
          ? `${cx}px ${top}px, ${W}px ${top}px, ${W}px ${H}px, 0px ${H}px, 0px ${bottom}px, ${cx}px ${bottom}px`
          : `0px ${top}px, ${cx}px ${top}px, ${cx}px ${bottom}px, ${W}px ${bottom}px, ${W}px ${H}px, 0px ${H}px`;
      return { x, y: (i + 0.5) * bandH, angle: dir === 1 ? 0 : 180, dirty, pass: i, dir, inTurn: false, segment: e, done: false };
    }

    if (i < bands - 1 && t < start + PASS_S + TURN_S) {
      const f = (t - start - PASS_S) / TURN_S;
      const e = easeInOut(f);
      const edge = dir === 1 ? W : 0;
      // Pivot down one band. Right-edge turns rotate clockwise, left-edge turns
      // counter-clockwise, so the handle always trails the direction of travel.
      const angle = dir === 1 ? 180 * e : 180 - 180 * e;
      const x = edge + dir * Math.sin(Math.PI * f) * L * 0.18;
      const nextTop = (i + 1) * bandH;
      const dirty = `0px ${nextTop}px, ${W}px ${nextTop}px, ${W}px ${H}px, 0px ${H}px`;
      return { x, y: (i + 0.5 + e) * bandH, angle, dirty, pass: i, dir, inTurn: true, segment: e, done: false };
    }
  }

  // Unreachable for p < 1, but keep the type checker happy.
  return wipeStateAt(1, W, H, bands);
}
