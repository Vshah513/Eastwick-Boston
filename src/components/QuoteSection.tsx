import QuoteForm from "@/components/QuoteForm";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ScrollReveal from "@/components/ScrollReveal";
import SocialIcon from "@/components/SocialIcon";
import { BUSINESS, PHONE_HREF, SMS_HREF } from "@/lib/business";

const promises = [
  { title: "No obligation", text: "A free, no-pressure estimate for your property." },
  { title: "Fast response", text: "We get back to you within 24 hours." },
  { title: "Transparent pricing", text: "A clear, detailed quote before any work starts." },
];

const icon = {
  call: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z",
  text: "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  email: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
};

const contacts = [
  { label: "Call", value: BUSINESS.phoneDisplay, href: PHONE_HREF, icon: icon.call },
  { label: "Text", value: BUSINESS.phoneDisplay, href: SMS_HREF, icon: icon.text },
  { label: "Email", value: BUSINESS.email, href: `mailto:${BUSINESS.email}`, icon: icon.email },
];

/** Inverted navy band: pitch, promises and direct contacts beside the quote form. */
export default function QuoteSection() {
  return (
    <section id="quote" className="bg-ink py-20 text-white sm:py-24 lg:py-32">
      {/* Old #contact links land here too. */}
      <span id="contact" className="sr-only" />
      {/* Phones: pitch, form, then direct contacts. Desktop: pitch and contacts stacked beside the form. */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-8">
        <div className="lg:col-span-5">
          <Eyebrow dark>Free estimate</Eyebrow>
          <RevealLines
            lines={["Get your free", { text: "estimate.", className: "text-accent-light" }]}
            className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold sm:text-6xl"
          />
          <ScrollReveal>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-dark sm:text-lg">
              Tell us about your property and we&apos;ll get back to you within 24 hours with a detailed,
              no-obligation quote.
            </p>

            <ol className="mt-10 space-y-5">
              {promises.map((p, i) => (
                <li key={p.title} className="flex gap-4 border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-accent-light tabular-nums">0{i + 1}</span>
                  <div>
                    <p className="font-heading text-lg font-bold tracking-tight">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted-dark">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>

        <ScrollReveal className="order-last lg:order-none lg:col-span-5 lg:pt-12">
          <p className="text-sm font-semibold text-white">Prefer to talk?</p>
          <ul className="mt-3 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            {contacts.map((row) => (
              <li key={row.label}>
                <a href={row.href} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.06]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-light">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d={row.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold tracking-[0.14em] text-muted-dark uppercase">{row.label}</span>
                    <span className="mt-0.5 block text-base font-medium [overflow-wrap:anywhere]">{row.value}</span>
                  </span>
                  <span className="text-accent-light" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2.5">
            {BUSINESS.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${BUSINESS.name} on ${s.label}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                <SocialIcon label={s.label} />
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <div className="rounded-[28px] bg-white p-5 text-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] sm:p-8 lg:p-10">
            <p className="mb-6 font-heading text-xl font-bold tracking-tight sm:text-2xl">Tell us about your property</p>
            <QuoteForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
