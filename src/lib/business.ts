/**
 * Single source of truth for Eastwick Boston's public business details.
 *
 * These values must match the legal business information submitted in the
 * GoHighLevel A2P 10DLC registration. Update them here and every page, the
 * footer, the quote form disclosure, the JSON-LD, and the lead email stay
 * consistent.
 *
 * Anything still marked TODO_ is unconfirmed. Never replace a TODO with a
 * guess: phone numbers, cities, hours, etc. must come from the client.
 * In development, any remaining TODO_ values are logged to the console.
 */
export const BUSINESS = {
  name: "Eastwick External Services",
  /** Legal entity that operates the business, as registered for A2P 10DLC. */
  legalEntity: "Eastwick Boston LLC",
  // TODO_BOSTON_DOMAIN: placeholder must stay a valid URL so metadata, sitemap and robots build.
  website: "https://example.com",
  // TODO: confirm whether Boston leads go to this inbox or a separate one.
  email: "eastwickexternalservices@gmail.com",
  /** Sender address for lead emails. The domain must be verified in Resend. */
  emailFrom: "noreply@TODO_BOSTON_DOMAIN",
  phoneDisplay: "TODO_BOSTON_PHONE",
  /** E.164, e.g. +16175550123. Drives the tel: and sms: links. */
  phoneE164: "TODO_BOSTON_PHONE_E164",
  /** Primary business location. Also drives the map embed and SEO title. */
  city: "Boston",
  region: "MA",
  regionLong: "Massachusetts",
  serviceAreaPhrase: "Greater Boston",
  hours: "Mon–Sat, 7 AM – 6 PM",
  /** schema.org openingHoursSpecification, kept in sync with `hours`. */
  hoursSchema: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:00",
      closes: "18:00",
    },
  ] as { days: string[]; opens: string; closes: string }[],
  /** TODO: Boston Google Business Profile, if one exists. Falls back to the existing Eastwick profile. */
  googleReviewsUrl:
    "https://www.google.com/search?q=eastwick+external+services#lrd=0x4aabce71a76b6ee5:0x689c38b3508c78de,1",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/eastwickexternal/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/eastwickexternal/" },
    { label: "TikTok", href: "https://www.tiktok.com/@eastwickexternal" },
    { label: "YouTube", href: "https://www.youtube.com/@EastwickExternalServices" },
  ],
  /** Small "Also serving Raleigh, NC" link in the footer. Off until the client asks for it. */
  showRaleighLink: false,
  raleighUrl: "https://eastwickexternalservices.org",
} as const;

export type SocialLabel = (typeof BUSINESS.socials)[number]["label"];

/**
 * Absolute origin for metadata, the sitemap and link previews. Until the real
 * domain is set in `website`, falls back to the Vercel deployment URL so shared
 * links still get a working preview image.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const SITE_URL =
  BUSINESS.website !== "https://example.com"
    ? BUSINESS.website
    : vercelHost
      ? `https://${vercelHost}`
      : `http://localhost:${process.env.PORT || 3000}`;

export const BUSINESS_LOCATION = `${BUSINESS.city}, ${BUSINESS.region}`;
export const PHONE_HREF = `tel:${BUSINESS.phoneE164}`;
export const SMS_HREF = `sms:${BUSINESS.phoneE164}`;

export const PRIVACY_POLICY_PATH = "/privacy-policy/";
export const TERMS_PATH = "/terms-and-conditions/";

/** Shown as "Last updated" on the Privacy Policy and Terms and Conditions. TODO: set at launch. */
export const LEGAL_LAST_UPDATED = "TODO_LAUNCH_DATE";

/**
 * SMS consent wording for the two quote form checkboxes, copied verbatim from
 * the Raleigh site. Carriers require transactional and promotional consent to
 * be collected separately, so each has its own optional, unchecked box. The
 * lead email records the exact text of whichever boxes were checked so there
 * is proof of what was agreed to.
 *
 * TODO: confirm with the client's marketing contact whether the A2P
 * registration needs updating to cover the Boston domain and this wording.
 */
export const SMS_TRANSACTIONAL_CONSENT_STATEMENT =
  "I agree to receive transactional text messages from Eastwick External Services regarding my quote, appointments, scheduling, service updates, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.";

export const SMS_PROMOTIONAL_CONSENT_STATEMENT =
  "I agree to receive recurring promotional and marketing text messages from Eastwick External Services, including special offers and service promotions. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.";

/** True while any business detail is still a placeholder. */
export function hasPlaceholders(value: unknown = BUSINESS): boolean {
  return JSON.stringify(value).includes("TODO_") || BUSINESS.website === "https://example.com";
}

if (process.env.NODE_ENV === "development" && hasPlaceholders()) {
  const todos = Object.entries(BUSINESS)
    .filter(([, v]) => JSON.stringify(v).includes("TODO_"))
    .map(([k]) => k);
  console.warn(`[business.ts] Placeholder values still set: ${["website", ...todos].join(", ")}`);
}
