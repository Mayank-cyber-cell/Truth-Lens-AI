import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollShowcaseSection from "@/components/ScrollShowcaseSection";
import DetectorSection from "@/components/DetectorSection";
import SpecializedToolsSection from "@/components/SpecializedToolsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MisinformationMapSection from "@/components/MisinformationMapSection";
import EducationSection from "@/components/EducationSection";
import CommunityFactCheckSection from "@/components/CommunityFactCheckSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ScrollShowcaseSection />
      <DetectorSection />
      <SpecializedToolsSection />
      <HowItWorksSection />
      <MisinformationMapSection />
      <EducationSection />
      <CommunityFactCheckSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
