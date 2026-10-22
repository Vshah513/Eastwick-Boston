import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
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
  { label: "Our Story & Team", href: "/#team" },
  { label: "Before & After", href: "/#transformations" },
  ...(HAS_REVIEWS ? [{ label: "Reviews", href: "/#reviews" }] : []),
  { label: "Service Areas", href: "/#areas" },
  { label: "Contact", href: "/#contact" },
];

const linkClass = "text-sm text-muted-dark transition-colors hover:text-copper-light";

/** `withActionBar` leaves room for the sticky mobile action bar on the homepage. */
export default function SiteFooter({ withActionBar = false }: { withActionBar?: boolean }) {
  return (
    <footer
      className={`bg-ink-3 text-white ${withActionBar ? "max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom))]" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo tone="dark" sizeClassName="h-10 w-auto max-w-[220px]" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-dark">
              College-owned exterior cleaning in {BUSINESS_LOCATION}. Crystal clear results, every time.
            </p>
            {BUSINESS.showRaleighLink && (
              <a href={BUSINESS.raleighUrl} className={`mt-3 inline-block ${linkClass}`}>
                Also serving Raleigh, NC ↗
              </a>
            )}
          </div>
          <nav aria-label="Services">
            <h2 className="mb-4 font-body text-sm font-semibold">Services</h2>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href="/#services" className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="mb-4 font-body text-sm font-semibold">Company</h2>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 font-body text-sm font-semibold">Contact</h2>
            <ul className="space-y-2.5 text-sm text-muted-dark">
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="space-y-1 text-center text-xs text-stone-400 sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
            </p>
            <p>
              {BUSINESS.name} is operated by {BUSINESS.legalEntity}.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-stone-400">
            <Link href={PRIVACY_POLICY_PATH} className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href={TERMS_PATH} className="transition-colors hover:text-white">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
