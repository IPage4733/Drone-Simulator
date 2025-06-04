
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TutorialsPreview from "@/components/TutorialsPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TutorialsPreview />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
