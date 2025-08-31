"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ShoppingBag, Users, Mail, ArrowRight, Sparkles, Search, Heart } from 'lucide-react';

export default function NotFound() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const quickLinks = [
    {
      icon: Home,
      title: 'Home',
      description: 'Return to homepage',
      href: '/',
      gradient: 'bg-gradient-warm'
    },
    {
      icon: ShoppingBag,
      title: 'Products',
      description: 'Browse our collection',
      href: '/products',
      gradient: 'bg-gradient-fire'
    },
    {
      icon: Users,
      title: 'About',
      description: 'Learn about us',
      href: '/about',
      gradient: 'bg-gradient-sunset'
    },
    {
      icon: Mail,
      title: 'Contact',
      description: 'Get in touch',
      href: '/contact',
      gradient: 'bg-gradient-rose'
    }
  ];

  const popularPages = [
    { name: 'Categories', href: '/categories' },
    { name: 'Featured Products', href: '/products' },
    { name: 'Customer Support', href: '/contact' },
    { name: 'About CartAway', href: '/about' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-orange-50 via-white to-warm-rose-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-6 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-rose opacity-7 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main 404 Content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow-warm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-display text-gradient-warm">404</h1>
          </div>
          <h2 className="text-2xl lg:text-4xl font-display text-neutral-900 mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Don&apos;t worry, we&apos;ve got plenty of other great pages for you to explore!
          </p>
          
          {/* Search Suggestion */}
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-warm-orange-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
              />
              <div className="absolute inset-0 bg-gradient-warm opacity-0 group-focus-within:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
            </form>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-16">
          <h3 className="text-2xl font-display text-neutral-900 text-center mb-8">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group block"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-6 text-center hover-lift transition-all duration-300">
                  <div className={`w-16 h-16 ${link.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-display text-neutral-900 mb-2 group-hover:text-warm-orange-600 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    {link.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-warm-orange-600 font-medium">
                    <span>Go to {link.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8">
            <h3 className="text-xl font-display text-neutral-900 text-center mb-6">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularPages.map((page, index) => (
                <Link
                  key={index}
                  href={page.href}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 group"
                >
                  <span>{page.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Helpful Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-fire rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-display text-neutral-900">Can&apos;t find what you&apos;re looking for?</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              Try using our search feature to find products, or browse through our categories to discover new items.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-warm-orange-600 font-medium hover:text-warm-orange-700 transition-colors"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-sunset rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-display text-neutral-900">Need help?</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              Our customer support team is here to help you find what you need or answer any questions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-warm-orange-600 font-medium hover:text-warm-orange-700 transition-colors"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-warm-orange-50 to-warm-rose-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <h3 className="text-3xl font-display text-neutral-900 mb-4">
                Let&apos;s Get You Back on Track
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Explore our amazing collection of products or get in touch with our support team for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Go Home
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white border border-warm-orange-200 text-neutral-700 font-semibold rounded-xl hover:bg-warm-orange-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
