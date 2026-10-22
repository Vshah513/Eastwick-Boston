"use client";

import Image from "next/image";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { STORY } from "@/content/story";
import { TEAM } from "@/content/team";
import type { TeamMember } from "@/content/types";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [open, setOpen] = useState(false);
  const bioId = `bio-${index}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-2">
      <div className="relative aspect-square bg-ink-3">
        {member.headshot ? (
          <Image
            src={member.headshot}
            alt={member.name}
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 20vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="font-heading text-4xl italic text-white/25">{initialsOf(member.name)}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <h3 className="text-base font-medium leading-tight text-white sm:text-lg">{member.name}</h3>
          <p className="mt-0.5 text-[11px] leading-tight text-white/75 sm:text-xs">{member.title}</p>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={bioId}
          className="flex w-full items-center justify-between gap-2 rounded-xl py-1.5 text-left text-sm font-medium text-white/85 transition-colors hover:text-white"
        >
          {open ? "Hide bio" : "Read bio"}
          <svg
            className={`h-4 w-4 text-copper-light transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        <div
          id={bioId}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden" inert={!open}>
            <p className="pt-2 text-sm leading-relaxed text-muted-dark">{member.bio}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Company story followed by the team — replaces Raleigh's separate About and Team sections. */
export default function TeamStory() {
  return (
    <section id="team" className="bg-ink py-16 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-light">Our story</p>
            <h2 className="mt-3 text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
              Built by students, <em className="font-normal text-copper-light">door by door</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="font-heading text-2xl leading-snug text-white sm:text-3xl">{STORY.lead}</p>
            {STORY.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-base leading-relaxed text-muted-dark sm:text-lg">
                {p}
              </p>
            ))}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {STORY.promises.map((item) => (
                <li key={item} className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
                  <svg className="h-4 w-4 text-copper-light" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        {STORY.teamPhoto && (
          <ScrollReveal className="mt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
              <Image src={STORY.teamPhoto.src} alt={STORY.teamPhoto.alt} fill className="object-cover" sizes="(min-width: 1280px) 1216px, 100vw" />
            </div>
          </ScrollReveal>
        )}

        <h3 className="mt-14 mb-6 font-body text-xs font-semibold uppercase tracking-[0.22em] text-muted-dark sm:mt-20">
          Meet the team
        </h3>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {TEAM.map((member, i) => (
            <li key={member.name}>
              <ScrollReveal delay={i * 0.06} className="h-full">
                <TeamCard member={member} index={i} />
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
