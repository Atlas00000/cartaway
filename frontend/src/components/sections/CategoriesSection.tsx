"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, Smartphone, Shirt, Home, Heart, BookOpen, Zap } from 'lucide-react';
import { Category } from '@/lib/types';
import { api } from '@/lib/api/client';
import Button from '@/components/ui/Button';

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.getCategories();
        setCategories(response.results || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Icon mapping for categories
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronics') || name.includes('phone')) return Smartphone;
    if (name.includes('fashion') || name.includes('clothing')) return Shirt;
    if (name.includes('home') || name.includes('garden')) return Home;
    if (name.includes('sports') || name.includes('outdoor')) return Heart;
    if (name.includes('book') || name.includes('media')) return BookOpen;
    return Zap; // Default icon
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Explore our curated collections
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections designed to elevate your lifestyle
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <div
                  key={category.id}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/category/${category.slug}`}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
                        <IconComponent className="h-8 w-8 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {category.product_count} products
                    </p>
                    <div className="flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No categories available</div>
            <Button onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        )}

        {/* View All Categories Button */}
        {categories.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="group">
              View All Categories
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
