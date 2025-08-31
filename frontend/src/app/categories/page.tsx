"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Package, Star, Sparkles, TrendingUp, Zap, Crown, Heart, ShoppingCart, Eye,
  Search, Filter, Grid, List, ChevronLeft, ChevronRight, Sliders, Grid3X3, BarChart3, 
  RefreshCw, Bookmark, Tag, DollarSign, Percent, Gift, Flame, CheckCircle, AlertCircle, 
  Info, Clock, Truck, Shield, Award, Users, Globe, CheckCircle2, Calendar, Share2,
  BarChart, TrendingDown, ShoppingBag, Filter as FilterIcon, X
} from 'lucide-react';
import { Category, Product } from '@/lib/types';
import { api } from '@/lib/api/client';
import LoadingScreen from '@/components/ui/LoadingScreen';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryStats, setCategoryStats] = useState<any>({});
  const [recentlyViewed, setRecentlyViewed] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);
        
        setCategories(categoriesResponse.results || []);
        setProducts(productsResponse.results || []);
        
        // Calculate category statistics
        const stats = calculateCategoryStats(categoriesResponse.results || [], productsResponse.results || []);
        setCategoryStats(stats);
        
        setFilteredCategories(categoriesResponse.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateCategoryStats = (cats: Category[], prods: Product[]) => {
    const stats = {
      totalCategories: cats.length,
      totalProducts: prods.length,
      avgProductsPerCategory: Math.round(prods.length / cats.length),
      topCategory: cats.reduce((prev, current) => 
        (current.product_count || 0) > (prev.product_count || 0) ? current : prev
      ),
      categoriesWithProducts: cats.filter(cat => (cat.product_count || 0) > 0).length,
      trendingCategories: cats.slice(0, 3) // Top 3 by product count
    };
    return stats;
  };

  const handleCategoryHover = (categoryId: number) => {
    setHoveredCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  const handleQuickView = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(c => c.id !== category.id);
      return [category, ...filtered].slice(0, 5);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    const sorted = [...filteredCategories].sort((a, b) => {
      switch (sortType) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return (b.product_count || 0) - (a.product_count || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
    setFilteredCategories(sorted);
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
      'Fashion': '👗',
      'Technology': '💻',
      'Lifestyle': '🌟',
      'default': '📦'
    };
    return icons[categoryName as keyof typeof icons] || icons.default;
  };

  const getCategoryBadge = (index: number, productCount: number) => {
    if (productCount > 100) {
      return { type: 'trending', text: 'Trending', color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white', icon: TrendingUp };
    } else if (productCount > 50) {
      return { type: 'popular', text: 'Popular', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', icon: Crown };
    } else if (index < 3) {
      return { type: 'new', text: 'New', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white', icon: Sparkles };
    } else {
      return { type: 'hot', text: 'Hot', color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', icon: Flame };
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading product categories..."
        showProgress={true}
        progress={60}
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
            <h1 className="text-5xl font-display text-gradient">Product Categories</h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore our curated collection of premium products organized by category. 
            Find exactly what you're looking for with our comprehensive catalog.
          </p>
          
          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">{categoryStats.totalCategories}</div>
              <div className="text-sm text-neutral-600">Categories</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">{categoryStats.totalProducts}</div>
              <div className="text-sm text-neutral-600">Products</div>
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
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg border border-white/30 animate-fade-in-up">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Enhanced Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search categories..."
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
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Sort By */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                  aria-label="Sort categories"
                >
                  <option value="name">Sort by Name</option>
                  <option value="products">Sort by Product Count</option>
                  <option value="newest">Sort by Newest</option>
                </select>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* View Mode */}
              <div className="flex items-center justify-end space-x-2">
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

        {/* Recently Viewed Categories */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8 animate-fade-in-up">
            <h3 className="text-2xl font-display text-neutral-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-500" />
              Recently Viewed
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.map((category, index) => (
                <div
                  key={category.id}
                  className="flex-shrink-0 w-48 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-4 hover-lift transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleQuickView(category)}
                >
                  <div className="w-full h-24 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center mb-3">
                    <div className="text-3xl">{getCategoryIcon(category.name)}</div>
                  </div>
                  <h4 className="font-medium text-neutral-900 mb-1 line-clamp-1">{category.name}</h4>
                  <p className="text-sm text-neutral-600">{category.product_count || 0} products</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Categories Grid/List */}
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
        ) : filteredCategories.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : viewMode === 'list'
            ? 'space-y-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          }>
            {filteredCategories.map((category, index) => {
              const badge = getCategoryBadge(index, category.product_count || 0);
              const isHovered = hoveredCategory === category.id;
              const isSelected = selectedCategories.has(category.id);
              const categoryColor = getCategoryColor(index);
              
              return (
                <div
                  key={category.id}
                  className="group relative"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={handleCategoryLeave}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/categories/${category.slug}`} className="block">
                    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 overflow-hidden hover-lift transition-all duration-500 ${
                      isSelected ? 'ring-2 ring-primary-500 shadow-glow' : ''
                    }`}>
                      {/* Category Image */}
                      <div className={`relative aspect-video bg-gradient-to-br ${categoryColor} flex items-center justify-center overflow-hidden`}>
                        <div className={`text-6xl transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
                          {getCategoryIcon(category.name)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-bold shadow-lg ${badge.color} flex items-center gap-1`}>
                          <badge.icon className="w-3 h-3" />
                          {badge.text}
                        </div>

                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickView(category);
                            }}
                            className="bg-white/90 backdrop-blur-sm border border-white/30 text-neutral-700 font-semibold px-4 py-2 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Quick View
                          </button>
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-display text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {category.name}
                          </h3>
                          <ArrowRight className={`w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-all duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`} />
                        </div>
                        
                        <p className="text-neutral-600 mb-4 line-clamp-2">
                          {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <Package className="w-4 h-4" />
                            <span>{category.product_count || 0} products</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-neutral-500">4.8</span>
                          </div>
                        </div>

                        {/* Category Features */}
                        {viewMode !== 'compact' && (
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
                              Fast Delivery
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Enhanced Action Buttons */}
                  <div className={`absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0`}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickView(category);
                      }}
                      className="p-2 bg-white/90 text-neutral-400 hover:text-primary-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      title="Quick view"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-white/90 text-neutral-400 hover:text-red-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      title="Add to wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-white/90 text-neutral-400 hover:text-primary-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      title="Share category"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
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
            <div className="text-neutral-500 mb-6 text-lg">No categories found matching your criteria</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredCategories(categories);
              }}
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-2xl hover:shadow-glow transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Enhanced Category Statistics */}
        {categories.length > 0 && (
          <div className="mt-20 animate-fade-in-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-fire rounded-full flex items-center justify-center">
                  <BarChart className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-3xl font-display text-gradient-fire">Category Insights</h2>
              </div>
              <p className="text-lg text-neutral-600">Discover trends and statistics across our product categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover-lift">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-neutral-900">Top Category</h3>
                    <p className="text-sm text-neutral-600">{categoryStats.topCategory?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-2xl font-display text-gradient font-bold">
                  {categoryStats.topCategory?.product_count || 0} products
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover-lift">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-neutral-900">Average Products</h3>
                    <p className="text-sm text-neutral-600">Per category</p>
                  </div>
                </div>
                <div className="text-2xl font-display text-gradient font-bold">
                  {categoryStats.avgProductsPerCategory || 0}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover-lift">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-neutral-900">Active Categories</h3>
                    <p className="text-sm text-neutral-600">With products</p>
                  </div>
                </div>
                <div className="text-2xl font-display text-gradient font-bold">
                  {categoryStats.categoriesWithProducts || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className="mt-20 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <h3 className="text-3xl font-display text-neutral-900 mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Browse our complete product catalog or contact our support team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="btn-premium group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Browse All Products</span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/80 backdrop-blur-sm border border-white/30 text-neutral-700 font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:shadow-premium transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Contact Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Quick View Modal */}
      {showCategoryModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-display text-neutral-900">{selectedCategory.name}</h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">{getCategoryIcon(selectedCategory.name)}</div>
                  </div>
                  <p className="text-neutral-600">{selectedCategory.description}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="text-3xl font-display text-gradient">{selectedCategory.product_count || 0} Products</div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/categories/${selectedCategory.slug}`}
                      className="btn-premium group"
                    >
                      <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative z-10">View Products</span>
                    </Link>
                    <button
                      className="px-6 py-3 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
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

export default CategoriesPage;
