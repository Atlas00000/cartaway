"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, Heart, ShoppingCart, Star, TrendingUp, Crown, Quote } from 'lucide-react';
import { Product } from '@/lib/types';
import { api } from '@/lib/api/client';

const MobileOptimizedSections: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const featuredResponse = await api.getFeaturedProducts();
        setFeaturedProducts(featuredResponse.results?.slice(0, isMobile ? 4 : 6) || []);
        
        const trendingResponse = await api.getBestsellers();
        setTrendingProducts(trendingResponse.results?.slice(0, isMobile ? 4 : 6) || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMobile]);

  const handleAddToCart = (productId: number) => {
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId: number) => {
    console.log('Add to wishlist:', productId);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Hero Section */}
        <section className="relative bg-mesh overflow-hidden min-h-[70vh] flex items-center">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-5 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute top-20 right-5 w-40 h-40 bg-gradient-warm opacity-10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative w-full px-4 py-8">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-display text-neutral-900 leading-tight">
                Discover
                <span className="block text-gradient">CartAway</span>
                <span className="text-lg font-heading text-neutral-600">Premium Shopping</span>
              </h1>
              
              <p className="text-base text-neutral-600 max-w-sm mx-auto">
                Experience luxury shopping with curated products and exceptional service.
              </p>

              <div className="flex flex-col space-y-3">
                <button className="btn-premium group w-full">
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                
                <button className="px-6 py-3 bg-white/90 border border-white/30 rounded-xl text-neutral-700 font-semibold w-full">
                  Explore Categories
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Featured Products */}
        <section className="py-8 bg-white">
          <div className="px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display text-neutral-900 mb-2">Featured Products</h2>
              <p className="text-neutral-600">Handpicked for you</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-neutral-200 aspect-square rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-neutral-200 rounded"></div>
                      <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg bg-white border border-neutral-200 p-3">
                      <div className="relative mb-3">
                        <div className="aspect-square bg-gradient-to-br from-warm-orange-50 to-warm-rose-50 rounded-lg flex items-center justify-center">
                          <div className="text-3xl">📦</div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm"
                          aria-label="Add to wishlist"
                          title="Add to wishlist"
                        >
                          <Heart className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-neutral-900 text-sm line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-display text-gradient">
                            ${product.price}
                          </div>
                          {product.compare_price && product.compare_price > product.price && (
                            <div className="text-sm text-neutral-500 line-through">
                              ${product.compare_price}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          className="w-full px-3 py-2 bg-gradient-primary text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Mobile Stats */}
        <section className="py-8 bg-gradient-to-br from-neutral-50 to-white">
          <div className="px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display text-neutral-900 mb-2">CartAway by the Numbers</h2>
              <p className="text-neutral-600">Trusted by thousands worldwide</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-display text-gradient mb-1">1,000+</div>
                <div className="text-sm text-neutral-600">Products</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-display text-gradient mb-1">5,000+</div>
                <div className="text-sm text-neutral-600">Orders</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-display text-gradient mb-1">10,000+</div>
                <div className="text-sm text-neutral-600">Customers</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-display text-gradient mb-1">4.9/5</div>
                <div className="text-sm text-neutral-600">Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Newsletter */}
        <section className="py-8 bg-gradient-to-r from-warm-orange-50 to-warm-rose-50">
          <div className="px-4 text-center">
            <h2 className="text-2xl font-display text-neutral-900 mb-3">Stay in the Loop</h2>
            <p className="text-neutral-600 mb-6">
              Subscribe for exclusive offers and updates
            </p>
            
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-xs text-neutral-500 mt-3">
              No spam, just luxury updates
            </p>
          </div>
        </section>
      </>
    );
  }

  // Desktop sections remain the same
  return null;
};

export default MobileOptimizedSections;
