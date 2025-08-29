"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, TrendingUp, Zap, Crown, Sparkles, ArrowRight, Filter as FilterIcon, X } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { api } from '@/lib/api/client';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.getProducts({
            search: searchTerm,
            category: selectedCategory,
            min_price: priceRange.min,
            max_price: priceRange.max,
            ordering: sortBy,
            page: currentPage
          }),
          api.getCategories()
        ]);
        
        setProducts(productsResponse.results || []);
        setCategories(categoriesResponse.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory, priceRange, sortBy, currentPage]);

  const handleAddToCart = async (productId: number) => {
    try {
      await api.addToCart(productId, 1);
      console.log('Product added to cart');
      // Add visual feedback
      setSelectedProducts(prev => new Set([...prev, productId]));
      setTimeout(() => setSelectedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      }), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleAddToWishlist = (productId: number) => {
    console.log('Added to wishlist:', productId);
    // Add visual feedback
    setSelectedProducts(prev => new Set([...prev, productId]));
    setTimeout(() => setSelectedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    }), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('created_at');
    setCurrentPage(1);
  };

  const getProductBadge = (product: Product) => {
    if (product.compare_price && product.compare_price > product.price) {
      const discount = Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
      return { type: 'discount', text: `${discount}% OFF`, color: 'bg-gradient-fire text-white' };
    }
    if (product.featured) {
      return { type: 'featured', text: 'Featured', color: 'bg-gradient-warm text-white' };
    }
    if (product.is_bestseller) {
      return { type: 'bestseller', text: 'Best Seller', color: 'bg-gradient-sunset text-white' };
    }
    return null;
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-square bg-neutral-200 rounded-lg shimmer"></div>
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
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow-warm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-display text-gradient-warm">All Products</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-6">Discover our complete collection of premium products</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-warm mb-1">{products.length}</div>
              <div className="text-sm text-neutral-600">Total Products</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-fire mb-1">{categories.length}</div>
              <div className="text-sm text-neutral-600">Categories</div>
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

        {/* Enhanced Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/30">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Enhanced Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-warm-orange-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
              />
              <div className="absolute inset-0 bg-gradient-warm opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300"></div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-4 py-3 bg-gradient-warm text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-glow-warm transition-all duration-300"
              >
                <FilterIcon className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Enhanced Filters Row */}
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Category Filter */}
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                  aria-label="Filter by category"
                  title="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 bg-gradient-warm opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Price Range */}
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                />
                <div className="absolute inset-0 bg-gradient-warm opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                />
                <div className="absolute inset-0 bg-gradient-warm opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Sort By */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                  aria-label="Sort products"
                  title="Sort products"
                >
                  <option value="created_at">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                </select>
                <div className="absolute inset-0 bg-gradient-warm opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Enhanced Filter Actions */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleFilterReset}
                className="px-6 py-2 text-neutral-600 hover:text-warm-orange-600 transition-colors flex items-center gap-2 group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Clear Filters
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-warm text-white shadow-glow-warm' 
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-warm text-white shadow-glow-warm' 
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Enhanced Products Grid/List */}
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
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {products.map((product, index) => {
              const badge = getProductBadge(product);
              const isSelected = selectedProducts.has(product.id);
              
              return (
                <div
                  key={product.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden hover-lift group transition-all duration-500 ${
                    viewMode === 'list' ? 'flex' : ''
                  } ${isSelected ? 'ring-2 ring-warm-orange-500 shadow-glow-warm' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Enhanced Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <div className="aspect-square bg-gradient-to-br from-warm-orange-50 to-warm-rose-50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-500">📦</div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Product Badge */}
                    {badge && (
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm ${badge.color}`}>
                        {badge.text}
                      </div>
                    )}
                    
                    {/* Enhanced Wishlist Button */}
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-all duration-300 hover:scale-110 ${
                        isSelected ? 'bg-gradient-warm text-white' : 'bg-white/90 text-neutral-400 hover:text-warm-orange-500'
                      }`}
                      aria-label="Add to wishlist"
                      title="Add to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isSelected ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Enhanced Product Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-heading text-neutral-900 group-hover:text-warm-orange-600 transition-colors mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {product.short_description || product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
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
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < 4 ? 'text-warm-amber-500 fill-current' : 'text-neutral-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`w-full px-4 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        isSelected 
                          ? 'bg-gradient-fire text-white shadow-glow-warm' 
                          : 'bg-gradient-warm text-white hover:shadow-glow-warm'
                      }`}
                    >
                      <ShoppingCart className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                      {isSelected ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-warm">
              <span className="text-3xl">🔍</span>
            </div>
            <div className="text-neutral-500 mb-6 text-lg">No products found</div>
            <button
              onClick={handleFilterReset}
              className="px-6 py-3 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {products.length > 0 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-sm">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-neutral-600 font-medium">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={products.length < 20} // Assuming 20 is page size
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
