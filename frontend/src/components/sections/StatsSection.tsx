"use client";

import React from 'react';
import { Users, ShoppingBag, Package, Star } from 'lucide-react';

interface StatsSectionProps {
  stats?: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: string;
  };
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const defaultStats = {
    totalProducts: 1000,
    totalOrders: 5000,
    totalUsers: 10000,
    totalRevenue: '$500K',
  };

  const currentStats = stats || defaultStats;

  const statItems = [
    {
      icon: ShoppingBag,
      label: 'Products',
      value: currentStats.totalProducts.toLocaleString(),
      description: 'Curated items',
    },
    {
      icon: Package,
      label: 'Orders',
      value: currentStats.totalOrders.toLocaleString(),
      description: 'Delivered successfully',
    },
    {
      icon: Users,
      label: 'Customers',
      value: currentStats.totalUsers.toLocaleString(),
      description: 'Happy shoppers',
    },
    {
      icon: Star,
      label: 'Revenue',
      value: currentStats.totalRevenue,
      description: 'Total sales',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm opacity-5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-down">
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">CartAway by the Numbers</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Trusted by thousands of customers worldwide. Our commitment to quality and service speaks through our achievements.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="text-center group hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-glow transition-all duration-300 group-hover:scale-110 ${
                  index === 0 ? 'bg-gradient-primary group-hover:shadow-glow-warm' :
                  index === 1 ? 'bg-gradient-warm group-hover:shadow-glow-rose' :
                  index === 2 ? 'bg-gradient-sunset group-hover:shadow-glow-accent' :
                  'bg-gradient-fire group-hover:shadow-glow-warm'
                }`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className={`absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 ${
                  index === 0 ? 'bg-gradient-primary' :
                  index === 1 ? 'bg-gradient-warm' :
                  index === 2 ? 'bg-gradient-sunset' :
                  'bg-gradient-fire'
                }`}></div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-display text-gradient">{item.value}</div>
                <div className="text-xl font-heading text-neutral-800">{item.label}</div>
                <div className="text-sm text-neutral-500">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { number: '99.9%', label: 'Uptime', subtitle: 'Reliable service' },
                { number: '4.9/5', label: 'Customer Rating', subtitle: 'Based on reviews' },
                { number: '24/7', label: 'Support', subtitle: 'Always available' }
              ].map((metric, index) => (
                <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-3xl font-display text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
                    {metric.number}
                  </div>
                  <div className="text-lg font-heading text-neutral-800 mb-2">{metric.label}</div>
                  <div className="text-sm text-neutral-500">{metric.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
