import type { MediaItem, Transformation } from "./types";

/**
 * Before/after pairs in the Results section. The first entry opens selected.
 * Use only real job photos. Raw files go in public/uploads/transformations/<id>/{before,after}/.
 *
 * TODO: these are real Eastwick jobs from the Raleigh location. Swap in the
 * Boston before/afters once the client's photos arrive. The client wants the three
 * titles to read: Walkway pressure wash, Window cleaning, House wash. The "House wash"
 * slot still shows the Raleigh driveway photos as a placeholder.
 */
export const TRANSFORMATIONS: Transformation[] = [
  {
    id: "house-wash",
    title: "House wash",
    description: "Dirt, algae and built-up grime washed away for a like-new exterior.",
    before: { kind: "image", src: "/media/transformations/driveway-before-photo.jpg", orientation: "landscape", alt: "Stained, weathered concrete driveway before pressure washing" },
    after: { kind: "image", src: "/media/transformations/driveway-after-photo.jpg", orientation: "landscape", alt: "Bright, evenly clean concrete driveway after pressure washing" },
  },
  {
    id: "windows",
    title: "Window cleaning",
    description: "Film and grime cleared from glass, frames and sills.",
    before: { kind: "image", src: "/media/transformations/windows-before-photo.jpg", orientation: "portrait", focal: "50% 60%", alt: "Dirty ground-floor windows before cleaning" },
    after: { kind: "image", src: "/media/transformations/windows-after-photo.jpg", orientation: "portrait", focal: "50% 60%", alt: "Clear, streak-free windows after cleaning" },
  },
  {
    id: "walkway",
    title: "Walkway pressure wash",
    description: "Algae and dirt washed off for a walkway that looks brand new.",
    before: { kind: "image", src: "/media/transformations/walkway-before-photo.jpg", orientation: "landscape", alt: "Darkened concrete walkway before pressure washing" },
    after: { kind: "image", src: "/media/transformations/walkway-after-photo.jpg", orientation: "landscape", alt: "Clean concrete walkway after pressure washing" },
  },
];

/** Optional extra job photos. Leave empty to hide. */
export const GALLERY: (MediaItem & { caption?: string })[] = [];
