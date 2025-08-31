"use client";

import React, { useState, useEffect } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import TrendingNowSection from '@/components/sections/TrendingNowSection';
import LifestyleBlog from '@/components/sections/LifestyleBlog';
import LuxuryServicesSection from '@/components/sections/LuxuryServicesSection';
import CustomerReviewsSection from '@/components/sections/CustomerReviewsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import TrustSecuritySection from '@/components/sections/TrustSecuritySection';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Preparing your premium shopping experience..."
        showProgress={true}
        progress={progress}
      />
    );
  }

  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TrendingNowSection />
      <LifestyleBlog />
      <LuxuryServicesSection />
      <CustomerReviewsSection />
      <NewsletterSection />
      <TrustSecuritySection />
    </main>
  );
}
