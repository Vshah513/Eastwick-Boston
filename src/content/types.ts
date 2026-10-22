export type Orientation = "portrait" | "landscape";

/**
 * How media fills a frame whose shape differs from the clip:
 * - "cover": crop to fill (use `focal` to keep the subject in view)
 * - "contain-blur": show the whole clip over a blurred copy of itself
 * When omitted, the frame picks "cover" if orientations match, else "contain-blur".
 */
export type MediaFit = "cover" | "contain-blur";

export type MediaItem =
  | {
      kind: "video";
      src: string;
      poster: string;
      orientation: Orientation;
      /** CSS object-position, e.g. "50% 30%". */
      focal?: string;
      fit?: MediaFit;
      alt: string;
    }
  | {
      kind: "image";
      src: string;
      orientation: Orientation;
      focal?: string;
      fit?: MediaFit;
      alt: string;
    }
  | { kind: "placeholder"; label: string };

export type Service = {
  /** Stable id: used in the form payload and for "Quote this" pre-selection. */
  id: string;
  title: string;
  blurb: string;
  /** 1–3 items. The first is the main clip; the rest show as thumbnails. */
  media: MediaItem[];
  /** Hide from the page (and form) until the service is confirmed. */
  hidden?: boolean;
};

export type Transformation = {
  id: string;
  title: string;
  description: string;
  before: MediaItem;
  after: MediaItem;
};

export type Review = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Optional real date, e.g. "Sept 2026". Never a relative "3 weeks ago". */
  date?: string;
};

export type TeamMember = {
  name: string;
  title: string;
  bio: string;
  headshot?: string;
};

export type Area = { name: string; hq?: boolean };

export type Stat = { value: string; label: string };
