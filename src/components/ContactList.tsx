import ScrollReveal from "@/components/ScrollReveal";
import SocialIcon from "@/components/SocialIcon";
import { BUSINESS, BUSINESS_LOCATION, PHONE_HREF, SMS_HREF } from "@/lib/business";

const icon = {
  call: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z",
  text: "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  email: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  location: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  hours: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

const rows: { label: string; value: string; href?: string; icon: string }[] = [
  { label: "Call", value: BUSINESS.phoneDisplay, href: PHONE_HREF, icon: icon.call },
  { label: "Text", value: BUSINESS.phoneDisplay, href: SMS_HREF, icon: icon.text },
  { label: "Email", value: BUSINESS.email, href: `mailto:${BUSINESS.email}`, icon: icon.email },
  { label: "Location", value: `${BUSINESS_LOCATION} · ${BUSINESS.serviceAreaPhrase}`, icon: icon.location },
  { label: "Hours", value: BUSINESS.hours, icon: icon.hours },
];

export default function ContactList() {
  return (
    <section id="contact" className="bg-cream-2 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper">Contact</p>
          <h2 className="mt-3 text-4xl font-medium leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
            Call, text, or <em className="font-normal text-copper">say hello</em>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Questions before you book? Reach the team directly. We usually reply the same day.
          </p>
          <div className="mt-8 flex gap-3">
            {BUSINESS.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${BUSINESS.name} on ${s.label}`}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-copper hover:bg-copper hover:text-white"
              >
                <SocialIcon label={s.label} />
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ul className="divide-y divide-sand overflow-hidden rounded-3xl border border-sand bg-cream">
            {rows.map((row) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-2 text-copper">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d={row.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">{row.label}</span>
                    <span className="mt-0.5 block break-words text-base font-medium text-ink">{row.value}</span>
                  </span>
                  {row.href && (
                    <span className="text-copper" aria-hidden>
                      →
                    </span>
                  )}
                </>
              );
              return (
                <li key={row.label}>
                  {row.href ? (
                    <a href={row.href} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-cream-2 sm:px-6">
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-4 sm:px-6">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
