"use client";

import React, { useEffect, useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import MobileHeroSection from '@/components/sections/MobileHeroSection';
import MobileProductGrid from '@/components/sections/MobileProductGrid';
import { Product } from '@/lib/types';
import { api } from '@/lib/api/client';

const MobileHomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featuredResponse = await api.getFeaturedProducts();
        setFeaturedProducts(featuredResponse.results?.slice(0, 4) || []);
        
        // Fetch trending products
        const trendingResponse = await api.getBestsellers();
        setTrendingProducts(trendingResponse.results?.slice(0, 4) || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MobileLayout>
      {/* Hero Section */}
      <MobileHeroSection />

      {/* Featured Products */}
      <MobileProductGrid
        products={featuredProducts}
        title="Featured Products"
        subtitle="Handpicked for you"
        loading={loading}
      />

      {/* Trending Products */}
      <MobileProductGrid
        products={trendingProducts}
        title="Trending Now"
        subtitle="What's hot right now"
        loading={loading}
      />

      {/* Mobile-optimized Stats Section */}
      <section className="py-8 bg-gradient-to-br from-neutral-50 to-white">
        <div className="px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display text-neutral-900 mb-2">CartAway by the Numbers</h2>
            <p className="text-neutral-600">Trusted by thousands worldwide</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-display text-gradient mb-1">1,000+</div>
              <div className="text-sm text-neutral-600">Products</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-display text-gradient mb-1">5,000+</div>
              <div className="text-sm text-neutral-600">Orders</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-display text-gradient mb-1">10,000+</div>
              <div className="text-sm text-neutral-600">Customers</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-display text-gradient mb-1">4.9/5</div>
              <div className="text-sm text-neutral-600">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-optimized Newsletter Section */}
      <section className="py-8 bg-gradient-to-r from-warm-orange-50 to-warm-rose-50">
        <div className="px-4 text-center">
          <h2 className="text-2xl font-display text-neutral-900 mb-3">Stay in the Loop</h2>
          <p className="text-neutral-600 mb-6">
            Subscribe for exclusive offers and updates
          </p>
          
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-xs text-neutral-500 mt-3">
            No spam, just luxury updates
          </p>
        </div>
      </section>

      {/* Mobile-optimized Trust Section */}
      <section className="py-8 bg-white">
        <div className="px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display text-neutral-900 mb-2">Trust & Security</h2>
            <p className="text-neutral-600">Your security is our priority</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <span className="text-success-600 text-lg">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">SSL Secure</h3>
                <p className="text-sm text-neutral-600">256-bit encryption</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-lg">🛡️</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Privacy Protected</h3>
                <p className="text-sm text-neutral-600">Your data is safe</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <span className="text-accent-600 text-lg">💳</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Secure Payments</h3>
                <p className="text-sm text-neutral-600">Multiple options available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MobileLayout>
  );
};

export default MobileHomePage;
