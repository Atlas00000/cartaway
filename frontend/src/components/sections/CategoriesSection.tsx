"use client";

import React, { useState } from 'react';
import { ArrowRight, Star, TrendingUp, Sparkles, Heart, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

const CategoriesSection: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = [
    {
      id: 1,
      name: "Electronics",
      icon: "⚡",
      count: "2.4k items",
      description: "Cutting-edge technology and smart devices",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      trending: true,
      featured: false,
      products: ["Smartphones", "Laptops", "Headphones", "Smart Watches"]
    },
    {
      id: 2,
      name: "Fashion",
      icon: "👔",
      count: "1.8k items",
      description: "Trendsetting fashion and accessories",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      trending: false,
      featured: true,
      products: ["Clothing", "Shoes", "Bags", "Jewelry"]
    },
    {
      id: 3,
      name: "Home & Living",
      icon: "🏠",
      count: "3.2k items",
      description: "Transform your living space",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      trending: true,
      featured: false,
      products: ["Furniture", "Decor", "Kitchen", "Bedding"]
    },
    {
      id: 4,
      name: "Sports & Fitness",
      icon: "🏃",
      count: "1.1k items",
      description: "Active lifestyle and wellness",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      trending: false,
      featured: true,
      products: ["Workout Gear", "Sports Equipment", "Nutrition", "Fitness Tech"]
    },
    {
      id: 5,
      name: "Beauty & Care",
      icon: "💄",
      count: "956 items",
      description: "Premium beauty and personal care",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      trending: true,
      featured: false,
      products: ["Skincare", "Makeup", "Hair Care", "Fragrances"]
    },
    {
      id: 6,
      name: "Books & Media",
      icon: "📚",
      count: "2.7k items",
      description: "Knowledge and entertainment",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      trending: false,
      featured: true,
      products: ["Books", "E-books", "Audiobooks", "Magazines"]
    },
  ];

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Navigate to category page
    window.location.href = `/categories/${categoryId}`;
  };

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-warm opacity-5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore our curated collections across diverse categories, each designed to enhance your lifestyle
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Trending Categories
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Featured Collections
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Premium Quality
            </span>
          </div>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer animate-fade-in-up ${
                selectedCategory === category.id ? 'ring-2 ring-primary-500' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                {category.trending && (
                  <div className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                )}
                {category.featured && (
                  <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Category Icon */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-warm transition-all duration-300 group-hover:scale-110`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <div className={`absolute -inset-2 bg-gradient-to-r ${category.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300`}></div>
              </div>

              {/* Category Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-display text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Product Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-500">
                    {category.count}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-neutral-700">4.8</span>
                  </div>
                </div>

                {/* Product Examples */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex flex-wrap gap-2">
                    {category.products.slice(0, 3).map((product, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full hover:bg-neutral-200 transition-colors duration-300"
                      >
                        {product}
                      </span>
                    ))}
                    {category.products.length > 3 && (
                      <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium rounded-full">
                        +{category.products.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    className={`w-full bg-gradient-to-r ${category.color} hover:shadow-lg transition-all duration-300 group`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    <span className="relative z-10">Explore {category.name}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-lg text-neutral-600 mb-6">Browse our complete catalog or get personalized recommendations</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-premium group"
                onClick={() => window.location.href = '/products'}
              >
                <span className="relative z-10">Browse All Products</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white hover:shadow-premium transition-all duration-300"
                onClick={() => window.location.href = '/contact'}
              >
                <span className="relative z-10">Get Recommendations</span>
                <Heart className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
