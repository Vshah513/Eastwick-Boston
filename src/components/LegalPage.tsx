import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import SiteFooter from "@/components/SiteFooter";
import { BUSINESS, BUSINESS_LOCATION, LEGAL_LAST_UPDATED, PHONE_HREF } from "@/lib/business";

/** Shared shell for the Privacy Policy and Terms and Conditions pages. */
export default function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-sand bg-cream">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
          <Link href="/" className="shrink-0">
            <BrandLogo priority tone="light" sizeClassName="h-8 w-auto sm:h-9 max-w-[200px]" />
          </Link>
          <Link href="/" className="text-sm font-medium text-muted transition-colors hover:text-copper">
            &larr; Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-cream">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-4xl font-medium text-ink sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted">Last updated: {LEGAL_LAST_UPDATED}</p>
          <p className="mt-8 leading-relaxed text-muted">{intro}</p>
          <div className="mt-10 space-y-10">{children}</div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-2xl font-medium text-ink">{title}</h2>
      <div className="space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/** Styled inline link for use inside legal copy. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-copper underline underline-offset-2 hover:text-copper-hover">
      {children}
    </Link>
  );
}

export function LegalContactSection() {
  return (
    <LegalSection title="Contact Us">
      <address className="not-italic">
        <span className="block font-semibold text-ink">{BUSINESS.name}</span>
        <span className="block">
          Email:{" "}
          <a href={`mailto:${BUSINESS.email}`} className="break-all text-copper hover:text-copper-hover">
            {BUSINESS.email}
          </a>
        </span>
        <span className="block">
          Phone:{" "}
          <a href={PHONE_HREF} className="text-copper hover:text-copper-hover">
            {BUSINESS.phoneDisplay}
          </a>
        </span>
        <span className="block">Location: {BUSINESS_LOCATION}</span>
      </address>
    </LegalSection>
  );
}
