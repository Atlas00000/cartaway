"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { api } from '@/lib/api/client';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      await api.addToCart(productId, 1);
      // You could add a toast notification here
      console.log('Product added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleAddToWishlist = (productId: number) => {
    // Implement wishlist functionality
    console.log('Added to wishlist:', productId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Discover our handpicked collection of premium products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
      <section className="py-16 bg-gray-50">
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
    <section className="py-20 bg-gradient-to-br from-warm-orange-50 via-white to-warm-rose-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-6 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-rose opacity-7 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-16 animate-fade-in-down">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow-warm">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-display text-neutral-900">
                Featured Products
              </h2>
            </div>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
              Discover our handpicked collection of premium products, carefully curated for your lifestyle
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-warm rounded-full"></div>
                Premium Quality
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-fire rounded-full"></div>
                Fast Delivery
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-sunset rounded-full"></div>
                Secure Payment
              </span>
            </div>
          </div>
          <button className="relative px-8 py-4 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 group mt-6 sm:mt-0 hover-lift">
            <span className="relative z-10 flex items-center">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
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
                <div className="relative">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                  {/* Hover overlay with quick actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </div>
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
            <button className="relative px-10 py-4 bg-gradient-fire text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 group hover-lift">
              <span className="relative z-10 flex items-center">
                Load More Products
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
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
