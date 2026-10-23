// MapLibre runs map rendering in a Web Worker loaded from a separate file,
// which the Next.js bundler doesn't emit. Copy the worker (and the shared
// chunk it imports) into public/ so ServiceAreaMap can point setWorkerUrl at it.
// The stylesheet is copied too, so it loads with the map instead of blocking first paint.
// Runs automatically before `npm run dev` and `npm run build`.
import { copyFileSync, mkdirSync } from "node:fs";

const from = "node_modules/maplibre-gl/dist";
const to = "public/maplibre";
mkdirSync(to, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs", "maplibre-gl.css"]) {
  copyFileSync(`${from}/${file}`, `${to}/${file}`);
}
console.log("Copied MapLibre worker and CSS to public/maplibre/");
