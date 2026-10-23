import type { MediaItem } from "./types";

export const HERO = {
  // TODO_HEADLINE: Henry is sending the copy. `accent` renders in copper italic.
  headline: { plain: "TODO_HEADLINE", accent: "accent phrase." },
  /**
   * Hero video. `mobile` should be portrait, `desktop` landscape. If only one
   * exists, set both to the same item. Keep under ~4 MB (npm run optimize-media).
   */
  media: {
    mobile: { kind: "video", src: "/media/hero/hero-mobile.mp4", poster: "/media/hero/hero-mobile.jpg", orientation: "portrait", focal: "50% 60%", alt: "Eastwick crew pressure washing a pool deck and cleaning windows" } as MediaItem,
    desktop: { kind: "video", src: "/media/hero/hero-desktop.mp4", poster: "/media/hero/hero-desktop.jpg", orientation: "landscape", focal: "50% 50%", alt: "Eastwick crew pressure washing a pool deck and cleaning windows" } as MediaItem,
  },
  /** TODO: add "Licensed & bonded" only if the client confirms it. */
  insuredBadge: "Fully Insured",
};
