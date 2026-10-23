# Eastwick External Services — Boston

The website for Eastwick External Services' Boston location: a single landing page plus a Privacy Policy and Terms and Conditions page. It exists to show off the crew's work and turn visitors (mostly from Meta ads, on phones) into quote requests.

It is a separate site from the Raleigh one (eastwickexternalservices.org): same company and logo, different design, domain and copy.

Built and maintained by Ivy Devs.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4 (configured in `src/app/globals.css`, no `tailwind.config`), Framer Motion, and Resend for the lead email. No database, CMS, auth or analytics. Hosted on Vercel.

> Next 16 has breaking changes from older versions. Read the guides in `node_modules/next/dist/docs/` before changing Next-specific code (see `AGENTS.md`).

## Run it locally

```bash
npm install
npm run dev -- -p 3005        # any free port
```

Open http://localhost:3005. Quote submissions need `RESEND_API_KEY` in `.env.local` (copy `.env.example`). Without it, the form shows a friendly error.

Other commands: `npm run build`, `npm run start`, `npm run lint`, `npm run optimize-media`.

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `RESEND_API_KEY` | Vercel (Production + Preview), `.env.local` | The sending domain in `BUSINESS.emailFrom` must be verified in Resend. |

## Where to edit content

Almost every change is a one-line edit in one of these files.

| What | File |
|---|---|
| Business name, phone, email, city, hours, socials, Google reviews link, SMS consent wording, legal "last updated" date | `src/lib/business.ts` |
| Hero headline, hero video, "Fully Insured" badge | `src/content/hero.ts` |
| Services (title, one-liner, clips/photos) | `src/content/services.ts` |
| Before/after sliders and optional gallery | `src/content/transformations.ts` |
| Google reviews, rating, review count | `src/content/reviews.ts` |
| Company story | `src/content/story.ts` |
| Team members and bios | `src/content/team.ts` |
| Stats under the hero | `src/content/stats.ts` |
| Service area cities (mark the HQ with `hq: true`) | `src/content/areas.ts` |
| Colors and fonts | `src/app/globals.css`, `src/app/layout.tsx` |

The footer, quote form, SEO description, keywords and JSON-LD are all generated from these files, so they stay in sync automatically.

Anything still set to `TODO_…` is a placeholder. In development the console lists which business details are still placeholders. The JSON-LD block is not output until none remain.

### Adding photos and video

1. Drag the raw files into the labelled folder in `public/uploads/` (gitignored, so originals never ship):

| Folder | What goes there |
|---|---|
| `hero/desktop-landscape`, `hero/phone-portrait` | Top-of-page video (one wide, one vertical; the same clip in both is fine) |
| `services/<service-id>` | 1–3 clips or photos per service (`window-cleaning`, `pressure-washing`, `house-wash`, `service-4`, `service-5`) |
| `transformations/<job>/before`, `.../after` | One photo each for the before/after sliders (`windows`, `driveway`, `siding`) |
| `transformations/extra-job-photos` | Optional gallery under the sliders |
| `team/<first-last>` | One square headshot per person |
| `team/group-photo` | Optional wide crew photo for the story section |
| `og` | Link-preview image, 1200×630 |

2. Run `npm run optimize-media` (needs `ffmpeg`). Videos become H.264 MP4s (no audio, ≤4 MB target) with a poster JPG. Photos are resized. Output lands in `public/media/<folder>/`, named after the slot, e.g. `public/uploads/transformations/driveway/before/IMG 4821.JPG` becomes `/media/transformations/driveway-before-img-4821.jpg`.
3. Reference the output in the matching `src/content/*.ts` file, e.g.

```ts
{ kind: "video", src: "/media/services/window-cleaning.mp4", poster: "/media/services/window-cleaning.jpg",
  orientation: "portrait", alt: "Technician squeegeeing a bay window" }
```

`orientation` is printed by the script. Vertical and horizontal clips both work: a clip whose shape doesn't match its frame is shown whole over a blurred copy of itself. Set `fit: "cover"` to crop instead, and `focal: "50% 30%"` to choose what stays in view.

## The quote form and lead email

- The form posts to `/api/contact/`. The route validates every field on the server, ignores bots that fill a hidden honeypot field, rate-limits to 10 accepted submissions per IP per 10 minutes (in memory, so per server instance), and rejects bodies over 10 KB.
- Leads are emailed via Resend to `BUSINESS.email` with the subject **"New BOSTON Quote Request from {name}"**, Reply-To set to the customer, a "Source: Boston website" row, and an **SMS Consent Record** table.
- `?service=<id>` on the URL (e.g. `/?service=house-wash` from an ad) pre-selects that service, as do the "Quote this" buttons.

## A2P 10DLC rules — do not break these

Business texting is registered through GoHighLevel (A2P 10DLC). Carriers reject or suspend the number if the opt-in doesn't match the registration.

- The two SMS consent checkboxes (transactional and promotional) must stay **optional**, **unchecked by default**, and **separate**, directly above the submit button, with the Privacy Policy and Terms links next to them.
- Never change the consent wording, business name, phone, or email except in `src/lib/business.ts`, and only after checking with the client's marketing contact that it matches the A2P registration.
- The lead email's consent record is the proof of opt-in. Never text a lead whose email says "No".
- The Privacy Policy and Terms pages (including the SMS program terms) must stay public.

## Deploying

The app lives at the repo root, so Vercel needs no Root Directory setting and there is no `vercel.json`. Pushing to `main` deploys. Before launch, work through the checklist in `docs/superpowers/specs/2026-10-22-boston-site-design.md`.
