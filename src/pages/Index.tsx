
import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Benefits from '../components/Benefits';
import CTA from '../components/CTA';
import Contact from '../components/Contact';
import Chatbot from '../components/Chatbot';

const Index = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />
      <Hero />
      <Services />
      <Benefits />
      <CTA />
      <Contact />
      <Chatbot />
    </div>
  );
};

export default Index;
