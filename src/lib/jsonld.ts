import { BUSINESS, SITE_URL, hasPlaceholders } from "@/lib/business";
import { SERVICES } from "@/content/services";
import { AREAS } from "@/content/areas";

/**
 * schema.org LocalBusiness built from business.ts and the content config.
 * Returns null while placeholder values remain, so Google never indexes TODOs.
 */
export function localBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS.name,
    description: `College-owned exterior cleaning in ${BUSINESS.city}, ${BUSINESS.region}: ${SERVICES.map((s) => s.title).join(", ")}.`,
    url: SITE_URL,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    image: `${SITE_URL}/opengraph-image`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: "US",
    },
    areaServed: AREAS.map((a) => ({ "@type": "City", name: `${a.name}, ${BUSINESS.region}` })),
    openingHoursSpecification: BUSINESS.hoursSchema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: BUSINESS.socials.map((s) => s.href),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Exterior cleaning services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.blurb },
      })),
    },
  };
  return hasPlaceholders(data) ? null : data;
}
