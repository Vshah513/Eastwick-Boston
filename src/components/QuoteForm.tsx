"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PRIVACY_POLICY_PATH,
  SMS_PROMOTIONAL_CONSENT_STATEMENT,
  SMS_TRANSACTIONAL_CONSENT_STATEMENT,
  TERMS_PATH,
} from "@/lib/business";
import { SERVICES } from "@/content/services";
import { FIELD_LIMITS, HONEYPOT_FIELD, PROPERTY_TYPES } from "@/lib/quote";
import { SELECT_SERVICE_EVENT } from "@/lib/quote-events";

const EMPTY_FIELDS = { name: "", email: "", phone: "", property: "", address: "", message: "" };

const inputClass =
  "w-full rounded-[14px] border border-transparent bg-fog px-4 py-3.5 text-base text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted/50 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-red-600";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export default function QuoteForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // Separate optional SMS opt-ins for A2P compliance — both must start unchecked and never be required.
  const [smsTransactionalConsent, setSmsTransactionalConsent] = useState(false);
  const [smsPromotionalConsent, setSmsPromotionalConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [fields, setFields] = useState(EMPTY_FIELDS);

  // Pre-select a service from a "Quote this" button or a ?service= link (e.g. from an ad).
  useEffect(() => {
    const select = (id: string) => {
      if (!SERVICES.some((s) => s.id === id)) return;
      setSelectedServices((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };
    const fromUrl = new URLSearchParams(window.location.search).get("service");
    if (fromUrl) select(fromUrl);
    const onSelect = (e: Event) => select((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          services: selectedServices,
          smsTransactionalConsent,
          smsPromotionalConsent,
          pageUrl: window.location.href,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.fields) setFieldErrors(data.fields);
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (id: string) =>
    fieldErrors[id] ? (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
        {fieldErrors[id]}
      </p>
    ) : null;
  const errorProps = (id: string) =>
    fieldErrors[id] ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-14 text-center" role="status">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold text-ink">Thank You!</h3>
        <p className="mx-auto mt-3 max-w-md text-muted">
          We&apos;ve received your request. Our team will get back to you within 24 hours with a detailed quote.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFields(EMPTY_FIELDS);
            setSelectedServices([]);
            setSmsTransactionalConsent(false);
            setSmsPromotionalConsent(false);
          }}
          className="mt-6 font-semibold text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Service Selection */}
      <fieldset>
        <legend className={labelClass}>Services you need</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const on = selectedServices.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                  on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/40"
                }`}
              >
                {on && <span aria-hidden>✓ </span>}
                {service.title}
              </button>
            );
          })}
        </div>
        {fieldError("services")}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <input id="name" type="text" required autoComplete="name" maxLength={FIELD_LIMITS.name} placeholder="Jane Smith" value={fields.name} onChange={handleChange} className={inputClass} {...errorProps("name")} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" required autoComplete="email" maxLength={FIELD_LIMITS.email} placeholder="jane@example.com" value={fields.email} onChange={handleChange} className={inputClass} {...errorProps("email")} />
          {fieldError("email")}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input id="phone" type="tel" required autoComplete="tel" maxLength={FIELD_LIMITS.phone} placeholder="(555) 123-4567" value={fields.phone} onChange={handleChange} className={inputClass} {...errorProps("phone")} />
        {fieldError("phone")}
      </div>

      <div className="grid gap-5 sm:grid-cols-3 sm:gap-4">
        <div>
          <label htmlFor="property" className={labelClass}>Property Type</label>
          <select id="property" required value={fields.property} onChange={handleChange} className={inputClass} {...errorProps("property")}>
            <option value="" disabled>Select type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {fieldError("property")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClass}>Property Address</label>
          <input id="address" type="text" required autoComplete="street-address" maxLength={FIELD_LIMITS.address} placeholder="123 Main St, City" value={fields.address} onChange={handleChange} className={inputClass} {...errorProps("address")} />
          {fieldError("address")}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Additional Details <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="message" rows={3} maxLength={FIELD_LIMITS.message} placeholder="Anything we should know about your property or timing?" value={fields.message} onChange={handleChange} className={`${inputClass} resize-none`} {...errorProps("message")} />
        {fieldError("message")}
      </div>

      {/* Honeypot: hidden from people and screen readers; bots that fill it are silently ignored. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Fax number</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Optional SMS consent: two separate unchecked boxes kept directly above the submit button for A2P compliance */}
      <div className="space-y-3 rounded-2xl border border-line p-4">
        <div className="flex items-start gap-3">
          <input
            id="smsTransactionalConsent"
            type="checkbox"
            checked={smsTransactionalConsent}
            onChange={(e) => setSmsTransactionalConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent"
          />
          <label htmlFor="smsTransactionalConsent" className="cursor-pointer text-xs leading-relaxed text-muted sm:text-sm">
            {SMS_TRANSACTIONAL_CONSENT_STATEMENT}
          </label>
        </div>
        <div className="flex items-start gap-3">
          <input
            id="smsPromotionalConsent"
            type="checkbox"
            checked={smsPromotionalConsent}
            onChange={(e) => setSmsPromotionalConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent"
          />
          <label htmlFor="smsPromotionalConsent" className="cursor-pointer text-xs leading-relaxed text-muted sm:text-sm">
            {SMS_PROMOTIONAL_CONSENT_STATEMENT}
          </label>
        </div>
        <p className="text-xs leading-relaxed text-muted sm:text-sm">
          View our{" "}
          <Link href={PRIVACY_POLICY_PATH} target="_blank" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href={TERMS_PATH} target="_blank" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
            Terms and Conditions
          </Link>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {loading ? "Sending…" : "Request Free Quote"}
      </button>
    </form>
  );
}
