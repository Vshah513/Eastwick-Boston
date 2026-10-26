import Image from "next/image";
import RevealLines, { Eyebrow } from "@/components/RevealLines";
import ScrollReveal from "@/components/ScrollReveal";
import { STORY } from "@/content/story";
import { TEAM } from "@/content/team";
import type { TeamMember } from "@/content/types";

const pad = (n: number) => String(n).padStart(2, "0");

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function FounderCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <article>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink">
        {member.headshot ? (
          <Image
            src={member.headshot}
            alt={member.name}
            fill
            className="object-cover"
            style={{ objectPosition: member.headshotFocal ?? "50% 25%" }}
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          // Monogram until the founder's photo arrives.
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_90%_at_70%_10%,#1f5fbf_0%,#12284a_45%,#0b1b33_100%)]" aria-hidden>
            <span className="font-heading text-[9rem] leading-none font-extrabold tracking-[-0.06em] text-white/15 sm:text-[11rem]">
              {initialsOf(member.name)}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
          {member.title}
        </span>
        <span className="absolute top-4 right-5 text-sm font-semibold text-white/80 tabular-nums">{pad(index + 1)}</span>
      </div>
      <h3 className="mt-6 text-3xl font-extrabold text-ink sm:text-4xl">{member.name}</h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted sm:text-lg">{member.bio}</p>
    </article>
  );
}

/** Founders in a two-up grid whose second column drops, so the eye zig-zags down. */
export default function Founders() {
  return (
    <section id="founders" className="bg-paper py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Founders</Eyebrow>
            <RevealLines
              lines={["Two founders.", { text: "One standard.", className: "text-ink/35" }]}
              className="mt-4 text-[2.5rem] leading-[1.02] font-extrabold text-ink sm:text-6xl lg:text-7xl"
            />
          </div>
          <span
            className="hidden font-heading text-8xl leading-none font-extrabold tracking-[-0.06em] text-ink/[0.07] sm:block lg:text-[10rem]"
            aria-hidden
          >
            {pad(TEAM.length)}
          </span>
        </div>

        <ScrollReveal className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12">
          <p className="text-lg leading-relaxed text-ink sm:text-xl lg:col-span-6">
            {STORY.lead} {STORY.paragraphs[0]}
          </p>
          <ul className="flex flex-wrap content-start gap-2 lg:col-span-5 lg:col-start-8">
            {STORY.promises.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink">
                <svg className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ul className="mt-14 grid gap-14 sm:mt-20 sm:grid-cols-2 sm:gap-8 lg:gap-16">
          {TEAM.map((member, i) => (
            <li key={member.name} className={i % 2 === 1 ? "sm:mt-28 lg:mt-48" : ""}>
              <ScrollReveal delay={i * 0.08}>
                <FounderCard member={member} index={i} />
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
