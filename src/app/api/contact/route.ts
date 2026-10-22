import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  BUSINESS,
  SMS_PROMOTIONAL_CONSENT_STATEMENT,
  SMS_TRANSACTIONAL_CONSENT_STATEMENT,
} from "@/lib/business";
import { serviceTitle } from "@/content/services";
import { HONEYPOT_FIELD } from "@/lib/quote";
import { validateQuote } from "@/lib/validate";
import { clientIp, isRateLimited, recordHit } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 10 * 1024;
const ACCENT = "#c2410c";

/** Escape visitor-supplied text before placing it in the email HTML. */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const error = (message: string, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error: message, ...extra }, { status });

export async function POST(request: Request) {
  // Reject oversized payloads: check the header first, then the actual body (the header can be absent).
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return error("Request is too large.", 413);
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return error("Request is too large.", 413);
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return error("Invalid request.", 400);
  }

  // Honeypot: real visitors never see this field. Pretend success so bots don't retry.
  if (typeof body?.[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD] !== "") {
    return NextResponse.json({ success: true });
  }

  const result = validateQuote(body);
  if (!result.ok) {
    return error("Please check the highlighted fields.", 400, { fields: result.fields });
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return error("Too many requests. Please call or text us instead.", 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return error("Our form is temporarily unavailable. Please call or text us.", 500);
  }

  const {
    name,
    email,
    phone,
    property,
    address,
    message,
    services,
    smsTransactionalConsent,
    smsPromotionalConsent,
    pageUrl,
  } = result.data;

  // SMS consent record for A2P compliance: what was agreed to, where, and when.
  const sourceUrl = pageUrl || request.headers.get("referer") || "Unknown";
  const submittedAt = new Date();
  const submittedAtEastern = submittedAt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "long",
    timeStyle: "long",
  });

  const serviceList = services.length ? services.map(serviceTitle).join(", ") : "None selected";

  const row = (label: string, value: string, extraStyle = "") =>
    `<tr><td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;${extraStyle}">${label}</td><td style="padding: 8px 0;${extraStyle}">${value}</td></tr>`;

  const resend = new Resend(apiKey);
  const { error: sendError } = await resend.emails.send({
    from: `Eastwick Boston Website <${BUSINESS.emailFrom}>`,
    to: BUSINESS.email,
    replyTo: email,
    subject: `New BOSTON Quote Request from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${ACCENT};">New Boston Quote Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${row("Name", escapeHtml(name))}
          ${row("Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
          ${row("Phone", escapeHtml(phone))}
          ${row("Property Type", escapeHtml(property))}
          ${row("Address", escapeHtml(address))}
          ${row("Services", escapeHtml(serviceList))}
          ${message ? row("Message", escapeHtml(message)) : ""}
          ${row("Source", "Boston website")}
        </table>

        <h3 style="color: ${ACCENT}; margin-top: 28px;">SMS Consent Record</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${row(
            "Transactional SMS",
            smsTransactionalConsent
              ? `<span style="color: #16a34a; font-weight: bold;">Yes</span> — opted in to quote, appointment, and service texts`
              : `<span style="color: #dc2626; font-weight: bold;">No</span> — did not opt in. Do not send service texts to this number.`
          )}
          ${smsTransactionalConsent ? row("Consent Text", `<em>${escapeHtml(SMS_TRANSACTIONAL_CONSENT_STATEMENT)}</em>`) : ""}
          ${row(
            "Promotional SMS",
            smsPromotionalConsent
              ? `<span style="color: #16a34a; font-weight: bold;">Yes</span> — opted in to marketing texts`
              : `<span style="color: #dc2626; font-weight: bold;">No</span> — did not opt in. Do not send marketing texts to this number.`
          )}
          ${smsPromotionalConsent ? row("Consent Text", `<em>${escapeHtml(SMS_PROMOTIONAL_CONSENT_STATEMENT)}</em>`) : ""}
          ${row("Page URL", escapeHtml(sourceUrl))}
          ${row("Submitted", `${escapeHtml(submittedAtEastern)}<br><span style="color: #78716c;">${submittedAt.toISOString()}</span>`)}
        </table>
      </div>
    `,
  });

  if (sendError) {
    console.error("[contact] Resend error:", sendError.message);
    return error("Something went wrong sending your request. Please try again or call us.", 500);
  }

  recordHit(ip);
  return NextResponse.json({ success: true });
}
