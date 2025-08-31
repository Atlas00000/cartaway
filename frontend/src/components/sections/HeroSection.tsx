"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Star, Shield, Truck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const heroSlides = [
    {
      title: "Premium Collection",
      subtitle: "Discover Luxury",
      description: "Experience curated luxury products that define your lifestyle. From fashion to technology, discover excellence in every detail.",
      image: "/luxury-premium-products-showcase.png",
      cta: "Shop Collection",
      badge: "New Arrivals",
      features: ["Free Shipping", "Premium Quality", "24/7 Support"]
    },
    {
      title: "Tech Essentials",
      subtitle: "Innovation Meets Style",
      description: "Cutting-edge technology meets sophisticated design. Upgrade your digital lifestyle with our premium tech collection.",
      image: "/modern-tech-gadgets-and-electronics.png",
      cta: "Explore Tech",
      badge: "Trending",
      features: ["Latest Tech", "Smart Solutions", "Expert Support"]
    },
    {
      title: "Lifestyle Curated",
      subtitle: "Elevate Your Everyday",
      description: "Transform your daily routine with thoughtfully curated lifestyle products that enhance your quality of life.",
      image: "/curated-lifestyle-products-and-accessories.png",
      cta: "Browse Lifestyle",
      badge: "Featured",
      features: ["Lifestyle", "Wellness", "Personal Care"]
    },
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-mesh overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-warm opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-sunset opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Section */}
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium animate-fade-in-down">
                <Star className="w-4 h-4" />
                {heroSlides[currentSlide].badge}
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-display text-neutral-900 leading-tight">
                  Discover
                  <span className="block text-gradient animate-gradient">
                    {heroSlides[currentSlide].title}
                  </span>
                  <span className="text-2xl lg:text-3xl font-heading text-neutral-600">
                    {heroSlides[currentSlide].subtitle}
                  </span>
                </h1>
                <p className="text-xl text-neutral-600 max-w-lg leading-relaxed animate-fade-in-up">
                  {heroSlides[currentSlide].description}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                className="btn-premium group"
                onClick={() => window.location.href = '/products'}
              >
                <span className="relative z-10">{heroSlides[currentSlide].cta}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                className="relative px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-neutral-700 font-semibold hover:bg-white hover:shadow-premium transition-all duration-300 group"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <span className="relative z-10 flex items-center">
                  {isPlaying ? 'Pause' : 'Play'} Demo
                  <Play className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Features */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {heroSlides[currentSlide].features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-warm transition-all duration-300">
                    {index === 0 && <Truck className="w-5 h-5 text-white" />}
                    {index === 1 && <Star className="w-5 h-5 text-white" />}
                    {index === 2 && <Zap className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors duration-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-2xl font-display text-gradient font-bold">10K+</div>
                <div className="text-sm text-neutral-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display text-gradient font-bold">500+</div>
                <div className="text-sm text-neutral-600">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display text-gradient font-bold">99%</div>
                <div className="text-sm text-neutral-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative animate-fade-in-right">
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-warm rounded-full opacity-30 animate-float"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-sunset rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-12 w-16 h-16 bg-gradient-fire rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 -left-8 w-12 h-12 bg-gradient-primary rounded-full opacity-25 animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 -right-4 w-8 h-8 bg-gradient-rose rounded-full opacity-20 animate-float" style={{ animationDelay: '1.5s' }}></div>

            {/* Main Image Container */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 p-8">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl transition-all duration-700 ease-out hover:scale-105"
                />
                
                {/* Overlay Elements */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-700 shadow-lg">
                    Premium Quality
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-700 shadow-lg">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    4.9/5 Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

                  {/* Navigation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white shadow-lg scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Previous slide"
                title="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
                aria-label="Next slide"
                title="Next slide"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-12 border-2 border-neutral-400 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-gradient-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
