"use client";

import React from 'react';
import { ShoppingBag, Star, Heart, Truck, Shield, Zap } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading your premium shopping experience...", 
  showProgress = true,
  progress = 0 
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loadingDots, setLoadingDots] = React.useState('');

  const loadingSteps = [
    { icon: ShoppingBag, text: "Preparing your catalog", color: "from-blue-500 to-blue-600" },
    { icon: Star, text: "Curating premium products", color: "from-yellow-500 to-orange-500" },
    { icon: Heart, text: "Personalizing recommendations", color: "from-pink-500 to-red-500" },
    { icon: Truck, text: "Setting up delivery", color: "from-green-500 to-emerald-600" },
    { icon: Shield, text: "Securing your data", color: "from-purple-500 to-indigo-600" },
    { icon: Zap, text: "Optimizing performance", color: "from-orange-500 to-red-500" },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 800);

    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-fire opacity-8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-primary rounded-2xl opacity-20 blur animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-display text-gradient mt-4 animate-fade-in-down">
            CartAway
          </h1>
        </div>

        {/* Loading Steps */}
        <div className="mb-8">
          <div className="space-y-4">
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg scale-105' 
                      : isCompleted 
                        ? 'bg-white/60 backdrop-blur-sm border border-white/20 opacity-60' 
                        : 'bg-white/40 backdrop-blur-sm border border-white/10 opacity-30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isActive 
                      ? `bg-gradient-to-r ${step.color} shadow-lg` 
                      : isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-neutral-200'
                  }`}>
                    <StepIcon className={`w-6 h-6 transition-all duration-500 ${
                      isActive || isCompleted ? 'text-white' : 'text-neutral-400'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium transition-all duration-500 ${
                      isActive ? 'text-neutral-900' : isCompleted ? 'text-neutral-700' : 'text-neutral-500'
                    }`}>
                      {step.text}
                    </p>
                    {isActive && (
                      <div className="mt-2">
                        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  {isCompleted && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Message */}
        <div className="mb-8">
          <p className="text-lg text-neutral-700 font-medium">
            {message}
            <span className="inline-block w-4 text-left animate-pulse">
              {loadingDots}
            </span>
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 bg-gradient-primary rounded-full animate-bounce"
              style={{ animationDelay: `${index * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl">
          <p className="text-sm text-neutral-600">
            💡 <strong>Tip:</strong> While we prepare your experience, explore our curated collections and premium services.
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 animate-float">
        <div className="w-8 h-8 bg-gradient-warm rounded-full opacity-30"></div>
      </div>
      <div className="absolute bottom-10 left-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-6 h-6 bg-gradient-sunset rounded-full opacity-30"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-4 h-4 bg-gradient-fire rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
