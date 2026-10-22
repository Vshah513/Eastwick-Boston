import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import { BUSINESS, BUSINESS_LOCATION } from "@/lib/business";
import { SERVICES } from "@/content/services";
import { AREAS } from "@/content/areas";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// SEO copy is generated from config so it only ever mentions services and
// areas that are actually listed on the site.
const serviceNames = SERVICES.filter((s) => !s.title.startsWith("TODO_")).map((s) => s.title);
const areaNames = AREAS.filter((a) => !a.name.startsWith("TODO_")).map((a) => a.name);
const serviceList = serviceNames.join(", ").toLowerCase();
const title = `${BUSINESS.name} | Window Cleaning & Pressure Washing in ${BUSINESS_LOCATION}`;
const description = `College-owned exterior cleaning in ${BUSINESS_LOCATION}${
  areaNames.length > 1 ? ` and nearby ${areaNames.slice(1, 5).join(", ")}` : ""
}: ${serviceList}. Fully insured, satisfaction guaranteed, free estimates.`;
const ogImage = { url: "/media/og/cover.jpg", width: 1200, height: 630, alt: `${BUSINESS.name} crew at work` };

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.website),
  title: { default: title, template: `%s | ${BUSINESS.name}` },
  description,
  keywords: serviceNames.flatMap((s) => [
    `${s.toLowerCase()} ${BUSINESS.city}`,
    `${s.toLowerCase()} ${BUSINESS.region}`,
  ]),
  authors: [{ name: BUSINESS.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: BUSINESS.name,
    title,
    description,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1c1917",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
