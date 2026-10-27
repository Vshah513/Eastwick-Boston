import type { MetadataRoute } from "next";
import { SITE_URL, PRIVACY_POLICY_PATH, TERMS_PATH } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}${PRIVACY_POLICY_PATH}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}${TERMS_PATH}`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
