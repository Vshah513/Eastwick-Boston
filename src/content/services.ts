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
    media: [{ kind: "placeholder", label: "Pressure washing clip" }],
  },
  {
    id: "house-wash",
    title: "House Wash",
    blurb: "A low-pressure soft wash for siding and roofs that clears algae and mildew without damage.",
    media: [{ kind: "placeholder", label: "House wash clip" }],
  },
  {
    // TODO_SERVICE_4: name, blurb and media from Henry.
    id: "service-4",
    title: "TODO_SERVICE_4",
    blurb: "TODO: one-line description.",
    media: [{ kind: "placeholder", label: "Service 4 clip" }],
  },
  {
    // TODO_SERVICE_5: name, blurb and media from Henry.
    id: "service-5",
    title: "TODO_SERVICE_5",
    blurb: "TODO: one-line description.",
    media: [{ kind: "placeholder", label: "Service 5 clip" }],
  },
];

/** Every service id the API accepts, including hidden ones. */
export const SERVICE_IDS = ALL_SERVICES.map((s) => s.id);

/** Services rendered on the site. */
export const SERVICES = ALL_SERVICES.filter((s) => !s.hidden);

export function serviceTitle(id: string): string {
  return ALL_SERVICES.find((s) => s.id === id)?.title ?? id;
}
