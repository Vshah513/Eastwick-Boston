import type { Area } from "./types";

/**
 * TODO: Boston-area cities from the client. Mark the HQ with `hq: true` and add
 * `lat`/`lng` to drop a pin on the map, e.g. { name: "Newton", lat: 42.337, lng: -71.209 }.
 */
export const AREAS: Area[] = [
  { name: "Boston", hq: true, lat: 42.3601, lng: -71.0589 },
  { name: "TODO_AREA_2" },
  { name: "TODO_AREA_3" },
  { name: "TODO_AREA_4" },
  { name: "TODO_AREA_5" },
  { name: "TODO_AREA_6" },
  { name: "TODO_AREA_7" },
  { name: "TODO_AREA_8" },
];

/** Where the map opens before any pins exist (and the "Reset" view when there are none). */
export const MAP_DEFAULT_VIEW = {
  label: "Greater Boston",
  center: { lat: 42.3601, lng: -71.0589 },
  zoom: 9.4,
};
