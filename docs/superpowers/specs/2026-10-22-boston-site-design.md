# Eastwick Boston Website — Design & Build Plan

## Context

Henry Shelton (Eastwick External Services) runs Meta ads in Boston. Prospects who ask for a website get the Raleigh site (eastwickexternalservices.org) and get confused. He wants a **separate, simple, minimal site on its own domain** for the Boston location. It should look premium, build local credibility on Google and generate quote requests. Fixed price ($650), launch-ready in about 10 business days once we have the domain and media.

The site has the same company, logo and features as Raleigh, but must **not** read as a recolored copy. **Henry's biggest fear: footage that feels small.** His new professional clips (a mix of vertical and horizontal) are the main way the site sells.

Build from the Raleigh codebase at `/Users/virajshah/Henry trial/eastwick` (Next 16.2.3, React 19.2.4, Tailwind 4, framer-motion 12, Resend 6). The new repo is this folder (`origin` = github.com/Vshah513/Eastwick-Boston, `main`). The app lives at the **repo root**, so Vercel needs no Root Directory setting and no vercel.json. Per `.cursor/rules/git-commit-push.mdc`, commit and push to `origin main` after each phase.

Mobile and desktop are built together. Each component is designed phone-first, with desktop layouts in the same pass.

## Decisions made with the user

- **Look: "New England Classic."** Warm cream, charcoal and copper, with serif headlines.
- **Services: "Stacked reels."** On phones, one big clip card per service stacked vertically, each autoplaying in view. On desktop, a pinned video on the left that swaps as you scroll the service list on the right.
- **Hero wipe:** the dirty-window overlay sits **on the hero video** and the squeegee wipes it **once on load**. The footage then stays clean.
- **Clips are mixed orientation.** Every media item gets per-item `orientation` + `focal` (object-position) config and crops into fixed frames.
- Media and real copy come later. Use clearly labeled placeholders wired to config.
- **SMS consent: two optional, unchecked boxes placed directly above Submit**, matching the current A2P-reviewed Raleigh form (`QuoteForm.tsx` lines 249–286). This overrides the spec's "under Phone".
- **Reviews: use the 10 existing Google reviews** (no dates), linking to the existing Google profile until Boston has its own.
- The stats (1000+ / 100% / College Owned) are company-wide and confirmed by the spec.

## Calls I made (for the user to check)

- **Mixed-orientation media:** each `MediaItem` has a `fit`: `"cover"` (default when the clip orientation matches the frame) or `"contain-blur"` (the clip is shown whole over a blurred, scaled copy of itself). Wide clips in 4:5 phone cards and tall clips in the desktop frame use contain-blur, so nothing gets heavily cropped and footage stays big.
- **Desktop sticky frame:** 4:5 at ~80vh tall, roughly the left 55% of the width. Portrait clips fill it and landscape clips use contain-blur. Album thumbs show on desktop too, under the frame.
- **Hero:** config accepts an optional `mobile` and `desktop` media item (portrait for phones, landscape for desktop). If only one exists, it is used for both with `cover` + focal.
- Placeholder inbox = the Raleigh Gmail. Placeholder `website` = `https://example.com` (a valid URL so metadata/sitemap don't throw). The dev check flags it.
- Pin `next@16.2.x` (same major/minor as Raleigh) rather than an unknown "latest".

## Design system

**Palette** (`:root` vars → `@theme inline`, same mechanism as Raleigh `globals.css`):

| Token | Hex | Use |
|---|---|---|
| cream | `#FAF7F2` | main light background |
| cream-2 | `#F3EEE6` | alternate light section |
| sand | `#E7DFD3` | borders, placeholder tiles |
| ink | `#1C1917` | text, dark sections |
| ink-2 | `#292524` | cards on dark |
| ink-3 | `#0F0D0C` | footer |
| muted | `#57534E` | secondary text on cream (~7:1) |
| muted-dark | `#A8A29E` | secondary text on ink |
| copper | `#C2410C` | **the only CTA color**, white text (~5.2:1) |
| copper-hover | `#9A3412` | CTA hover |
| copper-light | `#EA7A45` | italic accent words on dark sections |

The headline accent is the second phrase set in **Fraunces italic in copper**, replacing Raleigh's cyan→green gradient text. Focus ring: 2px copper outline with an offset.

**Fonts** (`next/font/google`): **Fraunces** (variable, italic) for headings and **Inter** for body. Same `--font-heading` / `--font-body` variable names as Raleigh.

**Feel:** generous whitespace, rounded-2xl/3xl cards, alternating cream/ink sections, subtle ScrollReveal fades. No glassmorphism. `<MotionConfig reducedMotion="user">` and a CSS `prefers-reduced-motion` block. Raleigh respects neither today. Do **not** copy Raleigh's unused keyframes, the `.glass` classes, or the broken `bg-gradient-radial` classes (not valid in Tailwind v4).

## Page structure (single landing page)

| # | Section | Layout (mobile → desktop) | How it differs from Raleigh |
|---|---|---|---|
| 1 | Navbar | Transparent over the hero with the dark-bg logo. After 50px it becomes cream + blur with the light-bg logo (crossfade). Mobile menu is a **full-screen cream sheet with large serif links**, always showing the light-background logo. Any body scroll lock is released *before* the two-rAF scroll fix runs. Links: Services, Transformations, Reviews, Team, Areas, Contact + copper "Get a Quote". | Raleigh uses a white bar and a dropdown menu |
| 2 | Hero | **Phone: full-bleed video, `100svh`.** The dirty overlay + squeegee sit over the video and wipe once. A bottom ink fade holds a small `TODO_CITY, MA` eyebrow, an H1 `TODO_HEADLINE` (serif, copper italic phrase), copper "Get Your Free Quote" + ghost "See the work". Two small chips: ★ 5.0 rating and "Fully Insured" (`// TODO licensed & bonded if confirmed`). A **thin cream stats band directly under the video**: 1000+ Properties · 100% Satisfaction · College Owned. **Desktop:** the same full-width video at ~88vh with content bottom-left. The supporting line is removed. | Raleigh has the video in a small side card and the effect behind the text |
| 3 | Services ("Watch the *Magic Happen*") | Ink section. **Phone:** stacked 4:5 clip cards (~80vh max). Each card overlays a number, title, one line and a copper "Quote this →". **Desktop:** a sticky video frame on the left and a scrolling list of 5 services on the right. The active item (IntersectionObserver) swaps the video. Albums of 1–3 items: the first plays, and extra items show as small tap-to-swap thumbs. Fallback chain: clip → photo → labeled placeholder. | Replaces Raleigh's photo cards and the separate "See Us in Action" grid |
| 4 | Transformations | Cream. **Phone:** full-width before/after sliders stacked, 4:5. **Desktop:** one large featured slider plus two below in a 2-col layout. The optional gallery renders only if the config array is non-empty. No AI/stock tiles. | Raleigh uses a 3-across grid plus a 4-tile gallery |
| 5 | Google Reviews | Cream-2. A header with a large serif "5.0" + stars + "{count}+ reviews on Google" from config. Marquee of quote-style cards (serif opening quote mark, no dates). Pauses on hover/touch. With reduced motion it becomes a plain horizontal scroll strip. | Raleigh has hardcoded "3 weeks ago" and the count in two places |
| 6 | Team & Story | Ink. An editorial story block (large serif lead sentence + 2 short paragraphs + 4 inline trust ticks: College Owned, Fully Insured, Satisfaction Guaranteed, Free Estimates). Then headshot cards: 2-col on phone, 4–5 col on desktop, with an accessible "Read bio" toggle. An optional team photo slot. | Raleigh has separate About + Team sections and the "Four co-founders" copy |
| 7 | Service Areas | Cream. The city grid the client likes (HQ chip in copper), "Don't see your area?…" line, and a lazy-loaded Google Maps iframe centered on `BUSINESS.city`. Same structure, new styling. | Same structure, by request |
| 8 | Get Your Free Quote | Ink. **Phone:** a short pitch + 3 promises (No Obligation · Fast Response within 24 hours · Transparent Pricing) above a cream form card. **Desktop:** pitch left, form right. | — |
| 9 | Contact | Cream. **Compact list rows** (icon · label · value), not big cards: Call (tel:), Text (sms:), Email, Location, Hours. Then 4 social buttons. | Raleigh uses 4 big dark cards |
| 10 | Footer | ink-3. Logo, blurb, Services column (generated from config), Company column, Contact column, legal links. Links use `/#section`. `BUSINESS.showRaleighLink` flag (default **false**) controls an "Also serving Raleigh, NC" link. | — |
| 11 | Sticky mobile bar | `md:hidden`. Appears after the hero leaves view and hides while `#quote` is in view (IntersectionObserver). Three equal buttons: Call · Text · **Get a Quote** (copper). `padding-bottom: env(safe-area-inset-bottom)`. The body gets bottom padding so the footer isn't covered. | New |

Legal pages `/privacy-policy/` and `/terms-and-conditions/` reuse the `LegalPage` shell, restyled to the cream/ink theme.

## Files

**Repo root layout** (new):
```
src/app/            layout.tsx, page.tsx, globals.css, icon.png, apple-icon.png,
                    sitemap.ts, robots.ts, api/contact/route.ts,
                    privacy-policy/page.tsx, terms-and-conditions/page.tsx
src/components/     (below)
src/lib/            business.ts, validate.ts, rate-limit.ts, jsonld.ts
src/content/        services.ts, transformations.ts, reviews.ts, team.ts,
                    stats.ts, areas.ts, story.ts, types.ts
public/media/       hero/ services/ transformations/ team/ areas/ brand/ og/
scripts/            optimize-media.sh
README.md, AGENTS.md (copied), CLAUDE.md (@AGENTS.md), .env.example
```

**Reused from Raleigh with light adaptation** (copy, then restyle tokens and move hardcoded content into props/config):
- `ScrollReveal.tsx`: unchanged except it respects reduced motion.
- `BrandLogo.tsx`: alt text from `BUSINESS.name`, paths under `/media/brand/`.
- `LegalPage.tsx`: restyle only; it already reads `BUSINESS`.
- `BeforeAfterSlider.tsx`: keep the pointer logic (mouse click-to-jump, touch must grab the handle). **Add** `role="slider"`, `aria-valuenow`, arrow/Home/End keys and an `aspect` prop.
- `TestimonialsSection.tsx`: keep the rAF marquee + hover/touch pause. Remove `timeAgo`, take `googleReviewsUrl` / rating / count from `content/reviews.ts`, and fall back to a plain scroll strip under reduced motion.
- `MeetTheTeamSection.tsx`: keep the grid-rows bio expand, add `aria-expanded` / `aria-controls`, and remove the hardcoded blurb (the story comes from `content/story.ts`).
- `Navbar.tsx`: **keep the mobile-menu scroll fix exactly** (preventDefault → close → two rAFs → `scrollIntoView` + `history.replaceState`). Links come from a config array. New full-screen sheet styling.
- `SiteFooter.tsx`: services column from `content/services.ts`, plus the Raleigh-link flag.
- `QuoteForm.tsx`: same fields (keep Raleigh's payload key `property`), states, and two consent flags in Raleigh's position. It sends service **ids**, which the server maps back to titles for the email. Services come from config. Add a honeypot input (odd name, e.g. `fax_number`, `autoComplete="off"`, `tabIndex={-1}`, `aria-hidden`, visually hidden) and **pre-selection**: it listens for a `eastwick:select-service` CustomEvent (fired by "Quote this") and also reads `?service=` on mount.
- `api/contact/route.ts`: keep `escapeHtml`, the `row()` helper, the consent record table and the NY timestamp. Changes are listed under Lead flow.
- `sitemap.ts`, `robots.ts`: base URL from `BUSINESS.website`.

**Heavily adapted:**
- `HeroSection.tsx` (555 lines). Keep `WindowCleaningEffect`'s dirty-layer gradients, the `clipPath: inset(p% 0 0 0)` reveal and the squeegee divs. **Drop** the opaque clean-glass layer (it would hide the video) and the shine layer that relies on `bg-gradient-radial`. Replace the live feTurbulence grain with a small pre-rendered noise PNG (avoids iOS jank while the clip animates). Place it **absolutely over the video** instead of behind the content.
  - The driver **runs once**: start on the video's `playing` event **or after a 2.5s timeout** (iOS Low Power Mode blocks autoplay, so it wipes over the poster), wipe 3s, then unmount the layers.
  - Under `useReducedMotion()` (explicit check, since MotionConfig doesn't cover manual `animate()`) it starts clean.
  - New layout as described above.
- `ShowcaseReelVideo.tsx` becomes **`AutoVideo.tsx`**: muted, playsInline, loop, poster. It plays when ≥50% visible and pauses off-screen (IntersectionObserver). `preload="none"` except the first. Props: `src, poster, focal, orientation, active?`. Drop the canvas auto-poster code (posters come from the script instead).

**New:**
- `ServiceReels.tsx`: the stacked/sticky services section.
  - Desktop keeps one stacked `<video>` per service and crossfades opacity, with only the active one playing. This avoids the blank flash from swapping `src`.
  - No ancestor uses `overflow:hidden`; use `overflow-x: clip` so sticky works.
  - Under reduced motion it shows the poster + a play button instead of autoplaying.
- `MediaFrame.tsx`: renders `video | image | placeholder` for a `MediaItem` into a fixed-aspect frame with `object-cover` + focal.
- `MediaPlaceholder.tsx`: a sand-colored tile labeled e.g. "CLIP — Window cleaning (4:5)".
- `StickyActionBar.tsx`, `ContactList.tsx`, `ServiceAreas.tsx`, `TeamStory.tsx`, `QuoteSection.tsx`.

**Not copied:** `ShowcaseVideoGrid.tsx`, all `public/uploads/*` media except the two logos, Raleigh's README, `.claude/`, the zip, `eastwick 2/`, `out/`.

### Config shapes (`src/content/types.ts`)
```ts
type MediaItem =
  | { kind: "video"; src: string; poster: string; orientation: "portrait" | "landscape"; focal?: string; alt: string }
  | { kind: "image"; src: string; orientation: "portrait" | "landscape"; focal?: string; alt: string }
  | { kind: "placeholder"; label: string };
type Service = { id: string; title: string; blurb: string; media: MediaItem[] }; // 1–3 items
type Transformation = { id: string; title: string; description: string; before: MediaItem; after: MediaItem };
type Review = { name: string; rating: 5 | 4 | 3 | 2 | 1; text: string; date?: string };
type TeamMember = { name: string; title: string; bio: string; headshot?: string };
type Area = { name: string; hq?: boolean };
```
Services: `window-cleaning`, `pressure-washing`, `house-wash` (Raleigh copy rewritten fresh for Boston), plus `TODO_SERVICE_4` and `TODO_SERVICE_5`. `content/services.ts` exports a filter so TODO services can be hidden with a flag until named. Reviews: the 10 existing Google reviews (confirmed by the user), with no dates. If the array is ever emptied, the section, the nav link and the hero rating chip all hide together. Team: Raleigh's five with the "rising junior" / "this summer" / "age 20" phrases removed, pending confirmation.

### `src/lib/business.ts`
The same shape as Raleigh's plus `regionLong`, `hoursSchema` (for JSON-LD), `mapQuery`, `googleReviewsUrl`, `socials`, `serviceAreaPhrase`, `showRaleighLink`, `raleighUrl` and `emailFrom`. Placeholders are literal `"TODO_…"` strings. Keep `legalEntity: "Eastwick Boston LLC"`. Keep **both** `SMS_TRANSACTIONAL_CONSENT_STATEMENT` and `SMS_PROMOTIONAL_CONSENT_STATEMENT` verbatim from Raleigh (latest A2P fix, commit 4161584). Add a `// TODO: confirm with marketing contact whether A2P registration covers the Boston domain`. Add a dev-only check that logs any remaining `TODO_` values.

## Lead flow (preserve exactly, plus hardening)

- Form fields, required/optional rules and states stay as in Raleigh. The **two SMS checkboxes are optional, unchecked, directly above Submit** (Raleigh's placement), with Privacy/Terms links.
- `route.ts`:
  - From: `Eastwick Boston Website <${BUSINESS.emailFrom}>`. To: `BUSINESS.email`. Reply-To: the customer.
  - Subject: `New BOSTON Quote Request from {name}`.
  - The details table adds a `Source: Boston website` row. The consent table is unchanged (green Yes / red "No — do not text").
  - Email colors use copper instead of `#0891b2`.
  - Create the Resend client **inside `POST`** (Raleigh's `route.ts` line 9 creates it when the module loads). A missing key returns a 500 JSON error instead of breaking the build.
  - **Hardening:**
    - Reject `content-length` > 10 KB **and** re-check the length after `request.text()` (the header can be missing) → 413.
    - `validate.ts` checks the required fields, lengths, an email regex, 10–15 phone digits, `property` in the enum, and services ⊆ **all** config ids (hidden TODO services included) → 400 `{error, fields}`.
    - Honeypot filled → 200 `{ok:true}` silently without sending.
    - `rate-limit.ts`: in-memory Map keyed by the **first** `x-forwarded-for` value. **10 accepted submissions / 10 min** per IP (looser to allow for carrier NAT); validation failures don't count. → 429. A comment notes it is per-instance on Vercel (not a guarantee) and that Vercel Firewall / Upstash is the upgrade path.

## SEO

- `layout.tsx` metadata: `metadataBase` from `BUSINESS.website`. Title "Eastwick External Services | Window Cleaning & Pressure Washing in TODO_CITY, MA", with template "%s | Eastwick External Services".
- The description and keywords are **generated from the services config + Boston areas**, so nothing unlisted (no gutters/solar/post-construction) appears.
- OG/Twitter large image from `/media/og/cover.jpg` (placeholder).
- `lib/jsonld.ts` (skipped while any `TODO_` value remains) builds the `LocalBusiness` JSON-LD from `business.ts` + services + areas (`hasOfferCatalog` services, `openingHoursSpecification`, `sameAs`).
- Canonical URLs on the legal pages. Favicon and apple icon copied from Raleigh.

## Media pipeline

`scripts/optimize-media.sh` (`npm run optimize-media`; ffmpeg is installed at /opt/homebrew/bin) works on `media-src/` (gitignored) → `public/media/…`:
- H.264 `-crf 26 -preset slow`, long edge ≤1080 (hero ≤1920), `-an`, `-movflags +faststart`, with a target of ≤4 MB per 10s clip. If over 4 MB, it re-encodes at CRF 28.
- A poster JPG at 1s (`-q:v 3`).
- Lowercase, hyphenated filenames.

Images go through `next/image` with explicit `sizes` and the default quality 75 (Next 16 only allows values listed in `images.qualities`). The hero poster gets `priority`. Fixed-aspect frames prevent layout shift.

## Build order (commit + push after each)

1. **Scaffold.**
   - Read `node_modules/next/dist/docs/` (app router, fonts, images, metadata, route handlers) per AGENTS.md.
   - Run `create-next-app` (TS, Tailwind, App Router, src/) in the scratchpad (the repo root isn't empty because of `.cursor/`), copy it into the root, pin `next@16.2.x`, then add framer-motion, resend and sharp.
   - Get `npm audit` to 0 critical/high.
   - Set `trailingSlash: true`.
   - Copy AGENTS.md/CLAUDE.md and add `.env.example`.
   - Write `business.ts` and `src/content/*` with placeholders.
   - Save this plan as `docs/superpowers/specs/2026-10-22-boston-site-design.md` and commit it.
2. **Foundation + hero.** globals.css tokens, fonts, MotionConfig, Navbar, HeroSection (wipe-once-over-video), stats band, BrandLogo, MediaFrame/Placeholder.
3. **Services reels.** AutoVideo, ServiceReels (mobile stack + desktop sticky), the "Quote this" event.
4. **Mid sections.** Transformations, Testimonials, TeamStory, ServiceAreas.
5. **Lead flow.** QuoteSection/QuoteForm (pre-select, honeypot), route.ts hardening, validate/rate-limit, legal pages (grep the ported text for hardcoded "NC"/"Raleigh"/"Triangle").
6. **Polish.** SEO/JSON-LD, sitemap/robots, ContactList, Footer, StickyActionBar, optimize-media script, README.
7. **QA + launch checklist** (below).

## Verification

- `npm run build` + `npm run lint` are clean. `npm audit` has no critical/high.
- `npm run dev -- -p 3005`. Use Chrome DevTools at 375 / 390 / 768 / 1280 / 1440 widths and check for no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`), no console errors and no CLS from media.
- Hero: the wipe plays once and does not replay. With reduced motion (DevTools emulation) it starts clean, the marquee becomes a scroll strip and reels don't autoplay.
- Reels: only the in-view clip plays. Desktop sticky swap works. "Quote this" scrolls to the form with that service pre-selected.
- Slider: drag (mouse), click-jump (mouse only), handle-only drag (touch emulation), arrow keys.
- Sticky bar: appears after the hero, hides at #quote, respects the safe area (iOS simulator or real phone).
- API with `RESEND_API_KEY` in `.env.local`: curl a valid payload (200 + email arrives with BOSTON subject, Source row and consent table); missing fields (400); a filled honeypot (200, no email); 11 rapid valid posts locally (429; not guaranteed in production); an 11 KB body (413); no API key (500 JSON, the build still passes). Submit through the UI with both consent boxes checked, then with none checked, and check the green/red records.
- Lighthouse mobile (incognito, production build `npm start`): Perf ≥85, A11y ≥95, SEO 100, BP ≥95.
- Validate the JSON-LD in Google's Rich Results Test after deploy.

## Launch checklist (every placeholder)

- [ ] `TODO_BOSTON_DOMAIN` (bought on IONOS). DNS A/CNAME to Vercel, domain added to the Vercel project (Ivy Devs team).
- [ ] Domain verified in Resend (SPF/DKIM on IONOS). `emailFrom` = `noreply@<domain>`. `RESEND_API_KEY` set in Vercel Production + Preview.
- [ ] `email` (which inbox gets Boston leads)
- [ ] `TODO_BOSTON_PHONE` (display, tel:, sms:, E.164)
- [ ] `TODO_CITY` / HQ city, `serviceAreaPhrase`, `mapQuery`
- [ ] Hours (+ `hoursSchema`)
- [ ] Service area city list (+ HQ flag)
- [ ] `TODO_HEADLINE` (from Henry)
- [ ] `TODO_SERVICE_4`, `TODO_SERVICE_5` (title + blurb + media)
- [ ] Media: hero clip + poster, one clip/photo per service, real before/after pairs, team headshots, OG cover
- [ ] `googleReviewsUrl` (Boston GBP or Raleigh fallback), review list + count
- [ ] Team list + bios confirmed for Boston
- [ ] "Licensed & bonded" confirmed or left off
- [ ] A2P: marketing contact confirms the registration covers the new domain/consent wording
- [ ] `LEGAL_LAST_UPDATED` set to the launch date
- [ ] `showRaleighLink` decision
- [ ] Dev TODO-check prints nothing. Test submissions in both consent states on production.
