import type { MediaItem } from "./types";

export const HERO = {
  // TODO_HEADLINE: Henry is sending the copy. `accent` renders in copper italic.
  headline: { plain: "TODO_HEADLINE", accent: "accent phrase." },
  /**
   * Hero video. `mobile` should be portrait, `desktop` landscape. If only one
   * exists, set both to the same item. Keep under ~4 MB (npm run optimize-media).
   */
  media: {
    mobile: { kind: "placeholder", label: "Hero clip (portrait)" } as MediaItem,
    desktop: { kind: "placeholder", label: "Hero clip (landscape)" } as MediaItem,
  },
  /** TODO: add "Licensed & bonded" only if the client confirms it. */
  insuredBadge: "Fully Insured",
};
