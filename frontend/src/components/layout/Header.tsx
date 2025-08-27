'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  ChevronDown,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/store/auth';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'Categories', 
      href: '/categories',
      dropdown: [
        { name: 'Electronics', href: '/categories/electronics', icon: '⚡' },
        { name: 'Fashion', href: '/categories/fashion', icon: '👔' },
        { name: 'Home & Living', href: '/categories/home', icon: '🏠' },
        { name: 'Sports & Fitness', href: '/categories/sports', icon: '🏃' },
        { name: 'Beauty & Care', href: '/categories/beauty', icon: '💄' },
        { name: 'Books & Media', href: '/categories/books', icon: '📚' }
      ]
    },
    { name: 'Deals', href: '/deals' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Brands', href: '/brands' },
  ];

  const features = [
    { icon: Star, text: 'Premium Quality' },
    { icon: Truck, text: 'Fast Delivery' },
    { icon: Shield, text: 'Secure Shopping' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-3 sm:space-x-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-1 sm:space-x-2 group">
                  <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline group-hover:text-white/90 transition-colors">{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Free shipping on orders over $50</span>
              </span>
              <span className="text-white/60">|</span>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-white/20' 
            : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text tracking-tight">CartAway</h1>
                <span className="text-xs text-muted-foreground -mt-0.5 sm:-mt-1 hidden sm:block">Premium Shopping</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="relative px-3 sm:px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg group-hover:bg-muted/50 text-sm"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span className="flex items-center space-x-1">
                      <span>{item.name}</span>
                      {item.dropdown && <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-180" />}
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center space-x-3 px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200 group"
                        >
                          <span className="text-lg">{subItem.icon}</span>
                          <span className="font-medium text-sm">{subItem.name}</span>
                          <div className="ml-auto w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-sm sm:max-w-md mx-4 sm:mx-6 lg:mx-8 hidden md:block">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 sm:pl-12 bg-muted/30 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-full h-10 sm:h-12 text-sm"
                />
                {isSearchFocused && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full -z-10"></div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative group h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-primary to-secondary">
                  5
                </Badge>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative group h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-primary to-secondary">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.first_name || user?.username}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="h-8 sm:h-10 px-3 sm:px-4 rounded-full hover:bg-muted/50 text-xs sm:text-sm hidden sm:block">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="h-8 sm:h-10 px-4 sm:px-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg text-xs sm:text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 bg-muted/30 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-full h-10 sm:h-12 text-sm"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-1 sm:space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block py-2 sm:py-3 px-3 sm:px-4 text-foreground hover:text-primary hover:bg-muted/50 transition-colors font-medium rounded-lg text-sm sm:text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="ml-3 sm:ml-4 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center space-x-3 py-2 px-3 sm:px-4 text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors rounded-lg text-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="text-lg">{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 sm:space-y-3 pt-4 border-t border-white/20">
                  <Link href="/login">
                    <Button variant="outline" className="w-full h-10 sm:h-12 rounded-full text-sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full h-10 sm:h-12 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
