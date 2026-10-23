"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import type { Area } from "@/content/types";
import { MAP_DEFAULT_VIEW } from "@/content/areas";
import { BUSINESS } from "@/lib/business";

/** Free vector tiles (no API key, commercial use allowed). Muted style to match the cream palette. */
const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const FOCUS_ZOOM = 11.5;
/** Copied from node_modules by scripts/copy-maplibre-worker.mjs (the bundler doesn't emit it). */
const WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";
/** Loaded on demand (same copy script) so it doesn't block the first paint of the page. */
const CSS_URL = "/maplibre/maplibre-gl.css";

function loadMapCss(): Promise<void> {
  if (document.querySelector(`link[href="${CSS_URL}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_URL;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

type Pinned = Area & { lat: number; lng: number; index: number };

const pinnedAreas = (areas: Area[]): Pinned[] =>
  areas.flatMap((a, index) =>
    typeof a.lat === "number" && typeof a.lng === "number" ? [{ ...a, lat: a.lat, lng: a.lng, index }] : []
  );

function popupContent(area: Pinned): HTMLElement {
  // Built with DOM nodes (not HTML strings) so config text can never inject markup.
  const root = document.createElement("div");
  const title = document.createElement("p");
  title.className = "ew-popup-title";
  title.textContent = area.name;
  if (area.hq) {
    const tag = document.createElement("span");
    tag.className = "ew-popup-tag";
    tag.textContent = "HQ";
    title.append(" ", tag);
  }
  const link = document.createElement("a");
  link.href = "#quote";
  link.className = "ew-popup-link";
  link.textContent = `Get a quote in ${area.name} →`;
  root.append(title, link);
  return root;
}

export default function ServiceAreaMap({
  areas,
  active,
  onSelect,
}: {
  areas: Area[];
  /** Index into `areas` of the selected city, or null. */
  active: number | null;
  onSelect: (index: number | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<number, { marker: Marker; popup: Popup; el: HTMLElement }>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [nearViewport, setNearViewport] = useState(false);
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const pins = pinnedAreas(areas);

  // Only download the map library and tiles when the section is about to scroll into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNearViewport(true), {
      rootMargin: "400px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(({ popup }) => popup.remove());
    if (pins.length > 1) {
      map.fitBounds(
        pins.reduce(
          (b, p) => [
            [Math.min(b[0][0], p.lng), Math.min(b[0][1], p.lat)],
            [Math.max(b[1][0], p.lng), Math.max(b[1][1], p.lat)],
          ],
          [
            [pins[0].lng, pins[0].lat],
            [pins[0].lng, pins[0].lat],
          ] as [[number, number], [number, number]]
        ),
        { padding: 60, maxZoom: 11 }
      );
    } else {
      const c = pins[0] ?? MAP_DEFAULT_VIEW.center;
      map.flyTo({ center: [c.lng, c.lat], zoom: pins[0] ? 11 : MAP_DEFAULT_VIEW.zoom, essential: false });
    }
  };
  const resetViewRef = useRef(resetView);
  useEffect(() => {
    resetViewRef.current = resetView;
  });

  // Create the map once.
  useEffect(() => {
    if (!nearViewport || !containerRef.current || mapRef.current) return;
    let cancelled = false;
    const markers = markersRef.current;

    Promise.all([import("maplibre-gl"), loadMapCss()])
      .then(([{ Map: MapCtor, Marker: MarkerCtor, Popup: PopupCtor, NavigationControl, setWorkerUrl }]) => {
        if (cancelled || !containerRef.current) return;
        setWorkerUrl(new URL(WORKER_URL, window.location.origin).href);
        const map = new MapCtor({
          container: containerRef.current,
          style: MAP_STYLE,
          center: [MAP_DEFAULT_VIEW.center.lng, MAP_DEFAULT_VIEW.center.lat],
          zoom: MAP_DEFAULT_VIEW.zoom,
          minZoom: 6,
          maxZoom: 16,
          // Phones: two fingers to pan, so the page still scrolls. Desktop: Ctrl/⌘ + scroll to zoom.
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
          attributionControl: { compact: true },
        });
        mapRef.current = map;
        map.addControl(new NavigationControl({ showCompass: false }), "top-right");

        for (const area of pinnedAreas(areas)) {
          const el = document.createElement("button");
          el.type = "button";
          el.className = `ew-pin${area.hq ? " ew-pin--hq" : ""}`;
          el.setAttribute("aria-label", `${area.name}${area.hq ? " (headquarters)" : ""}`);
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            onSelectRef.current(area.index);
          });
          const popup = new PopupCtor({ offset: area.hq ? 22 : 16, closeButton: false, className: "ew-popup", maxWidth: "240px" })
            .setDOMContent(popupContent(area));
          popup.on("close", () => {
            el.classList.remove("is-active");
          });
          const marker = new MarkerCtor({ element: el, anchor: "center" }).setLngLat([area.lng, area.lat]).addTo(map);
          markers.set(area.index, { marker, popup, el });
        }

        map.on("load", () => {
          if (cancelled) return;
          setStatus("ready");
          if (markers.size > 0) resetViewRef.current();
        });
        map.on("error", (e) => {
          // Only treat a failed style/tile load before first render as fatal.
          if (!map.loaded() && (e as { error?: { status?: number } }).error) setStatus((s) => (s === "ready" ? s : "failed"));
        });
      })
      .catch(() => !cancelled && setStatus("failed"));

    return () => {
      cancelled = true;
      markers.forEach(({ marker, popup }) => {
        popup.remove();
        marker.remove();
      });
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [nearViewport, areas]);

  // Fly to and highlight the selected city.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(({ popup, el }, index) => {
      if (index !== active) {
        el.classList.remove("is-active");
        popup.remove();
      }
    });
    if (active === null) return;
    const entry = markersRef.current.get(active);
    const area = areas[active];
    if (!entry || typeof area?.lat !== "number" || typeof area?.lng !== "number") return;
    entry.el.classList.add("is-active");
    entry.popup.setLngLat([area.lng, area.lat]).addTo(map);
    // essential: false → skipped (instant jump) when the visitor prefers reduced motion.
    map.flyTo({ center: [area.lng, area.lat], zoom: Math.max(map.getZoom(), FOCUS_ZOOM), essential: false });
  }, [active, areas, status]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        // MapLibre's CSS forces position: relative on this element, so size it explicitly.
        className="h-full w-full"
        role="region"
        aria-label={`Interactive map of ${pins.length ? "our service areas" : MAP_DEFAULT_VIEW.label}`}
      />

      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cream-2 text-sm text-muted">
          {status === "failed" ? (
            <a
              className="pointer-events-auto font-semibold text-copper underline underline-offset-4"
              href={`https://www.google.com/maps/search/${encodeURIComponent(MAP_DEFAULT_VIEW.label + ", " + BUSINESS.regionLong)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View {MAP_DEFAULT_VIEW.label} on Google Maps ↗
            </a>
          ) : (
            <span>Loading map…</span>
          )}
        </div>
      )}

      {status === "ready" && (
        <button
          type="button"
          onClick={() => {
            onSelect(null);
            resetView();
          }}
          className="absolute top-3 left-3 z-10 rounded-full border border-sand bg-cream/95 px-3.5 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm transition-colors hover:border-copper hover:text-copper"
        >
          {pins.length > 1 ? "Show all areas" : `Reset to ${MAP_DEFAULT_VIEW.label}`}
        </button>
      )}
    </div>
  );
}
