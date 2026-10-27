import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import SocialIcon from "@/components/SocialIcon";
import {
  BUSINESS,
  BUSINESS_LOCATION,
  PHONE_HREF,
  PRIVACY_POLICY_PATH,
  TERMS_PATH,
} from "@/lib/business";
import { SERVICES } from "@/content/services";
import { HAS_REVIEWS } from "@/content/reviews";

// Absolute "/#section" hrefs so these work from the legal pages as well as the homepage.
const companyLinks = [
  { label: "Founders", href: "/#founders" },
  { label: "Before & After", href: "/#results" },
  ...(HAS_REVIEWS ? [{ label: "Reviews", href: "/#reviews" }] : []),
  { label: "Service Areas", href: "/#areas" },
  { label: "FAQ", href: "/#faq" },
];

const linkClass = "text-sm text-muted-dark transition-colors hover:text-white";
const headingClass = "mb-4 font-body text-xs font-semibold tracking-[0.18em] text-white/50 uppercase";

/**
 * Inverted slab with rounded top corners: closing CTA, link columns, legal bar,
 * and an oversized wordmark bleeding off the bottom edge.
 * `withActionBar` leaves room for the floating mobile action bar on the homepage;
 * `ground` is the colour showing behind the rounded corners.
 */
export default function SiteFooter({
  withActionBar = false,
  ground = "paper",
}: {
  withActionBar?: boolean;
  ground?: "paper" | "ink";
}) {
  return (
    <footer className={ground === "ink" ? "bg-ink" : "bg-paper"}>
      <div
        className={`relative overflow-hidden rounded-t-[32px] bg-ink-3 text-white lg:rounded-t-[40px] ${
          withActionBar ? "max-md:pb-[calc(5rem+env(safe-area-inset-bottom))]" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          {/* Closing CTA */}
          <div className="flex flex-col gap-8 border-b border-white/10 pb-12 sm:pb-16 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-2xl font-heading text-[2rem] leading-[1.05] font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Ready for windows you can <span className="text-accent-light">actually see through?</span>
            </p>
            <Link
              href="/#quote"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-7 py-4 text-base font-semibold text-ink transition-colors hover:bg-fog lg:self-auto"
            >
              Get a free quote <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 py-12 sm:py-16 lg:grid-cols-12">
            <div className="col-span-2 lg:col-span-4">
              <BrandLogo tone="dark" sizeClassName="h-10 w-auto max-w-[220px]" />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-dark">
                College-owned exterior cleaning in {BUSINESS_LOCATION} and the western suburbs. Your best is our standard.
              </p>
              <div className="mt-6 flex gap-2.5">
                {BUSINESS.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${BUSINESS.name} on ${s.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
                  >
                    <SocialIcon label={s.label} />
                  </a>
                ))}
              </div>
              {BUSINESS.showRaleighLink && (
                <a href={BUSINESS.raleighUrl} className={`mt-5 inline-block ${linkClass}`}>
                  Also serving Raleigh, NC ↗
                </a>
              )}
            </div>
            <nav aria-label="Services" className="lg:col-span-2 lg:col-start-6">
              <h2 className={headingClass}>Services</h2>
              <ul className="space-y-3">
                {SERVICES.map((s) => (
                  <li key={s.id}>
                    <Link href="/#services" className={linkClass}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Company" className="lg:col-span-2">
              <h2 className={headingClass}>Company</h2>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="col-span-2 sm:col-span-1 lg:col-span-3">
              <h2 className={headingClass}>Contact</h2>
              <ul className="space-y-3 text-sm text-muted-dark">
                <li>
                  <a href={PHONE_HREF} className={linkClass}>
                    {BUSINESS.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${BUSINESS.email}`} className={`break-all ${linkClass}`}>
                    {BUSINESS.email}
                  </a>
                </li>
                <li>{BUSINESS_LOCATION}</li>
                <li>{BUSINESS.hours}</li>
              </ul>
            </div>
          </div>

          {/* Legal bar */}
          <div className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 text-xs text-white/45">
              <p>
                &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
              </p>
              <p>
                {BUSINESS.name} is operated by {BUSINESS.legalEntity}.
              </p>
            </div>
            <div className="flex gap-6 text-xs text-white/45">
              <Link href={PRIVACY_POLICY_PATH} className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href={TERMS_PATH} className="transition-colors hover:text-white">
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Oversized wordmark bleeding off the bottom */}
        <p
          className="pointer-events-none -mb-[0.24em] text-center font-heading text-[17vw] leading-none font-extrabold tracking-[-0.07em] whitespace-nowrap text-white/[0.05] select-none"
          aria-hidden
        >
          EASTWICK
        </p>
      </div>
    </footer>
  );
}
