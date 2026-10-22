import { SERVICE_IDS } from "@/content/services";
import { FIELD_LIMITS, PROPERTY_TYPES } from "@/lib/quote";

export type QuoteRequest = {
  name: string;
  email: string;
  phone: string;
  property: string;
  address: string;
  message: string;
  services: string[];
  smsTransactionalConsent: boolean;
  smsPromotionalConsent: boolean;
  pageUrl: string;
};

export type ValidationResult =
  | { ok: true; data: QuoteRequest }
  | { ok: false; fields: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Server-side check of a quote request body. Never trust the browser's `required`. */
export function validateQuote(body: unknown): ValidationResult {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const fields: Record<string, string> = {};

  const name = str(b.name);
  const email = str(b.email);
  const phone = str(b.phone);
  const property = str(b.property);
  const address = str(b.address);
  const message = str(b.message);

  if (!name) fields.name = "Please enter your name.";
  else if (name.length > FIELD_LIMITS.name) fields.name = "Name is too long.";

  if (!email) fields.email = "Please enter your email.";
  else if (email.length > FIELD_LIMITS.email || !EMAIL_RE.test(email)) fields.email = "Please enter a valid email.";

  const digits = phone.replace(/\D/g, "");
  if (!phone) fields.phone = "Please enter your phone number.";
  else if (phone.length > FIELD_LIMITS.phone || digits.length < 10 || digits.length > 15)
    fields.phone = "Please enter a valid phone number.";

  if (!(PROPERTY_TYPES as readonly string[]).includes(property)) fields.property = "Please choose a property type.";

  if (!address) fields.address = "Please enter the property address.";
  else if (address.length > FIELD_LIMITS.address) fields.address = "Address is too long.";

  if (message.length > FIELD_LIMITS.message) fields.message = "Please keep details under 2,000 characters.";

  const services = Array.isArray(b.services) ? b.services : [];
  if (services.length > SERVICE_IDS.length || !services.every((s) => typeof s === "string" && SERVICE_IDS.includes(s)))
    fields.services = "Unknown service selected.";

  if (Object.keys(fields).length) return { ok: false, fields };

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      property,
      address,
      message,
      services: [...new Set(services as string[])],
      // Consent only counts when explicitly true — never inferred.
      smsTransactionalConsent: b.smsTransactionalConsent === true,
      smsPromotionalConsent: b.smsPromotionalConsent === true,
      pageUrl: str(b.pageUrl).slice(0, 500),
    },
  };
}
