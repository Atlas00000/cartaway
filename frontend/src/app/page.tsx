'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Shield,
  Sparkles,
  ChevronRight,
  Play,
  Award,
  Users,
  Globe,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { productsApi } from '@/lib/api/products';
import { Product, Category } from '@/lib/types/api';

// Mock data for when backend is not available
const mockProducts: any[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    compare_price: 399.99,
    stock_quantity: 50,
    is_featured: true,
    rating: 4.8,
    review_count: 156,
    images: [{ 
      id: 1, 
      image: "/api/media/products/headphones.jpg", 
      alt_text: "Wireless Headphones",
      product: 1,
      is_primary: true,
      order: 1
    }]
  },
  {
    id: 2,
    name: "Luxury Smart Watch",
    description: "Premium smartwatch with health tracking and elegant design for the modern lifestyle.",
    price: 599.99,
    compare_price: 699.99,
    stock_quantity: 25,
    is_featured: true,
    rating: 4.9,
    review_count: 89,
    images: [{ 
      id: 2, 
      image: "/api/media/products/smartwatch.jpg", 
      alt_text: "Smart Watch",
      product: 2,
      is_primary: true,
      order: 1
    }]
  },
  {
    id: 3,
    name: "Designer Leather Bag",
    description: "Handcrafted leather bag with premium materials and timeless design.",
    price: 199.99,
    compare_price: 249.99,
    stock_quantity: 30,
    is_featured: true,
    rating: 4.7,
    review_count: 203,
    images: [{ 
      id: 3, 
      image: "/api/media/products/leather-bag.jpg", 
      alt_text: "Leather Bag",
      product: 3,
      is_primary: true,
      order: 1
    }]
  }
];

const mockCategories: any[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Premium electronic devices and gadgets",
    product_count: 150,
    children: [],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Fashion",
    slug: "fashion",
    description: "Luxury fashion items and accessories",
    product_count: 200,
    children: [],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Home & Living",
    slug: "home-living",
    description: "Premium home decor and lifestyle products",
    product_count: 120,
    children: [],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProductSet, setCurrentProductSet] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getFeaturedProducts(),
          productsApi.getCategories()
        ]);
        setFeaturedProducts(productsData || []);
        setCategories(categoriesData || []);
        setError(null);
      } catch (err) {
        console.warn('Backend not available, using mock data:', err);
        // Use mock data when backend is not available
        setFeaturedProducts(mockProducts as Product[]);
        setCategories(mockCategories as Category[]);
        setError('Backend connection failed - showing demo data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductSet((prev) => 
        prev === Math.floor((featuredProducts.length - 1) / 3) ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen luxury-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CartAway...</p>
        </div>
      </div>
    );
  }

  const productSets = [];
  for (let i = 0; i < featuredProducts.length; i += 3) {
    productSets.push(featuredProducts.slice(i, i + 3));
  }

  return (
    <div className="luxury-bg min-h-screen">
      {/* Backend Connection Warning */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Demo Mode - Backend Offline</span>
          </div>
        </div>
      )}

      {/* Hero Section - Enhanced Organic Shape */}
      <section 
        id="hero"
        ref={(el: HTMLDivElement | null) => { sectionRefs.current.hero = el; }}
        className="section-premium relative overflow-hidden bg-premium"
      >
        <div className="absolute inset-0 bg-blob"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className={`text-center lg:text-left space-y-8 scroll-reveal ${isVisible.hero ? 'revealed' : ''}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium gradient-text">Premium Collection</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="gradient-text-dual">Discover</span>
                  <br />
                  <span className="text-foreground">Extraordinary</span>
                  <br />
                  <span className="gradient-text">Products</span>
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Experience luxury shopping with our curated collection of premium products designed for the discerning customer
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-premium text-lg font-semibold group hover-glow">
                  <span>Start Shopping</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-2 hover:bg-muted/50 text-lg font-semibold group border-premium">
                  <Play className="mr-2 w-5 h-5" />
                  <span>Watch Demo</span>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Secure Shopping</span>
                </div>
              </div>
            </div>

            {/* Hero Visual - Enhanced */}
            <div className="relative animate-scaleIn">
              <div className="section-blob bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 p-8 animate-morph">
                <div className="card-premium p-8 text-center shadow-premium">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-premium-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text-dual mb-3">Premium Collection</h3>
                  <p className="text-muted-foreground mb-4">Curated luxury products for discerning customers</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9/5</span>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>10K+ Products</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 organic-shape-premium bg-gradient-to-br from-secondary/20 to-primary/20 animate-float-premium"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 organic-shape-alt bg-gradient-to-br from-primary/15 to-secondary/15 animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -right-12 w-16 h-16 organic-shape-soft bg-gradient-to-br from-primary/10 to-secondary/10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced Organic Cards */}
      <section 
        id="stats"
        ref={(el: HTMLDivElement | null) => { sectionRefs.current.stats = el; }}
        className="section-dynamic"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShoppingCart, label: 'Products', value: '10K+', color: 'from-primary to-primary/80', delay: 0 },
              { icon: Heart, label: 'Happy Customers', value: '50K+', color: 'from-secondary to-secondary/80', delay: 0.1 },
              { icon: Star, label: 'Average Rating', value: '4.9', color: 'from-primary to-secondary', delay: 0.2 },
              { icon: TrendingUp, label: 'Growth', value: '200%', color: 'from-secondary to-primary', delay: 0.3 }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`card-premium p-6 text-center hover-glow transition-premium scroll-reveal ${isVisible.stats ? 'revealed' : ''}`}
                style={{ animationDelay: `${stat.delay}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-premium animate-premium-pulse`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold gradient-text-dual mb-2">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Enhanced Fluid Design */}
      <section 
        id="products"
        ref={(el: HTMLDivElement | null) => { sectionRefs.current.products = el; }}
        className="section-fluid bg-wave"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 scroll-reveal ${isVisible.products ? 'revealed' : ''}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium gradient-text">Featured</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text-dual mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked collection of premium products that define luxury
            </p>
          </div>

          {productSets.length > 0 && (
            <div className="relative">
              {/* Product Carousel */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentProductSet * 100}%)` }}
                >
                  {productSets.map((productSet, setIndex) => (
                    <div key={setIndex} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productSet.map((product, index) => (
                          <div 
                            key={product.id} 
                            className="card-premium p-6 hover-glow transition-premium scroll-reveal interactive-card"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            <div className="relative mb-6">
                              <div className="aspect-square bg-muted rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                                {product.images && product.images[0] ? (
                                  <img 
                                    src={product.images[0].image} 
                                    alt={product.images[0].alt_text || product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:scale-110 transition-transform"
                              >
                                <Heart className="w-5 h-5" />
                              </Button>
                              {product.is_featured && (
                                <div className="absolute top-2 left-2">
                                  <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                                    Featured
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                              <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{product.rating || 4.5}</span>
                                  <span className="text-sm text-muted-foreground">({product.review_count || 128})</span>
                                </div>
                                <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-2xl font-bold gradient-text">${product.price}</p>
                                  {product.compare_price && product.compare_price > product.price && (
                                    <p className="text-sm text-muted-foreground line-through">${product.compare_price}</p>
                                  )}
                                </div>
                                <Button size="sm" className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-premium">
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Navigation Dots */}
              {productSets.length > 1 && (
                <div className="flex justify-center space-x-3 mt-8">
                  {productSets.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProductSet(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        index === currentProductSet 
                          ? 'bg-gradient-to-r from-primary to-secondary scale-125 shadow-premium' 
                          : 'bg-muted hover:bg-muted-foreground/50 hover:scale-110'
                      }`}
                      aria-label={`Go to product set ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 hover:bg-muted/50 text-lg font-semibold group border-premium hover-glow">
                <span>View All Products</span>
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced Organic Layout */}
      <section 
        id="categories"
        ref={(el: HTMLDivElement | null) => { sectionRefs.current.categories = el; }}
        className="section-dynamic"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 scroll-reveal ${isVisible.categories ? 'revealed' : ''}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium gradient-text">Categories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text-dual mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of product categories curated for every lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div 
                  className="card-premium p-8 text-center hover-glow transition-premium scroll-reveal interactive-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 animate-premium-pulse">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text-dual mb-2 group-hover:scale-105 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description || `Discover amazing ${category.name.toLowerCase()} products`}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <span>{category.product_count || 0} products</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Premium Wave Shape */}
      <section 
        id="cta"
        ref={(el: HTMLDivElement | null) => { sectionRefs.current.cta = el; }}
        className="section-premium section-wave bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10"
      >
        <div className="container mx-auto px-4 text-center">
          <div className={`max-w-4xl mx-auto scroll-reveal ${isVisible.cta ? 'revealed' : ''}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20 mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium gradient-text">Premium Experience</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text-dual mb-6">
              Ready to Experience Luxury Shopping?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust CartAway for their premium shopping needs. 
              Discover products that define excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-premium text-lg font-semibold group hover-glow">
                <span>Start Shopping Now</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-2 hover:bg-muted/50 text-lg font-semibold border-premium">
                Learn More
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-secondary" />
                <span className="text-sm text-muted-foreground">50K+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Secure Shopping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
