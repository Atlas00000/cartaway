"use client";

import React from 'react';
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover
                <span className="text-indigo-600 block">CartAway</span>
                <span className="text-2xl lg:text-3xl font-medium text-gray-600">
                  Your Premium Shopping Destination
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg">
                Experience luxury shopping with curated products, exceptional service, 
                and seamless delivery. Your lifestyle, elevated.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Categories
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">Premium Quality</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8">
                <div className="w-full h-full bg-white rounded-xl shadow-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <ShoppingBag className="w-24 h-24 text-indigo-600 mx-auto" />
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Premium Collection
                    </h3>
                    <p className="text-gray-600">
                      Curated products for the modern lifestyle
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
