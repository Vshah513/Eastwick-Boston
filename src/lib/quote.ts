/** Shared between the quote form (client) and /api/contact validation (server). */
export const PROPERTY_TYPES = ["Residential", "Commercial", "Multi-Family", "Industrial"] as const;

export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  address: 200,
  message: 2000,
} as const;

/** Name of the hidden honeypot input. Deliberately not something autofill recognises. */
export const HONEYPOT_FIELD = "fax_number";
