import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoriesSection from '@/components/sections/CategoriesSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedProducts />
    </main>
  );
}
