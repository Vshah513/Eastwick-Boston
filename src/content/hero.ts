import type { MediaItem } from "./types";

export const HERO = {
  /** `accent` renders in copper italic. */
  headline: { plain: "Crystal Clear Results,", accent: "Every Time." },
  /** Small line above the headline. Separate from BUSINESS.city, which is still unconfirmed. */
  eyebrow: "Exterior cleaning · Boston, MA",
  /**
   * Hero footage, portrait. `mobile` fills the screen on phones; `panel` sits to
   * the right of the copy on larger screens. Keep under ~4 MB (npm run optimize-media).
   */
  media: {
    mobile: { kind: "video", src: "/media/hero/hero-mobile.mp4", poster: "/media/hero/hero-mobile.jpg", orientation: "portrait", focal: "50% 60%", alt: "Eastwick crew pressure washing a pool deck and cleaning windows" } as MediaItem,
    panel: { kind: "video", src: "/media/hero/hero-mobile.mp4", poster: "/media/hero/hero-mobile.jpg", orientation: "portrait", focal: "50% 40%", alt: "Eastwick crew pressure washing a pool deck and cleaning windows" } as MediaItem,
  },
  /** TODO: add "Licensed & bonded" only if the client confirms it. */
  insuredBadge: "Fully Insured",
};
