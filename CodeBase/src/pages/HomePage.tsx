import React from 'react';
import Hero from '../components/home/Hero';
import MissionSection from '../components/home/MissionSection';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import ImpactStats from '../components/home/ImpactStats';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <MissionSection />
      <Features />
      <HowItWorks />
      <ImpactStats />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;