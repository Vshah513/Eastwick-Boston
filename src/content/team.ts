import type { TeamMember } from "./types";

/**
 * TODO: confirm the Boston team. Bios avoid time-sensitive phrases
 * ("rising junior", "this summer") so they don't go stale.
 * Raw headshots go in media-src/team/<first-last>/ (square, at least 800×800).
 */
export const TEAM: TeamMember[] = [
  {
    name: "Henry Shelton",
    title: "CEO",
    bio: "Henry studies at Babson College. He started Eastwick by going door to door pitching window cleaning, and has grown it into a company of 25+ employees across multiple locations.",
  },
  {
    name: "Jack Davenport",
    title: "Co-Founder & Project Manager",
    bio: "Jack studies at the University of Alabama. One of Eastwick's original crew, he manages the technicians who complete our residential jobs.",
  },
  {
    name: "Nick Buff",
    title: "Project Manager",
    bio: "Nick studies at Wake Technical Community College. He started as Eastwick's lead technician and now runs the soft washing and pressure washing team.",
  },
  {
    name: "Everett Blachly",
    title: "Head of Sales",
    bio: "Everett studies at UNC Chapel Hill. He built Eastwick's sales team into 12+ active representatives.",
  },
  {
    name: "Paul Helms",
    title: "Project Manager",
    bio: "Paul studies at Appalachian State University. He manages technicians on job sites and helps with client outreach.",
  },
];
