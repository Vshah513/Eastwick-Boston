import type { Metadata } from "next";
import LegalPage, { LegalContactSection, LegalLink, LegalSection } from "@/components/LegalPage";
import { BUSINESS, PHONE_HREF, PRIVACY_POLICY_PATH, TERMS_PATH } from "@/lib/business";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for Eastwick External Services, including our SMS messaging program terms.",
  alternates: { canonical: TERMS_PATH },
};

const smsTerms: { label: string; text: React.ReactNode }[] = [
  {
    label: "Program description",
    text: "By checking the optional transactional SMS consent box on our website or otherwise providing express consent, you agree to receive text messages from Eastwick External Services about quotes, appointments, scheduling, service updates, and customer support. By checking the separate optional promotional SMS consent box, you agree to receive recurring promotional and marketing text messages, including special offers and service promotions. Consent to receive text messages is not a condition of purchase.",
  },
  {
    label: "Separate consent",
    text: "Consent for transactional messages and consent for promotional messages are collected separately through two optional, unchecked checkboxes. Agreeing to promotional messages is not a condition of purchasing any goods or services.",
  },
  {
    label: "Message frequency",
    text: "Message frequency varies based on your request, appointments, and services.",
  },
  {
    label: "Message and data rates",
    text: "Message and data rates may apply according to your mobile carrier and plan.",
  },
  {
    label: "Opt-out",
    text: "Reply STOP at any time to unsubscribe. After you send STOP, you may receive one final message confirming your opt-out.",
  },
  {
    label: "Help",
    text: (
      <>
        Reply HELP for assistance or contact us at{" "}
        <a href={PHONE_HREF} className="text-copper hover:text-copper-hover">
          {BUSINESS.phoneDisplay}
        </a>{" "}
        or{" "}
        <a href={`mailto:${BUSINESS.email}`} className="text-copper hover:text-copper-hover break-all">
          {BUSINESS.email}
        </a>
        .
      </>
    ),
  },
  {
    label: "Carrier disclaimer",
    text: "Mobile carriers are not liable for delayed or undelivered messages.",
  },
  {
    label: "Eligibility",
    text: "You must be at least 18 years old or have permission from a parent or legal guardian to enroll.",
  },
];

// TODO: confirm with the client's marketing contact whether the A2P 10DLC registration needs updating for this second site/domain.
export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      intro="By using this website or requesting services from Eastwick External Services, you agree to these Terms and Conditions."
    >
      <LegalSection title="Services and Estimates">
        <p>
          Eastwick External Services provides exterior cleaning and maintenance
          services. Quotes and estimates are based on the information available
          at the time and may change if the property conditions or requested
          work differ from what was originally described. Service dates may
          change because of weather, safety concerns, or other circumstances
          outside our control.
        </p>
      </LegalSection>

      <LegalSection title="Customer Responsibilities">
        <p>
          Customers must provide accurate contact and property information,
          disclose known hazards, and provide reasonable access to the property
          at the scheduled time. Additional service terms, pricing, and
          cancellation requirements may be provided with a quote or service
          agreement.
        </p>
      </LegalSection>

      <LegalSection title="SMS Terms and Conditions">
        <dl className="space-y-4">
          {smsTerms.map((term) => (
            <div key={term.label}>
              <dt className="font-semibold text-ink">{term.label}</dt>
              <dd className="mt-1">{term.text}</dd>
            </div>
          ))}
        </dl>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          Our collection and use of personal information is described in our{" "}
          <LegalLink href={PRIVACY_POLICY_PATH}>Privacy Policy</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="Website Use">
        <p>
          You may use this website only for lawful purposes. Website content may
          not be copied, altered, or used to misrepresent Eastwick External
          Services without written permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the extent allowed by law, Eastwick External Services is not
          responsible for indirect, incidental, or consequential losses
          resulting from website use, communication delays, or circumstances
          outside our reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="Changes to These Terms">
        <p>
          We may update these terms from time to time. The updated version will
          be posted on this page with a revised effective date.
        </p>
      </LegalSection>

      <LegalContactSection />
    </LegalPage>
  );
}
