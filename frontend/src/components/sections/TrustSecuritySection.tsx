"use client";

import React from 'react';
import { Shield, Lock, CreditCard, Truck, Award, Users } from 'lucide-react';

const TrustSecuritySection = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: 'SSL Secure',
      description: '256-bit encryption protects your data',
      color: 'text-success-500',
      bgColor: 'bg-success-50',
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'Your information is never shared',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Multiple payment options available',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50',
      color: 'text-warm-orange-600',
      bgColor: 'bg-warm-orange-50',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '30-day money-back guarantee',
      color: 'text-warm-amber-600',
      bgColor: 'bg-warm-amber-50',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Expert customer service team',
      color: 'text-warm-rose-600',
      bgColor: 'bg-warm-rose-50',
    },
  ];

  const securityStats = [
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '256-bit', label: 'SSL Encryption' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-warm opacity-5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Trust & Security
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Your security and trust are our top priorities. We use industry-leading 
            security measures to protect your data and ensure safe shopping.
          </p>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {securityStats.map((stat, index) => (
            <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-3xl font-display text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-neutral-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="card-premium hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 shadow-glow`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-heading text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="mt-12 pt-12 border-t border-neutral-200">
          <div className="text-center">
            <h3 className="text-xl font-heading text-neutral-900 mb-6">
              Security Certifications
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg shadow-glow">
                <Shield className="w-5 h-5 text-success-500" />
                <span className="text-sm font-medium text-neutral-700">SSL Certified</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg shadow-glow">
                <Lock className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-neutral-700">PCI Compliant</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg shadow-glow">
                <Award className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-neutral-700">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg shadow-glow">
                <Users className="w-5 h-5 text-warm-rose-600" />
                <span className="text-sm font-medium text-neutral-700">Trusted by 10K+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 mb-4">
            Still have questions about our security measures?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/security"
              className="relative px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-neutral-700 font-semibold hover:bg-white hover:shadow-premium transition-all duration-300 group"
            >
              <span className="relative z-10">Learn More About Security</span>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
            </a>
            <a
              href="/contact"
              className="btn-premium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;
