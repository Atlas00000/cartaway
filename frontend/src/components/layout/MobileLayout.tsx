"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search, User, Heart, Home, Package, Star, Crown } from 'lucide-react';

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: ShoppingBag },
    { name: 'Services', href: '/services', icon: Crown },
    { name: 'Blog', href: '/blog', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display text-gradient">CartAway</span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                className="p-2 text-neutral-600 hover:text-primary-600 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-accent text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Cart */}
              <button
                className="p-2 text-neutral-600 hover:text-primary-600 transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="mt-3 animate-fade-in-down">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-lg animate-fade-in-down">
            <nav className="px-4 py-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
                
                {/* Divider */}
                <li className="border-t border-neutral-200 my-2"></li>
                
                {/* User Account */}
                <li>
                  <Link
                    href="/account"
                    className="flex items-center space-x-3 px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Account</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-40">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center space-y-1 p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link
            href="/categories"
            className="flex flex-col items-center space-y-1 p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Shop</span>
          </Link>
          
          <Link
            href="/services"
            className="flex flex-col items-center space-y-1 p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <Crown className="w-5 h-5" />
            <span className="text-xs font-medium">Services</span>
          </Link>
          
          <Link
            href="/blog"
            className="flex flex-col items-center space-y-1 p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <Star className="w-5 h-5" />
            <span className="text-xs font-medium">Blog</span>
          </Link>
          
          <Link
            href="/account"
            className="flex flex-col items-center space-y-1 p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Account</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Spacing for Mobile Navigation */}
      <div className="h-16"></div>
    </div>
  );
};

export default MobileLayout;
