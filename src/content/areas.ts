import type { Area } from "./types";

/**
 * Towns served, in the order the client listed them. Boston is the HQ.
 * `lat`/`lng` drop a pin on the map.
 */
export const AREAS: Area[] = [
  { name: "Boston", hq: true, lat: 42.3601, lng: -71.0589 },
  { name: "Wellesley", lat: 42.2968, lng: -71.2924 },
  { name: "Weston", lat: 42.3668, lng: -71.3031 },
  { name: "Newton", lat: 42.337, lng: -71.2092 },
  { name: "Needham", lat: 42.2809, lng: -71.2378 },
  { name: "Dover", lat: 42.2459, lng: -71.2828 },
  { name: "Westwood", lat: 42.214, lng: -71.2245 },
  { name: "Natick", lat: 42.2834, lng: -71.3495 },
];

/** Where the map opens before it fits to the pins (and the fallback "Reset" view). */
export const MAP_DEFAULT_VIEW = {
  label: "Greater Boston",
  center: { lat: 42.3, lng: -71.21 },
  zoom: 10,
};
