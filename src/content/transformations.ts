import type { MediaItem, Transformation } from "./types";

/**
 * Before/after sliders. The first entry is featured (largest) on desktop.
 * Use only real job photos. Put files in public/media/transformations/.
 */
export const TRANSFORMATIONS: Transformation[] = [
  {
    // TODO: real before/after pair from the client's upload.
    id: "windows",
    title: "Window restoration",
    description: "Hard-water spots and film cleared to crystal-clear glass.",
    before: { kind: "placeholder", label: "Before photo" },
    after: { kind: "placeholder", label: "After photo" },
  },
  {
    id: "driveway",
    title: "Driveway pressure wash",
    description: "Built-up stains lifted to reveal the original concrete.",
    before: { kind: "placeholder", label: "Before photo" },
    after: { kind: "placeholder", label: "After photo" },
  },
  {
    id: "siding",
    title: "Soft-washed siding",
    description: "Algae and mildew washed away without high pressure.",
    before: { kind: "placeholder", label: "Before photo" },
    after: { kind: "placeholder", label: "After photo" },
  },
];

/** Optional extra job photos under the sliders. Leave empty to hide the gallery. */
export const GALLERY: (MediaItem & { caption?: string })[] = [];
