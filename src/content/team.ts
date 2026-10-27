import type { TeamMember } from "./types";

/**
 * The co-founders, as the client wrote them. Bios avoid time-sensitive phrases
 * ("rising junior", "this summer") so they don't go stale.
 * Raw headshots go in public/uploads/team/<first-last>/ (portrait, at least 1000px tall).
 */
export const TEAM: TeamMember[] = [
  {
    name: "Alex Boruvka",
    title: "Co-Founder",
    bio: "Alex has been in the window cleaning business for over 3 years, starting with his own company, Northview Services. Now he has co-founded Eastwick Boston, bringing his experience and expertise in the industry.",
    headshot: "/media/team/alex.jpg",
    headshotFocal: "50% 30%",
  },
  {
    name: "Henry Shelton",
    title: "Co-Founder",
    bio: "Henry started his first window cleaning company, Eastwick External Services, in Raleigh, NC. Now, while a student at Babson College, he has founded a second location in Boston, MA.",
    headshot: "/media/team/Copy_of_IMG_7805.jpg",
    headshotFocal: "50% 25%",
  },
];
