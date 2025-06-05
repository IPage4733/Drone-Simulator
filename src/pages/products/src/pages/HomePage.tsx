import React from 'react';
import HeroSection from '../sections/HeroSection';
import DronesSection from '../sections/DronesSection';
import ScenariosSection from '../sections/ScenariosSection';
import PlansSection from '../sections/PlansSection';
import CustomPlanSection from '../sections/CustomPlanSection';
import FeaturesSection from '../sections/FeaturesSection';
import CTASection from '../sections/CTASection';
import Navigation from '@/components/Navigation';

const HomePage: React.FC = () => {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <DronesSection />
      <ScenariosSection />
      <PlansSection />
      <CustomPlanSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
};

export default HomePage;