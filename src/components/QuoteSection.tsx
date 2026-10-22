import QuoteForm from "@/components/QuoteForm";
import ScrollReveal from "@/components/ScrollReveal";

const promises = [
  { title: "No Obligation", text: "A free, no-pressure estimate for your property." },
  { title: "Fast Response", text: "We get back to you within 24 hours." },
  { title: "Transparent Pricing", text: "A clear, detailed quote before any work starts." },
];

export default function QuoteSection() {
  return (
    <section id="quote" className="bg-ink py-16 text-white sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-light">Free estimate</p>
          <h2 className="mt-3 text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
            Get your <em className="font-normal text-copper-light">free quote</em>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-dark sm:text-lg">
            Tell us about your property and we&apos;ll get back to you within 24 hours with a detailed,
            no-obligation quote.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {promises.map((p, i) => (
              <li key={p.title} className="flex gap-4">
                <span className="font-heading text-lg italic text-copper-light">0{i + 1}</span>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-sm text-muted-dark">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-3xl bg-cream p-5 text-ink sm:p-8 lg:p-10">
            <QuoteForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
