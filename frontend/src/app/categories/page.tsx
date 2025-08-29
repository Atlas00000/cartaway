"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Star, Sparkles, TrendingUp, Zap, Crown, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Category, Product } from '@/lib/types';
import { api } from '@/lib/api/client';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());

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

  const handleCategoryHover = (categoryId: number) => {
    setHoveredCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const handleQuickView = (categoryId: number) => {
    setSelectedCategories(prev => new Set([...prev, categoryId]));
    setTimeout(() => setSelectedCategories(prev => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    }), 2000);
  };

  const getCategoryIcon = (categoryName: string) => {
    const icons = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Home & Garden': '🏠',
      'Sports': '⚽',
      'Books': '📚',
      'Beauty': '💄',
      'Toys': '🎮',
      'Food': '🍎',
      'Health': '💊',
      'Automotive': '🚗',
      'default': '📦'
    };
    return icons[categoryName as keyof typeof icons] || icons.default;
  };

  const getCategoryBadge = (index: number) => {
    const badges = [
      { type: 'trending', text: 'Trending', color: 'bg-gradient-fire text-white', icon: TrendingUp },
      { type: 'popular', text: 'Popular', color: 'bg-gradient-warm text-white', icon: Crown },
      { type: 'new', text: 'New', color: 'bg-gradient-sunset text-white', icon: Sparkles },
      { type: 'hot', text: 'Hot', color: 'bg-gradient-rose text-white', icon: Zap }
    ];
    return badges[index % badges.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-orange-50 via-white to-warm-rose-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-6 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-neutral-200 rounded-lg w-1/3 shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-video bg-neutral-200 rounded-lg shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded shimmer"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3 shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-orange-50 via-white to-warm-rose-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-6 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-rose opacity-7 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow-warm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-display text-gradient-warm">Product Categories</h1>
          </div>
                      <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
              Explore our curated collection of premium products organized by category. 
              Find exactly what you&apos;re looking for with our comprehensive catalog.
            </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-warm mb-1">{categories.length}</div>
              <div className="text-sm text-neutral-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-fire mb-1">500+</div>
              <div className="text-sm text-neutral-600">Products</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-sunset mb-1">24h</div>
              <div className="text-sm text-neutral-600">Fast Delivery</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-rose mb-1">4.9★</div>
              <div className="text-sm text-neutral-600">Rating</div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-fire rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-warm">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="text-neutral-500 mb-6 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const badge = getCategoryBadge(index);
              const isHovered = hoveredCategory === category.id;
              const isSelected = selectedCategories.has(category.id);
              
              return (
                <div
                  key={category.id}
                  className="group relative"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link href={`/categories/${category.slug}`} className="block">
                    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden hover-lift transition-all duration-500 ${
                      isSelected ? 'ring-2 ring-warm-orange-500 shadow-glow-warm' : ''
                    }`}>
                      {/* Category Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-warm-orange-100 to-warm-rose-100 flex items-center justify-center overflow-hidden">
                        <div className={`text-6xl transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
                          {getCategoryIcon(category.name)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm ${badge.color} flex items-center gap-1`}>
                          <badge.icon className="w-3 h-3" />
                          {badge.text}
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-display text-neutral-900 group-hover:text-warm-orange-600 transition-colors">
                            {category.name}
                          </h3>
                          <ArrowRight className={`w-5 h-5 text-neutral-400 group-hover:text-warm-orange-600 transition-all duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`} />
                        </div>
                        
                        <p className="text-neutral-600 mb-4 line-clamp-2">
                          {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <Package className="w-4 h-4" />
                            <span>{category.product_count || 0} products</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warm-amber-500 fill-current" />
                            <span className="text-sm text-neutral-500">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Quick Action Buttons */}
                  <div className={`absolute top-2 right-2 flex gap-2 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickView(category.id);
                      }}
                      className="p-2 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform duration-300"
                      aria-label="Quick view"
                      title="Quick view"
                    >
                      <Eye className="w-4 h-4 text-neutral-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickView(category.id);
                      }}
                      className="p-2 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform duration-300"
                      aria-label="Add to wishlist"
                      title="Add to wishlist"
                    >
                      <Heart className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-warm">
              <span className="text-3xl">📂</span>
            </div>
            <div className="text-neutral-500 mb-6 text-lg">No categories available</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Enhanced Featured Categories Section */}
        {categories.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-fire rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-3xl font-display text-gradient-fire">Featured Categories</h2>
              </div>
              <p className="text-lg text-neutral-600">Discover our most popular product categories</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {categories.slice(0, 4).map((category, index) => {
                const isHovered = hoveredCategory === category.id;
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group block"
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden hover-lift transition-all duration-300">
                      <div className="flex">
                        {/* Category Image */}
                        <div className="relative w-48 h-32 bg-gradient-to-br from-warm-orange-100 to-warm-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <div className={`text-4xl transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
                            {getCategoryIcon(category.name)}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Category Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-display text-neutral-900 group-hover:text-warm-orange-600 transition-colors">
                              {category.name}
                            </h3>
                            <ArrowRight className={`w-4 h-4 text-neutral-400 group-hover:text-warm-orange-600 transition-all duration-300 ${
                              isHovered ? 'translate-x-1' : ''
                            }`} />
                          </div>
                          
                          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                            {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <Package className="w-3 h-3" />
                              <span>{category.product_count || 0} products</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-warm-amber-500 fill-current" />
                              <span className="text-xs text-neutral-500">4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-warm-orange-50 to-warm-rose-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <h3 className="text-3xl font-display text-neutral-900 mb-4">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Browse our complete product catalog or contact our support team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Browse All Products
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white border border-warm-orange-200 text-neutral-700 font-semibold rounded-xl hover:bg-warm-orange-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
