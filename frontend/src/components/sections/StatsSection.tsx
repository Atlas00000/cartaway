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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            CartAway by the Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of customers worldwide. Our commitment to quality 
            and service speaks through our achievements.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                <item.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {item.value}
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {item.label}
                </div>
                <div className="text-sm text-gray-500">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600 mb-2">99.9%</div>
              <div className="text-gray-700 font-medium">Uptime</div>
              <div className="text-sm text-gray-500">Reliable service</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600 mb-2">4.9/5</div>
              <div className="text-gray-700 font-medium">Customer Rating</div>
              <div className="text-sm text-gray-500">Based on reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Support</div>
              <div className="text-sm text-gray-500">Always available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
