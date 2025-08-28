"use client";

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileOptimizedSections from '@/components/sections/MobileOptimizedSections';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    // For mobile, we'll use a simplified layout without the complex header/footer
    return (
      <div className="min-h-screen bg-white">
        {/* Simple mobile header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-display text-gradient">CartAway</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-neutral-600 hover:text-primary-600 transition-colors" aria-label="Search" title="Search">
                  <span className="text-lg">🔍</span>
                </button>
                <button className="p-2 text-neutral-600 hover:text-primary-600 transition-colors relative" aria-label="Cart" title="Cart">
                  <span className="text-lg">🛒</span>
                  <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-screen">
          <MobileOptimizedSections />
        </main>

        {/* Simple mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-40 mobile-safe-area">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center space-y-1 p-2 text-primary-600" aria-label="Home" title="Home">
              <span className="text-lg">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-neutral-600" aria-label="Shop" title="Shop">
              <span className="text-lg">🛍️</span>
              <span className="text-xs font-medium">Shop</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-neutral-600" aria-label="Services" title="Services">
              <span className="text-lg">👑</span>
              <span className="text-xs font-medium">Services</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-neutral-600" aria-label="Blog" title="Blog">
              <span className="text-lg">📖</span>
              <span className="text-xs font-medium">Blog</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2 text-neutral-600" aria-label="Account" title="Account">
              <span className="text-lg">👤</span>
              <span className="text-xs font-medium">Account</span>
            </button>
          </div>
        </nav>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-16 mobile-bottom-nav"></div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ResponsiveLayout;
