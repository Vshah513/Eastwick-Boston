import type { TeamMember } from "./types";

/**
 * TODO: confirm the Boston team. Bios avoid time-sensitive phrases
 * ("rising junior", "this summer") so they don't go stale.
 * Raw headshots go in public/uploads/team/<first-last>/ (square, at least 800×800).
 */
export const TEAM: TeamMember[] = [
  {
    name: "Henry Shelton",
    title: "CEO",
    bio: "Henry studies at Babson College. He started Eastwick by going door to door pitching window cleaning, and has grown it into a company of 25+ employees across multiple locations.",
    headshot: "/media/team/henry.jpg",
    headshotFocal: "50% 22%",
  },
  {
    name: "Paul Helms",
    title: "Project Manager",
    bio: "Paul studies at Appalachian State University. He manages technicians on job sites and helps with client outreach.",
  },
];
