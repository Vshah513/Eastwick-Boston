import type { MediaItem } from "./types";

export const HERO = {
  /** `accent` renders in the light accent blue. */
  headline: { plain: "Crystal Clear Results,", accent: "Every Time." },
  /** Small line above the headline. Separate from BUSINESS.city, which is still unconfirmed. */
  eyebrow: "Window cleaning · Greater Boston",
  /**
   * Hero footage, filling the rounded hero panel at every size. Keep under ~4 MB
   * (npm run optimize-media). TODO: a landscape reel from the client would look
   * sharper on laptops than this portrait clip cropped to fit.
   */
  media: {
    mobile: { kind: "video", src: "/media/hero/hero-mobile.mp4", poster: "/media/hero/hero-mobile.jpg", orientation: "portrait", focal: "50% 55%", alt: "Eastwick crew pressure washing a pool deck and cleaning windows" } as MediaItem,
  },
  /** TODO: add "Licensed & bonded" only if the client confirms it. */
  insuredBadge: "Fully Insured",
};
