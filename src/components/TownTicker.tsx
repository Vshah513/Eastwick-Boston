import { AREAS } from "@/content/areas";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {AREAS.map((area) => (
        <li key={area.name} className="flex items-center">
          <span className="px-5 font-heading text-3xl font-extrabold tracking-[-0.04em] text-ink/15 transition-colors duration-300 hover:text-ink sm:px-8 sm:text-5xl lg:text-6xl">
            {area.name}
          </span>
          <svg className="h-3 w-3 shrink-0 text-accent sm:h-4 sm:w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 0 9.8 6.2 16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Full-bleed band of every town we serve, drifting sideways (stops under reduced motion). */
export default function TownTicker() {
  return (
    <section aria-label="Towns we serve" className="border-b border-line bg-paper py-8 sm:py-10">
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-4 sm:mb-5 sm:px-6 lg:px-8">
        <p className="eyebrow text-muted">Now serving</p>
        <a href="#areas" className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover">
          View map <span aria-hidden>→</span>
        </a>
      </div>
      <div className="ticker overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="ticker-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
