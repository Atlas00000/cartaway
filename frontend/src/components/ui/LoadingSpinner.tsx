import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text = 'Loading' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          "border-4 border-gray-200 rounded-full animate-spin",
          sizeClasses[size]
        )} style={{
          borderTopColor: 'hsl(var(--primary))',
          borderRightColor: 'hsl(var(--secondary))',
          borderBottomColor: 'hsl(var(--primary))',
          borderLeftColor: 'hsl(var(--secondary))'
        }} />
        
        {/* Inner glow */}
        <div className={cn(
          "absolute inset-0 rounded-full animate-pulse-glow",
          sizeClasses[size]
        )} style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)'
        }} />
      </div>
      
      {text && (
        <div className="text-center">
          <p className="text-lg font-medium text-foreground mb-2">{text}</p>
          <p className="text-sm text-muted-foreground loading-dots">Please wait</p>
        </div>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* CartAway Logo */}
        <div className="animate-scale-in">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            CartAway
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your Gateway to Premium Shopping
          </p>
        </div>
        
        {/* Loading Spinner */}
        <LoadingSpinner size="lg" text="Preparing your experience" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
