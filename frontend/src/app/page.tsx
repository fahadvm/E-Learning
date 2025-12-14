"use client"

import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Roles from '@/components/home/Roles';
import Stats from '@/components/home/Stats';
import Technology from '@/components/home/Technology';
import CTA from '@/components/home/CTA';
import Navigation from '@/components/home/Navigation';
import CosmicBackground from '@/components/home/CosmicBackground';

function App() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <CosmicBackground />

      <div className="relative z-10">
        <Navigation />
        <Stats />
        <Features />
        <Roles />
        <Technology />
        <CTA />
      </div>
    </div>
  );
}

export default App;
