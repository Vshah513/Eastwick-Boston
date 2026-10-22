import type { Metadata } from "next";
import LegalPage, { LegalContactSection, LegalSection } from "@/components/LegalPage";
import { PRIVACY_POLICY_PATH } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Eastwick External Services collects, uses, and protects your personal information, including mobile and SMS information.",
  alternates: { canonical: PRIVACY_POLICY_PATH },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Eastwick External Services respects your privacy. This policy explains what information we collect, how we use it, and the choices available to you when you use our website or contact us."
    >
      <LegalSection title="Information We Collect">
        <p>
          We may collect your name, email address, phone number, property
          address, requested services, property details, and any information
          you provide through our website, by phone, by email, or by text
          message. We may also collect basic website usage information such as
          browser type, device type, and pages visited.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Information">
        <p>
          We use your information to provide estimates, schedule and perform
          services, respond to questions, communicate about appointments, send
          service-related updates, improve our website and services, and comply
          with legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="SMS and Mobile Information">
        <p>
          If you opt in to transactional text messages, we use your mobile
          number to communicate about quotes, appointments, scheduling, service
          updates, and customer support. If you separately opt in to
          promotional text messages, we may also send special offers and
          service promotions. Mobile information will
          not be shared with third parties or affiliates for marketing or
          promotional purposes. All other categories exclude text messaging
          originator opt-in data and consent. This information will not be
          shared with any third parties, except vendors that help deliver the
          messaging service when necessary.
        </p>
      </LegalSection>

      <LegalSection title="Sharing Information">
        <p>
          We may share information with service providers that help us operate
          our website, manage customer requests, process communications, or
          perform business functions. These providers may use the information
          only to provide services to Eastwick External Services. We do not
          sell personal information.
        </p>
      </LegalSection>

      <LegalSection title="Data Security and Retention">
        <p>
          We use reasonable safeguards to protect personal information. We
          retain information only as long as reasonably necessary for business,
          legal, and customer-service purposes.
        </p>
      </LegalSection>

      <LegalSection title="Your Choices">
        <p>
          You may ask us to update or delete your personal information by
          contacting us. To stop text messages, reply STOP at any time. For help
          with text messages, reply HELP or contact us directly.
        </p>
      </LegalSection>

      <LegalContactSection />
    </LegalPage>
  );
}
