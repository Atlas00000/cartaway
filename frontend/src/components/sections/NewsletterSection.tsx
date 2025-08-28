"use client";

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-warm-orange-50 to-warm-rose-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-sunset opacity-10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6 animate-fade-in-down">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Welcome to CartAway!
          </h2>
          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
            Thank you for subscribing to our newsletter. You'll be the first to know about our latest products, 
            exclusive offers, and premium shopping experiences.
          </p>
          <button
            onClick={() => setIsSubscribed(false)}
            className="relative px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-neutral-700 font-semibold hover:bg-white hover:shadow-premium transition-all duration-300 group"
          >
            <span className="relative z-10">Subscribe Another Email</span>
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-warm-orange-50 to-warm-rose-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-sunset opacity-10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-6 animate-fade-in-down">
          <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow">
            <Mail className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
          Stay in the Loop
        </h2>
        <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Subscribe to our newsletter and be the first to discover new products, exclusive offers, 
          and premium shopping experiences. No spam, just luxury.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-300 placeholder-neutral-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-neutral-500 mt-4">
          By subscribing, you agree to our{' '}
          <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
            Terms of Service
          </a>
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
            Exclusive offers
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
            New product alerts
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
            Premium content
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
