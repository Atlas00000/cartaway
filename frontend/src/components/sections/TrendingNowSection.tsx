"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Eye, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { api } from '@/lib/api/client';

const TrendingNowSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getBestsellers();
        setProducts(response.results || []);
      } catch (err) {
        console.error('Error fetching trending products:', err);
        setError('Failed to load trending products');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  // Auto-rotate featured product
  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % Math.min(products.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [products.length]);

  const handleAddToCart = async (productId: number) => {
    try {
      await api.addToCart(productId, 1);
      console.log('Product added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleAddToWishlist = (productId: number) => {
    console.log('Added to wishlist:', productId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-fire opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm opacity-5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-down">
            <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
              Trending Now
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover what's hot and trending in our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-neutral-200 aspect-square rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-neutral-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-premium"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const featuredProducts = products.slice(0, 3);
  const remainingProducts = products.slice(3, 7);

  return (
    <section className="py-20 bg-gradient-to-br from-warm-rose-50 via-white to-warm-orange-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-fire opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-6 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-rose opacity-7 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-primary opacity-5 rounded-full blur-lg animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-fire rounded-full flex items-center justify-center shadow-glow-warm animate-pulse-slow">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔥</span>
              </div>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Trending Now
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Discover what's hot and trending in our community. These products are flying off the shelves!
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-fire rounded-full animate-pulse"></div>
              Hot Right Now
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-warm rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              Fast Selling
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-sunset rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              Customer Favorites
            </span>
          </div>
        </div>

        {/* Enhanced Featured Product Carousel */}
        {featuredProducts.length > 0 && (
          <div className="mb-20">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-glow-warm">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <div className="relative h-full bg-gradient-to-br from-warm-orange-100 via-white to-warm-rose-100 p-8 lg:p-12">
                    <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
                      {/* Enhanced Product Info */}
                      <div className="space-y-6 animate-fade-in-left">
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 bg-gradient-fire text-white text-sm font-semibold rounded-full shadow-glow-warm">
                            #{index + 1} Trending
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < 4 ? 'text-warm-amber-500 fill-current' : 'text-neutral-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-neutral-500 ml-2">(4.8)</span>
                          </div>
                        </div>
                        
                        <h3 className="text-3xl lg:text-4xl font-display text-neutral-900 leading-tight">
                          {product.name}
                        </h3>
                        
                        <p className="text-lg text-neutral-600 leading-relaxed">
                          {product.short_description || product.description.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-display text-gradient-warm">
                            ${product.price}
                          </div>
                          {product.compare_price && product.compare_price > product.price && (
                            <div className="text-lg text-neutral-500 line-through">
                              ${product.compare_price}
                            </div>
                          )}
                          <div className="px-3 py-1 bg-gradient-sunset text-white text-sm font-semibold rounded-full">
                            Save ${product.compare_price && product.compare_price > product.price ? Math.round(product.compare_price - product.price) : 20}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleAddToCart(product.id)}
                            className="relative px-8 py-4 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 group hover-lift"
                          >
                            <span className="relative z-10 flex items-center">
                              <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                              Add to Cart
                            </span>
                          </button>
                          <button 
                            onClick={() => handleAddToWishlist(product.id)}
                            aria-label="Add to wishlist"
                            title="Add to wishlist"
                            className="relative p-4 text-neutral-700 hover:text-warm-rose-600 transition-all duration-300 group hover-lift"
                          >
                            <Heart className="w-6 h-6 group-hover:fill-warm-rose-500 group-hover:stroke-warm-rose-500 transition-all duration-300" />
                            <div className="absolute inset-0 bg-gradient-rose opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Enhanced Product Image */}
                      <div className="relative animate-fade-in-right">
                        <div className="relative w-full h-80 lg:h-96">
                          <div className="absolute inset-0 bg-gradient-fire opacity-20 rounded-2xl blur-2xl animate-pulse-slow"></div>
                          <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-premium hover-lift">
                            <div className="text-6xl animate-bounce-slow">🛍️</div>
                          </div>
                        </div>
                        
                        {/* Enhanced Floating Elements */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-warm rounded-full opacity-60 animate-float"></div>
                        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-sunset rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-rose rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Enhanced Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    title={`Go to slide ${index + 1}`}
                    className={`w-4 h-4 rounded-full transition-all duration-300 hover-lift ${
                      index === activeIndex 
                        ? 'bg-gradient-fire scale-125 shadow-glow-warm' 
                        : 'bg-neutral-300 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Remaining Trending Products */}
        {remainingProducts.length > 0 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {remainingProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group cursor-pointer animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-white/30 p-6 transition-all duration-300 group-hover:shadow-glow-warm">
                    {/* Enhanced Product Image */}
                    <div className="relative mb-4">
                      <div className="aspect-square bg-gradient-to-br from-warm-orange-50 to-warm-rose-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl animate-bounce-slow">📦</div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product.id);
                          }}
                          aria-label="Add to wishlist"
                          title="Add to wishlist"
                          className="relative p-2 text-neutral-400 hover:text-warm-rose-600 transition-all duration-300 group-hover:scale-110"
                        >
                          <Heart className="w-5 h-5 group-hover:fill-warm-rose-500 group-hover:stroke-warm-rose-500 transition-all duration-300" />
                          <div className="absolute inset-0 bg-gradient-rose opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                        </button>
                      </div>
                      {/* Trending Badge */}
                      <div className="absolute top-2 left-2">
                        <div className="px-2 py-1 bg-gradient-fire text-white text-xs font-semibold rounded-full">
                          🔥 Hot
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Product Info */}
                    <div className="space-y-3">
                      <h3 className="font-heading text-neutral-900 group-hover:text-warm-orange-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-display text-gradient-warm">
                          ${product.price}
                        </div>
                        {product.compare_price && product.compare_price > product.price && (
                          <div className="text-sm text-neutral-500 line-through">
                            ${product.compare_price}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < 4 ? 'text-warm-amber-500 fill-current' : 'text-neutral-300'}`} 
                            />
                          ))}
                          <span className="text-xs text-neutral-500 ml-1">(4.6)</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          aria-label="Add to cart"
                          title="Add to cart"
                          className="relative p-2 text-neutral-400 hover:text-warm-orange-600 transition-all duration-300 group-hover:scale-110"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <div className="absolute inset-0 bg-gradient-warm opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced View All Button */}
            <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button className="relative px-10 py-4 bg-gradient-sunset text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 group hover-lift">
                <span className="relative z-10 flex items-center">
                  View All Trending Products
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Trending Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-fire mb-2">🔥</div>
            <div className="text-2xl font-display text-gradient-fire mb-2">{products.length}</div>
            <div className="text-sm text-neutral-600">Trending Items</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-warm mb-2">⚡</div>
            <div className="text-2xl font-display text-gradient-warm mb-2">2.5k</div>
            <div className="text-sm text-neutral-600">Views Today</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-sunset mb-2">💎</div>
            <div className="text-2xl font-display text-gradient-sunset mb-2">98%</div>
            <div className="text-sm text-neutral-600">Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-rose mb-2">🚀</div>
            <div className="text-2xl font-display text-gradient-rose mb-2">24h</div>
            <div className="text-sm text-neutral-600">Fast Shipping</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingNowSection;
