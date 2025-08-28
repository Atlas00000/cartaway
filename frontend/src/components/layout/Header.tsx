"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search, User, Heart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-accent transition-all duration-300">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-primary rounded-xl opacity-20 blur group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-display text-gradient">CartAway</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-300 group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-300 placeholder-neutral-500"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <button 
              className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-300 group hover:scale-110"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-6 h-6 group-hover:fill-primary-500 group-hover:stroke-primary-500 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </button>
            <button 
              className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-300 group hover:scale-110"
              aria-label="Account"
              title="Account"
            >
              <User className="w-6 h-6 group-hover:stroke-primary-500 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </button>
            <button 
              className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-300 group hover:scale-110"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 group-hover:stroke-primary-500 transition-all duration-300" />
              <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-glow animate-pulse-slow">
                0
              </span>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
