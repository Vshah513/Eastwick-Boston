import type { Service } from "./types";

/**
 * Services shown in the reels section, the quote form, the footer and SEO.
 * Adding a service is one entry here. Raw media goes in public/uploads/services/<id>/.
 */
const ALL_SERVICES: Service[] = [
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    blurb: "Streak-free glass, inside and out. Homes, storefronts and every story in between.",
    media: [
      {
        kind: "video",
        src: "/media/services/window-cleaning.mp4",
        poster: "/media/services/window-cleaning.jpg",
        orientation: "portrait",
        alt: "Technician cleaning a window with a water-fed pole",
      },
    ],
  },
  {
    id: "pressure-washing",
    title: "Pressure Washing",
    blurb: "Driveways, walkways, patios and decks. Years of grime lifted in a single visit.",
    media: [
      {
        kind: "video",
        src: "/media/services/pressure-washing.mp4",
        poster: "/media/services/pressure-washing.jpg",
        orientation: "landscape",
        // Landscape clip in a portrait card: crop to the centre, where the surface cleaner works.
        fit: "cover",
        focal: "50% 50%",
        alt: "Surface cleaner pressure washing a wet concrete walkway",
      },
    ],
  },
  {
    id: "house-wash",
    title: "House Wash",
    blurb: "A low-pressure soft wash for siding and roofs that clears algae and mildew without damage.",
    media: [
      {
        kind: "video",
        src: "/media/services/house-wash.mp4",
        poster: "/media/services/house-wash.jpg",
        orientation: "landscape",
        // Landscape clip in a portrait card: crop to the right edge, where the soft-wash action happens.
        fit: "cover",
        focal: "100% 50%",
        alt: "Soft washing the siding and roof of a white two-story house",
      },
    ],
  },
  // To add a service later, copy this block (same format as the three above), fill it in, and
  // drop the clip and poster in public/media/services/ (npm run optimize-media makes both).
  // {
  //   id: "your-service",            // lowercase-hyphenated; used by the quote form and "Quote this"
  //   title: "Service Name",
  //   blurb: "One-line description.",
  //   media: [
  //     {
  //       kind: "video",
  //       src: "/media/services/your-service.mp4",
  //       poster: "/media/services/your-service.jpg",
  //       orientation: "landscape",  // or "portrait"; printed by npm run optimize-media
  //       fit: "cover",              // landscape clip in a portrait card: crop to the action
  //       focal: "50% 50%",          // which part of the clip stays in view
  //       alt: "What the clip shows",
  //     },
  //   ],
  // },
];

/** Every service id the API accepts, including hidden ones. */
export const SERVICE_IDS = ALL_SERVICES.map((s) => s.id);

/** Services rendered on the site. */
export const SERVICES = ALL_SERVICES.filter((s) => !s.hidden);

export function serviceTitle(id: string): string {
  return ALL_SERVICES.find((s) => s.id === id)?.title ?? id;
}
