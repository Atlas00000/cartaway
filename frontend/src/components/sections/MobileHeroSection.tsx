"use client";

import React from 'react';
import { ArrowRight, Truck, Shield, Star } from 'lucide-react';

const MobileHeroSection: React.FC = () => {
  return (
    <section className="relative bg-mesh overflow-hidden min-h-[80vh] flex items-center">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute top-20 right-5 w-40 h-40 bg-gradient-warm opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-gradient-sunset opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full px-4 py-8">
        <div className="text-center space-y-6">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl font-display text-neutral-900 leading-tight">
              Discover
              <span className="block text-gradient animate-gradient">CartAway</span>
              <span className="text-lg font-heading text-neutral-600">Your Premium Shopping Destination</span>
            </h1>
            
            <p className="text-base text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Experience luxury shopping with curated products, exceptional service, and seamless delivery.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col space-y-3">
            <button className="btn-premium group w-full">
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="relative px-6 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl text-neutral-700 font-semibold hover:bg-white hover:shadow-premium transition-all duration-300 group w-full">
              <span className="relative z-10">Explore Categories</span>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Trust Indicators - Simplified */}
          <div className="flex items-center justify-center space-x-6 pt-6 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-neutral-700">Free Shipping</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-neutral-700">Secure</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-sunset rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-neutral-700">Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-4 h-8 border-2 border-neutral-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-primary rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default MobileHeroSection;
