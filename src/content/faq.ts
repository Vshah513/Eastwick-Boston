import { AREAS } from "./areas";

/**
 * FAQ answers use only facts already stated elsewhere on the site.
 * TODO: have the client review these before launch.
 */
const towns = AREAS.map((a) => a.name);

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How much does it cost?",
    a: "Every estimate is free and comes with no obligation. Tell us about your property in the quote form and we'll send a clear, detailed price before any work starts.",
  },
  {
    q: "Are you insured?",
    a: "Yes. Eastwick is fully insured, so your home and our crew are covered on every job.",
  },
  {
    q: "Which towns do you serve?",
    a: `We serve ${towns.slice(0, -1).join(", ")} and ${towns[towns.length - 1]}. Not on the list? Ask anyway, we're always expanding.`,
  },
  {
    q: "Who does the work?",
    a: "A trained crew of college students, led by our co-founders. We show up on time, explain the job clearly and leave every property cleaner than we found it.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Every job is backed by our satisfaction guarantee. Let us know and we'll make it right.",
  },
  {
    q: "How do I book?",
    a: "Fill out the quote form below, or call or text us. We get back to you within 24 hours.",
  },
];
