"use client";

import React from 'react';
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-mesh overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-warm opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-sunset opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-display text-neutral-900 leading-tight">
                  Discover
                  <span className="block text-gradient animate-gradient">CartAway</span>
                  <span className="text-2xl lg:text-3xl font-heading text-neutral-600">Your Premium Shopping Destination</span>
                </h1>
                <p className="text-xl text-neutral-600 max-w-lg leading-relaxed">
                  Experience luxury shopping with curated products, exceptional service, and seamless delivery. Your lifestyle, elevated.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-premium group">
                <span className="relative z-10">Shop Now</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="relative px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-neutral-700 font-semibold hover:bg-white hover:shadow-premium transition-all duration-300 group">
                <span className="relative z-10">Explore Categories</span>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-warm transition-all duration-300">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-700">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center shadow-glow-warm group-hover:shadow-glow-rose transition-all duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-700">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-sunset rounded-lg flex items-center justify-center shadow-glow-warm group-hover:shadow-glow-accent transition-all duration-300">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-700">Premium Quality</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative animate-fade-in-right">
            <div className="relative z-10">
              <div className="card-premium bg-white/90 backdrop-blur-sm border-white/30 p-12">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse-slow"></div>
                    <div className="relative w-full h-full bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                      <ShoppingBag className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-heading text-neutral-900">Premium Collection</h3>
                    <p className="text-neutral-600">Curated products for the modern lifestyle</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-warm rounded-full opacity-30 animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-sunset rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-12 w-16 h-16 bg-gradient-fire rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-12 border-2 border-neutral-400 rounded-full flex justify-center">
          <div className="w-1 h-4 bg-gradient-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
