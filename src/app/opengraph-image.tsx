import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO } from "@/content/hero";
import { OVERALL_RATING, REVIEW_COUNT } from "@/content/reviews";
import { BUSINESS } from "@/lib/business";

/**
 * The card shown when the site link is shared (iMessage, WhatsApp, Slack, socials).
 * Built at build time from the hero motto, the review count and the house-wash still.
 */
export const alt = `${BUSINESS.name}: ${HERO.headline.plain} ${HERO.headline.accent} Window cleaning & pressure washing in ${BUSINESS.serviceAreaPhrase}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b1b33";
const ACCENT_LIGHT = "#7fb2ff";

const dataUrl = (file: Buffer, mime: string) => `data:${mime};base64,${file.toString("base64")}`;

function Star() {
  return (
    <svg width="26" height="26" viewBox="0 0 20 20" fill="#fbbf24">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default async function Image() {
  // Literal paths so the build traces only these four files.
  const [photoFile, logoFile, semibold, extrabold] = await Promise.all([
    readFile(join(process.cwd(), "public/media/services/house-wash.jpg")),
    readFile(join(process.cwd(), "public/media/brand/logo-for-dark.png")),
    readFile(join(process.cwd(), "src/app/_og/manrope-600.woff")),
    readFile(join(process.cwd(), "src/app/_og/manrope-800.woff")),
  ]);
  const photo = dataUrl(photoFile, "image/jpeg");
  const logo = dataUrl(logoFile, "image/png");

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: INK, fontFamily: "Manrope" }}>
        <img
          src={photo}
          alt=""
          width={1120}
          height={630}
          style={{ position: "absolute", top: 0, right: 0, width: 1120, height: 630, objectFit: "cover", objectPosition: "70% 50%" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: `linear-gradient(90deg, ${INK} 0%, ${INK} 38%, rgba(11,27,51,0.82) 56%, rgba(11,27,51,0.15) 82%, rgba(11,27,51,0) 100%)`,
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", width: "100%" }}>
          <img src={logo} alt="" width={184} height={52} style={{ width: 184, height: 52 }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 600, letterSpacing: 4, color: ACCENT_LIGHT, textTransform: "uppercase" }}>
              Window cleaning · Pressure washing · {BUSINESS.serviceAreaPhrase}
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 18, fontSize: 104, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4.5, color: "white" }}>
              <span>{HERO.headline.plain}</span>
              <span style={{ color: ACCENT_LIGHT }}>{HERO.headline.accent}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 32px",
                borderRadius: 999,
                background: "white",
                color: INK,
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Get your free quote →
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                {OVERALL_RATING.toFixed(1)} · {REVIEW_COUNT}+ Google reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: semibold, weight: 600, style: "normal" },
        { name: "Manrope", data: extrabold, weight: 800, style: "normal" },
      ],
    }
  );
}
