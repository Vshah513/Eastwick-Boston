import type { Stat } from "./types";
import { AREAS } from "./areas";
import { OVERALL_RATING } from "./reviews";

/** Company-wide stats in the navy panel. Numbers count up from 0 on first view. */
export const STATS: Stat[] = [
  { value: "1000+", label: "Properties served" },
  { value: OVERALL_RATING.toFixed(1), label: "Google rating" },
  { value: String(AREAS.length), label: "Towns served" },
  { value: "100%", label: "Satisfaction guaranteed" },
];
