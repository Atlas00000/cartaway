"use client";

import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Eye, Zap, Shield, Truck } from 'lucide-react';
import { Product } from '@/lib/types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  loading = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  const calculateDiscount = () => {
    if (!product.compare_price) return 0;
    const currentPrice = parseFloat(product.price);
    const comparePrice = parseFloat(product.compare_price);
    return Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const discount = calculateDiscount();

  return (
    <div 
      className="group relative bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/products/${product.id}`}
    >
      {/* Product Image Container */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            -{discount}%
          </div>
        )}

        {/* Product Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          {product.is_featured ? 'Featured' : 'New'}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={handleWishlistClick}
            className={`w-10 h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
              isWishlisted 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl'
            }`}
            aria-label="Add to wishlist"
            title="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickViewClick}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-700"
            aria-label="Quick view"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={handleQuickViewClick}
            className="bg-white/90 backdrop-blur-sm border border-white/30 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-sm text-gray-500 mb-2 font-medium">{product.category.name}</p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2 font-medium">(4.8)</span>
          <span className="text-sm text-gray-400 ml-2">• 1.2k reviews</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="text-sm text-gray-500 line-through font-medium">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center text-xs text-green-600 font-medium mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          In Stock • Free Shipping
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCartClick}
            loading={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold hover:shadow-lg transition-all duration-300 group"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Add to Cart
          </Button>
          <Button 
            onClick={handleWishlistClick}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300"
            size="sm"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Product Features */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Free Shipping
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              30-Day Returns
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Secure Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
