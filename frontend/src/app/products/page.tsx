"use client";

import React, { useEffect, useState } from 'react';
import { 
  Search, Filter, Grid, List, Star, Heart, ShoppingCart, TrendingUp, Zap, Crown, Sparkles, 
  ArrowRight, Filter as FilterIcon, X, Eye, Share2, Clock, Truck, Shield, Award, 
  ChevronLeft, ChevronRight, Sliders, Grid3X3, BarChart3, RefreshCw, Bookmark,
  Tag, DollarSign, Percent, Gift, Flame, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { api } from '@/lib/api/client';
import LoadingScreen from '@/components/ui/LoadingScreen';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

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
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
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
    setFilterTags([]);
    setRatingFilter(0);
    setAvailabilityFilter('all');
  };

  const addFilterTag = (tag: string) => {
    if (!filterTags.includes(tag)) {
      setFilterTags(prev => [...prev, tag]);
    }
  };

  const removeFilterTag = (tag: string) => {
    setFilterTags(prev => prev.filter(t => t !== tag));
  };

  const getProductBadge = (product: Product) => {
    if (product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price)) {
      const discount = Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100);
      return { type: 'discount', text: `${discount}% OFF`, color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', icon: Percent };
    }
    if (product.is_featured) {
      return { type: 'featured', text: 'Featured', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', icon: Crown };
    }
    if (product.is_bestseller) {
      return { type: 'bestseller', text: 'Best Seller', color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white', icon: Flame };
    }
    if (product.is_new) {
      return { type: 'new', text: 'New', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white', icon: Sparkles };
    }
    return null;
  };

  const getProductRating = (product: Product) => {
    // Mock rating - in real app this would come from product data
    return Math.random() * 2 + 3; // 3-5 stars
  };

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading premium products..."
        showProgress={true}
        progress={75}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-8 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-fire opacity-8 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header */}
        <div className="mb-12 text-center animate-fade-in-down">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-display text-gradient">Premium Products</h1>
          </div>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of premium products, carefully selected to enhance your lifestyle
          </p>
          
          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">{products.length}</div>
              <div className="text-sm text-neutral-600">Total Products</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">{categories.length}</div>
              <div className="text-sm text-neutral-600">Categories</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">24h</div>
              <div className="text-sm text-neutral-600">Fast Delivery</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-fire rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">4.9★</div>
              <div className="text-sm text-neutral-600">Rating</div>
            </div>
          </div>

          {/* Filter Tags */}
          {filterTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {filterTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-primary text-white text-sm font-medium rounded-full shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeFilterTag(tag)}
                    className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 transition-colors duration-300 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg border border-white/30 animate-fade-in-up">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Enhanced Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search for premium products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200 text-lg"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-6 py-4 bg-gradient-primary text-white font-semibold rounded-2xl flex items-center justify-center gap-3 hover:shadow-glow transition-all duration-300"
              >
                <Sliders className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Enhanced Filters Row */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Category Filter */}
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value) addFilterTag(`Category: ${categories.find(c => c.id === parseInt(e.target.value))?.name}`);
                  }}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Price Range */}
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => {
                    setPriceRange(prev => ({ ...prev, min: e.target.value }));
                    if (e.target.value) addFilterTag(`Min: $${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => {
                    setPriceRange(prev => ({ ...prev, max: e.target.value }));
                    if (e.target.value) addFilterTag(`Max: $${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Sort By */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                >
                  <option value="created_at">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                  <option value="-rating">Highest Rated</option>
                </select>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="border-t border-neutral-200 pt-6">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors mb-4"
              >
                <Sliders className="w-4 h-4" />
                Advanced Filters
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showAdvancedFilters ? 'rotate-90' : ''}`} />
              </button>
              
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingFilter(star)}
                          className={`p-1 rounded transition-colors duration-300 ${
                            ratingFilter >= star ? 'text-yellow-500' : 'text-neutral-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Availability</label>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="all">All Products</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Features</label>
                    <div className="flex flex-wrap gap-2">
                      {['Free Shipping', 'Premium Quality', 'Fast Delivery', 'Eco-Friendly'].map((feature) => (
                        <button
                          key={feature}
                          type="button"
                          className="px-3 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors duration-300"
                        >
                          {feature}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Filter Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleFilterReset}
                className="px-6 py-2 text-neutral-600 hover:text-primary-600 transition-colors flex items-center gap-2 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Clear All Filters
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-primary text-white shadow-glow' 
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
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'compact' 
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                  }`}
                  aria-label="Compact view"
                  title="Compact view"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8 animate-fade-in-up">
            <h3 className="text-2xl font-display text-neutral-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-500" />
              Recently Viewed
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-48 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-4 hover-lift transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleQuickView(product)}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center mb-3">
                    <div className="text-3xl">📦</div>
                  </div>
                  <h4 className="font-medium text-neutral-900 mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-lg font-display text-gradient">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Products Grid/List */}
        {error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-fire rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <div className="text-neutral-500 mb-6 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : viewMode === 'list'
            ? 'space-y-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }>
            {products.map((product, index) => {
              const badge = getProductBadge(product);
              const isSelected = selectedProducts.has(product.id);
              const isWishlisted = wishlistItems.has(product.id);
              const rating = getProductRating(product);
              
              return (
                <div
                  key={product.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 overflow-hidden hover-lift group transition-all duration-500 ${
                    viewMode === 'list' ? 'flex' : ''
                  } ${isSelected ? 'ring-2 ring-primary-500 shadow-glow' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Enhanced Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <div className="aspect-square bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-500">📦</div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                          onClick={() => handleQuickView(product)}
                          className="bg-white/90 backdrop-blur-sm border border-white/30 text-neutral-700 font-semibold px-4 py-2 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Quick View
                        </button>
                      </div>
                    </div>
                    
                    {/* Product Badge */}
                    {badge && (
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-bold shadow-lg ${badge.color} flex items-center gap-1`}>
                        <badge.icon className="w-3 h-3" />
                        {badge.text}
                      </div>
                    )}
                    
                    {/* Enhanced Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleAddToWishlist(product.id)}
                        className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                          isWishlisted ? 'bg-gradient-warm text-white' : 'bg-white/90 text-neutral-400 hover:text-warm-orange-500'
                        }`}
                        title="Add to wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleQuickView(product)}
                        className="p-2 bg-white/90 text-neutral-400 hover:text-primary-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        title="Quick view"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-white/90 text-neutral-400 hover:text-primary-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        title="Share product"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Product Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {viewMode === 'compact' && (
                        <button
                          onClick={() => handleAddToWishlist(product.id)}
                          className={`p-1 rounded-full transition-all duration-300 ${
                            isWishlisted ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {product.short_description || product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-neutral-500">({rating.toFixed(1)})</span>
                      <span className="text-sm text-neutral-400">• 1.2k reviews</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-display text-gradient">
                          ${product.price}
                        </div>
                        {product.compare_price && product.compare_price > product.price && (
                          <div className="text-sm text-neutral-500 line-through">
                            ${product.compare_price}
                          </div>
                        )}
                      </div>
                      
                      {/* Stock Status */}
                      <div className="flex items-center text-xs text-green-600 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        In Stock
                      </div>
                    </div>

                    {/* Enhanced Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`w-full px-6 py-3 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        isSelected 
                          ? 'btn-premium shadow-glow' 
                          : 'btn-premium hover:shadow-glow'
                      }`}
                    >
                      <ShoppingCart className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                      {isSelected ? 'Added!' : 'Add to Cart'}
                    </button>

                    {/* Product Features */}
                    {viewMode !== 'compact' && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Search className="w-12 h-12 text-white" />
            </div>
            <div className="text-neutral-500 mb-6 text-lg">No products found matching your criteria</div>
            <button
              onClick={handleFilterReset}
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {products.length > 0 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-white border border-neutral-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="px-6 py-3 text-neutral-600 font-medium">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={products.length < 20}
                className="px-6 py-3 bg-white border border-neutral-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-display text-neutral-900">{quickViewProduct.name}</h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">📦</div>
                  </div>
                  <p className="text-neutral-600">{quickViewProduct.description}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="text-3xl font-display text-gradient">${quickViewProduct.price}</div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleAddToCart(quickViewProduct.id)}
                      className="flex-1 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(quickViewProduct.id)}
                      className="px-6 py-3 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${wishlistItems.has(quickViewProduct.id) ? 'fill-current text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
