import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServiceReels from "@/components/ServiceReels";
import Transformations from "@/components/Transformations";
import TestimonialsSection from "@/components/TestimonialsSection";
import TeamStory from "@/components/TeamStory";
import ServiceAreas from "@/components/ServiceAreas";
import QuoteSection from "@/components/QuoteSection";
import ContactList from "@/components/ContactList";
import SiteFooter from "@/components/SiteFooter";
import StickyActionBar from "@/components/StickyActionBar";
import { localBusinessJsonLd } from "@/lib/jsonld";

export default function Home() {
  const jsonLd = localBusinessJsonLd();

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServiceReels />
        <Transformations />
        <TestimonialsSection />
        <TeamStory />
        <ServiceAreas />
        <QuoteSection />
        <ContactList />
      </main>
      <SiteFooter withActionBar />
      <StickyActionBar />
    </>
  );
}
