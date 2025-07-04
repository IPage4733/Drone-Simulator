
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TutorialsPreview from "@/components/TutorialsPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import FlyToWinBanner from "@/components/Flytowinbanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navigation />
      <HeroSection />
      <FlyToWinBanner />
      <FeaturesSection />
      {/* <TutorialsPreview /> */}
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
