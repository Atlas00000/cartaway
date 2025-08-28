import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import TrendingNowSection from '@/components/sections/TrendingNowSection';
import LifestyleBlogSection from '@/components/sections/LifestyleBlogSection';
import LuxuryServicesSection from '@/components/sections/LuxuryServicesSection';
import CustomerReviewsSection from '@/components/sections/CustomerReviewsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import TrustSecuritySection from '@/components/sections/TrustSecuritySection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TrendingNowSection />
      <LifestyleBlogSection />
      <LuxuryServicesSection />
      <CustomerReviewsSection />
      <NewsletterSection />
      <TrustSecuritySection />
    </main>
  );
}
