import type { MetadataRoute } from "next";
import { BUSINESS, PRIVACY_POLICY_PATH, TERMS_PATH } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BUSINESS.website}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BUSINESS.website}${PRIVACY_POLICY_PATH}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BUSINESS.website}${TERMS_PATH}`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
