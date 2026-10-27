import type { Review } from "./types";

/**
 * Real Google reviews of Eastwick External Services. If this list is emptied,
 * the reviews section, its nav link and the hero rating chip all hide.
 */
export const REVIEWS: Review[] = [
  { name: "JT Denney", rating: 5, text: "Had Eastwick come out and do my windows and gutters, couldn't have been happier with the service. The boys were super nice and I highly recommend!" },
  { name: "John Prater", rating: 5, text: "Wonderful people at Eastwick would definitely recommend" },
  { name: "Parker Soderberg", rating: 5, text: "Awesome service! I hired them to pressure wash my home and they did a great job! 10/10 recommend" },
  { name: "Kate Sheehan", rating: 5, text: "Incredible service! The people are awesome! You should definitely use this company!" },
  { name: "Braxton Burge", rating: 5, text: "Great experience overall. The team was professional, on time, and easy to work with. They explained everything clearly, didn't push unnecessary services, and did quality work. They were respectful, cleaned up after themselves, and made sure I was satisfied. I'd definitely recommend them and would use them again." },
  { name: "Cameron Tarkenton", rating: 5, text: "Great people, always looking for the better of others. Amazing service." },
  { name: "Cecily Lindsey", rating: 5, text: "Incredible service great people!" },
  { name: "Roland DeRonja", rating: 5, text: "Very professional and easy to work with." },
  { name: "Nicholas", rating: 5, text: "Very helpful and attentive. The people are great and supported me through the whole process! Great service as well five out of five stars." },
  { name: "Charlotte F", rating: 5, text: "Great people great service" },
];

/** Shown as "{REVIEW_COUNT}+ reviews". Update from the Google profile. */
export const REVIEW_COUNT = 70;
export const OVERALL_RATING = 5.0;

export const HAS_REVIEWS = REVIEWS.length > 0;
