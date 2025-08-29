"use client";

import React from 'react';
import { Zap, Star, Shield, TrendingUp, Award, Clock, Users, Globe, Heart, CheckCircle } from 'lucide-react';

interface StatsSectionProps {
  stats?: {
    support: string;
    customerRating: string;
    uptime: string;
    satisfaction: string;
    responseTime: string;
    globalReach: string;
  };
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const defaultStats = {
    support: '24/7',
    customerRating: '4.9/5',
    uptime: '99.9%',
    satisfaction: '98%',
    responseTime: '<2min',
    globalReach: '50+',
  };

  const currentStats = stats || defaultStats;

  const mainStats = [
    {
      icon: Zap,
      label: 'Support',
      value: currentStats.support,
      description: 'Always here to help',
      badge: 'Live Chat',
      badgeColor: 'bg-green-500',
      gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      icon: Star,
      label: 'Customer Rating',
      value: currentStats.customerRating,
      description: 'Excellent satisfaction',
      badge: 'Top Rated',
      badgeColor: 'bg-yellow-500',
      gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    },
    {
      icon: Shield,
      label: 'Uptime',
      value: currentStats.uptime,
      description: 'Reliable service',
      badge: 'Guaranteed',
      badgeColor: 'bg-blue-500',
      gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
  ];

  const additionalStats = [
    {
      icon: Heart,
      label: 'Satisfaction',
      value: currentStats.satisfaction,
      description: 'Happy customers',
      color: 'text-pink-600',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: currentStats.responseTime,
      description: 'Average support',
      color: 'text-purple-600',
    },
    {
      icon: Globe,
      label: 'Global Reach',
      value: `${currentStats.globalReach} countries`,
      description: 'Worldwide service',
      color: 'text-indigo-600',
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Best E-commerce Platform 2024',
      description: 'Recognized for excellence in customer service',
    },
    {
      icon: TrendingUp,
      title: '99.9% Customer Satisfaction',
      description: 'Consistently high ratings across all platforms',
    },
    {
      icon: CheckCircle,
      title: 'ISO 27001 Certified',
      description: 'Highest security standards for data protection',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-fire opacity-8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20 animate-fade-in-down">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-5xl lg:text-6xl font-display text-neutral-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            CartAway by the Numbers
          </h2>
          <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Trusted by thousands of customers worldwide. Our commitment to quality, security, and exceptional service speaks through our achievements.
          </p>
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainStats.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              <div className={`absolute -top-3 -right-3 ${item.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                {item.badge}
              </div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-glow transition-all duration-300 group-hover:scale-110 ${item.gradient}`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 bg-gradient-primary"></div>
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <div className="text-4xl font-display text-gradient font-bold">{item.value}</div>
                <div className="text-xl font-heading text-neutral-800 font-semibold">{item.label}</div>
                <div className="text-sm text-neutral-500">{item.description}</div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Additional Stats Row */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalStats.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <div className="text-2xl font-display text-gradient font-bold mb-2">{item.value}</div>
                <div className="text-lg font-heading text-neutral-800 mb-1">{item.label}</div>
                <div className="text-sm text-neutral-500">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-display text-neutral-900 mb-4">Our Achievements</h3>
          <p className="text-lg text-neutral-600 mb-8">Recognized excellence in the industry</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-heading text-neutral-900 mb-2 font-semibold">{achievement.title}</h4>
              <p className="text-sm text-neutral-600">{achievement.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Ready to Experience Excellence?</h3>
            <p className="text-lg text-neutral-600 mb-6">Join thousands of satisfied customers who trust CartAway</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-premium group">
                <span className="relative z-10">Start Shopping</span>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
              </button>
              <button className="relative px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-neutral-700 font-semibold hover:bg-white hover:shadow-premium transition-all duration-300 group">
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
