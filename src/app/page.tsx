import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TownTicker from "@/components/TownTicker";
import ServicesRail from "@/components/ServicesRail";
import ResultsShowcase from "@/components/ResultsShowcase";
import StatPanel from "@/components/StatPanel";
import Founders from "@/components/Founders";
import TestimonialsSection from "@/components/TestimonialsSection";
import ServiceAreas from "@/components/ServiceAreas";
import FaqSection from "@/components/FaqSection";
import QuoteSection from "@/components/QuoteSection";
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
        <TownTicker />
        <ServicesRail />
        <ResultsShowcase />
        <StatPanel />
        <Founders />
        <TestimonialsSection />
        <ServiceAreas />
        <FaqSection />
        <QuoteSection />
      </main>
      <SiteFooter withActionBar ground="ink" />
      <StickyActionBar />
    </>
  );
}
