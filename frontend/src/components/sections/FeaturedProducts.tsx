"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { api } from '@/lib/api/client';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getFeaturedProducts();
        setProducts(response.results || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      setCartLoading(productId);
      await api.addToCart(productId, 1);
      // You could add a toast notification here
      console.log('Product added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setCartLoading(null);
    }
  };

  const handleAddToWishlist = (productId: number) => {
    // Implement wishlist functionality
    console.log('Added to wishlist:', productId);
  };

  const handleQuickView = (productId: number) => {
    // Implement quick view functionality
    console.log('Quick view:', productId);
    // You could open a modal here
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-warm opacity-5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-fire opacity-5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center shadow-glow-warm">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked collection of premium products, carefully curated for your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-2xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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
      <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="text-red-600 mb-4 text-lg">{error}</div>
          <Button onClick={() => window.location.reload()} className="bg-gradient-warm text-white">
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-warm opacity-5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-fire opacity-5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center shadow-glow-warm">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover our handpicked collection of premium products, carefully curated for quality and style
          </p>
          <Button 
            className="group bg-gradient-warm text-white hover:shadow-glow-warm transition-all duration-300"
            onClick={() => window.location.href = '/products'}
          >
            <span className="relative z-10 flex items-center">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>

        {/* Enhanced Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up hover-lift group" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={handleQuickView}
                  loading={cartLoading === product.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📦</span>
            </div>
            <div className="text-neutral-500 mb-6 text-lg">No featured products available</div>
            <Button onClick={() => window.location.reload()} className="bg-gradient-warm text-white">
              Refresh
            </Button>
          </div>
        )}

        {/* Enhanced View More Button */}
        {products.length > 0 && (
          <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              className="group bg-gradient-fire text-white hover:shadow-glow-warm transition-all duration-300 hover-lift"
              onClick={() => window.location.href = '/products'}
            >
              <span className="relative z-10 flex items-center">
                Load More Products
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        )}

        {/* Interactive Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-warm mb-2">{products.length}</div>
            <div className="text-sm text-neutral-600">Featured Items</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-fire mb-2">24h</div>
            <div className="text-sm text-neutral-600">Fast Delivery</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-sunset mb-2">4.9★</div>
            <div className="text-sm text-neutral-600">Customer Rating</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
            <div className="text-3xl font-display text-gradient-rose mb-2">100%</div>
            <div className="text-sm text-neutral-600">Secure Payment</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
