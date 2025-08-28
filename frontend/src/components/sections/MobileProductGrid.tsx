"use client";

import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';

interface MobileProductGridProps {
  products: Product[];
  title: string;
  subtitle?: string;
  loading?: boolean;
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({
  products,
  title,
  subtitle,
  loading = false
}) => {
  const handleAddToCart = (productId: number) => {
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId: number) => {
    console.log('Add to wishlist:', productId);
  };

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display text-neutral-900 mb-2">{title}</h2>
            {subtitle && <p className="text-neutral-600">{subtitle}</p>}
          </div>
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display text-neutral-900 mb-2">{title}</h2>
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer animate-fade-in-up hover-lift"
            >
              <div className="relative overflow-hidden rounded-lg bg-white border border-neutral-200 p-3 transition-all duration-300 group-hover:shadow-md">
                {/* Product Image */}
                <div className="relative mb-3">
                  <div className="aspect-square bg-gradient-to-br from-warm-orange-50 to-warm-rose-50 rounded-lg flex items-center justify-center">
                    <div className="text-3xl">📦</div>
                  </div>
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm text-neutral-400 hover:text-accent-600 transition-all duration-200"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Discount Badge */}
                  {product.compare_price && product.compare_price > product.price && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-accent text-white text-xs font-semibold rounded-full">
                      {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-neutral-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
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

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < 4 ? 'text-warm-amber-500 fill-current' : 'text-neutral-300'}`} 
                      />
                    ))}
                    <span className="text-xs text-neutral-500 ml-1">(4.0)</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    className="w-full mt-2 px-3 py-2 bg-gradient-primary text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <button className="px-6 py-3 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200 transition-all duration-200">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileProductGrid;
