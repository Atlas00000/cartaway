"use client";

import React, { useState } from 'react';
import { Crown, Sparkles, Star, ArrowRight, CheckCircle, Clock, Shield, Truck } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: string;
  duration: string;
  icon: React.ComponentType<any>;
  gradient: string;
  popular?: boolean;
}

const LuxuryServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      name: "Personal Shopping Assistant",
      description: "Get personalized shopping recommendations from our expert stylists who understand your unique style and preferences.",
      features: [
        "One-on-one consultation with expert stylist",
        "Personalized product recommendations",
        "Style analysis and wardrobe planning",
        "Priority customer support",
        "Exclusive access to new arrivals"
      ],
      price: "From $99",
      duration: "2-4 hours",
      icon: Crown,
      gradient: "bg-gradient-to-br from-warm-amber-50 to-warm-orange-50",
      popular: true
    },
    {
      id: 2,
      name: "VIP Concierge Service",
      description: "Experience the ultimate in luxury shopping with our dedicated VIP concierge service for high-end clients.",
      features: [
        "Dedicated personal concierge",
        "24/7 priority support",
        "Exclusive VIP events access",
        "Custom gift wrapping",
        "White-glove delivery service"
      ],
      price: "From $299",
      duration: "24/7",
      icon: Sparkles,
      gradient: "bg-gradient-to-br from-warm-rose-50 to-accent-50"
    },
    {
      id: 3,
      name: "Premium Gift Curation",
      description: "Let us curate the perfect gift for any occasion with our premium gift curation service.",
      features: [
        "Personalized gift selection",
        "Custom gift wrapping",
        "Handwritten note included",
        "Gift tracking and delivery",
        "Recipient feedback collection"
      ],
      price: "From $149",
      duration: "1-2 days",
      icon: Star,
      gradient: "bg-gradient-to-br from-primary-50 to-warm-amber-50"
    },
    {
      id: 4,
      name: "Luxury Home Delivery",
      description: "Experience white-glove delivery service with our luxury home delivery option.",
      features: [
        "White-glove delivery service",
        "Scheduled delivery windows",
        "In-home setup and installation",
        "Packaging removal",
        "Delivery confirmation photos"
      ],
      price: "From $79",
      duration: "Same day - 2 days",
      icon: Truck,
      gradient: "bg-gradient-to-br from-warm-orange-50 to-warm-rose-50"
    }
  ];

  const handleServiceClick = (serviceId: number) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-sunset opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-fire opacity-10 rounded-full blur-xl animate-float"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Luxury Services
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Experience the pinnacle of luxury shopping with our exclusive services designed to elevate your shopping experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group cursor-pointer animate-fade-in-up hover-lift transition-all duration-500 ${
                selectedService === service.id ? 'scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className={`relative overflow-hidden rounded-2xl ${service.gradient} p-8 transition-all duration-300 group-hover:shadow-premium`}>
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-gradient-fire text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Service Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-warm transition-all duration-300">
                    <service.icon className="w-8 h-8 text-neutral-700" />
                  </div>
                </div>
                
                {/* Service Info */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-display text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {service.name}
                  </h3>
                  
                  <p className="text-neutral-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Price and Duration */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-display text-gradient">
                      {service.price}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className={`space-y-3 transition-all duration-500 ${
                    selectedService === service.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <div className="pt-4 border-t border-white/30">
                      <h4 className="text-sm font-semibold text-neutral-700 mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3 text-sm text-neutral-600">
                            <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className={`transition-all duration-500 ${
                    selectedService === service.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    <button className="btn-premium group w-full">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  {/* Expand/Collapse Indicator */}
                  <div className="flex items-center justify-center pt-4">
                    <div className={`w-6 h-6 rounded-full border-2 border-neutral-400 flex items-center justify-center transition-all duration-300 ${
                      selectedService === service.id ? 'rotate-180 bg-gradient-warm border-transparent' : ''
                    }`}>
                      <ArrowRight className={`w-3 h-3 text-neutral-600 transition-all duration-300 ${
                        selectedService === service.id ? 'text-white rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-warm rounded-full opacity-30 animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-sunset rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display text-neutral-900 mb-4">
                  Why Choose Our Luxury Services?
                </h3>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  Experience unparalleled service quality and attention to detail that sets us apart from the rest.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0s' }}>
                  <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-rose transition-all duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-heading text-neutral-900 mb-2">Premium Quality</h4>
                  <p className="text-neutral-600">Every service is delivered with the highest standards of quality and attention to detail.</p>
                </div>
                
                <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-warm transition-all duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-heading text-neutral-900 mb-2">24/7 Support</h4>
                  <p className="text-neutral-600">Round-the-clock support to ensure your needs are met whenever you need us.</p>
                </div>
                
                <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="w-16 h-16 bg-gradient-fire rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-accent transition-all duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-heading text-neutral-900 mb-2">Exclusive Access</h4>
                  <p className="text-neutral-600">Get exclusive access to premium products and services not available to regular customers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button className="btn-premium group">
            Explore All Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LuxuryServicesSection;
