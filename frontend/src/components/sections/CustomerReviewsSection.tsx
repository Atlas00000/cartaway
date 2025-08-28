"use client";

import React, { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react';

interface Review {
  id: number;
  customer_name: string;
  customer_avatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  product_name?: string;
  helpful_count: number;
  verified_purchase: boolean;
}

const CustomerReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // For now, using mock data since we don't have a reviews API yet
        // In a real implementation, this would be: const response = await api.getCustomerReviews();
        const mockReviews: Review[] = [
          {
            id: 1,
            customer_name: "Sarah M.",
            rating: 5,
            title: "Exceptional Quality and Service",
            comment: "I've been shopping with CartAway for over a year now, and I'm consistently impressed by the quality of their products and the level of customer service. The personal shopping assistant helped me find the perfect gifts for my family, and the delivery was prompt and professional.",
            date: "2024-01-15",
            product_name: "Personal Shopping Service",
            helpful_count: 23,
            verified_purchase: true
          },
          {
            id: 2,
            customer_name: "Michael R.",
            rating: 5,
            title: "Luxury Experience at Its Finest",
            comment: "The VIP concierge service exceeded all my expectations. From the moment I contacted them, I felt like a valued customer. They went above and beyond to ensure my shopping experience was seamless and enjoyable.",
            date: "2024-01-12",
            product_name: "VIP Concierge Service",
            helpful_count: 18,
            verified_purchase: true
          },
          {
            id: 3,
            customer_name: "Emma L.",
            rating: 5,
            title: "Perfect Gift Curation",
            comment: "I used their gift curation service for my mother's birthday, and it was absolutely perfect! They selected items that perfectly matched her style and preferences. The packaging was beautiful, and she loved everything.",
            date: "2024-01-10",
            product_name: "Premium Gift Curation",
            helpful_count: 31,
            verified_purchase: true
          },
          {
            id: 4,
            customer_name: "David K.",
            rating: 5,
            title: "Outstanding Customer Support",
            comment: "When I had an issue with my order, the customer support team was incredibly helpful and resolved everything quickly. Their attention to detail and commitment to customer satisfaction is remarkable.",
            date: "2024-01-08",
            product_name: "Customer Support",
            helpful_count: 15,
            verified_purchase: true
          },
          {
            id: 5,
            customer_name: "Jennifer P.",
            rating: 5,
            title: "Premium Products, Premium Service",
            comment: "The quality of products I've received from CartAway is consistently excellent. Their luxury home delivery service made the entire experience feel special and premium.",
            date: "2024-01-05",
            product_name: "Luxury Home Delivery",
            helpful_count: 27,
            verified_purchase: true
          }
        ];
        
        setReviews(mockReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load customer reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-rotate reviews
  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const handleLike = (reviewId: number) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
    
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful_count: review.helpful_count + (likedReviews.has(reviewId) ? -1 : 1) }
        : review
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-warm-amber-500 fill-current' : 'text-neutral-300'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-warm opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-sunset opacity-5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-down">
            <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Real experiences from our valued customers
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse w-full max-w-4xl">
              <div className="bg-neutral-200 h-64 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-neutral-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-premium"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-warm opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-sunset opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-fire opacity-10 rounded-full blur-xl animate-float"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow">
              <Quote className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Real experiences from our valued customers who trust us with their luxury shopping needs.
          </p>
        </div>

        {/* Reviews Carousel */}
        {reviews.length > 0 && (
          <div className="mb-16">
            <div className="relative max-w-4xl mx-auto">
              {/* Main Review */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warm-orange-50 to-warm-rose-50 p-8 lg:p-12">
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6">
                    <Quote className="w-8 h-8 text-warm-orange-400 opacity-30" />
                  </div>
                  
                  {/* Review Content */}
                  <div className="space-y-6">
                    {/* Rating and Title */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {renderStars(reviews[currentIndex].rating)}
                        <span className="text-sm text-neutral-600 ml-2">
                          {reviews[currentIndex].rating}.0 out of 5
                        </span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-display text-neutral-900">
                        {reviews[currentIndex].title}
                      </h3>
                    </div>
                    
                    {/* Review Text */}
                    <p className="text-lg text-neutral-600 leading-relaxed">
                      "{reviews[currentIndex].comment}"
                    </p>
                    
                    {/* Customer Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center text-white font-semibold">
                          {reviews[currentIndex].customer_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-heading text-neutral-900">
                            {reviews[currentIndex].customer_name}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {formatDate(reviews[currentIndex].date)}
                          </div>
                        </div>
                        {reviews[currentIndex].verified_purchase && (
                          <div className="px-2 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                            Verified Purchase
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike(reviews[currentIndex].id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                            likedReviews.has(reviews[currentIndex].id)
                              ? 'bg-gradient-accent text-white'
                              : 'bg-white/80 text-neutral-600 hover:bg-white'
                          }`}
                          aria-label="Mark as helpful"
                          title="Mark as helpful"
                        >
                          <Heart className={`w-4 h-4 ${likedReviews.has(reviews[currentIndex].id) ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">
                            {reviews[currentIndex].helpful_count}
                          </span>
                        </button>
                        <button 
                          className="flex items-center gap-2 px-4 py-2 bg-white/80 text-neutral-600 rounded-lg hover:bg-white transition-all duration-300"
                          aria-label="Reply to review"
                          title="Reply to review"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-warm rounded-full opacity-30 animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-sunset rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-center mt-8 space-x-4">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                  className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-300 group hover:scale-110"
                  aria-label="Previous review"
                  title="Previous review"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:stroke-primary-500 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                </button>
                
                {/* Dots */}
                <div className="flex space-x-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-gradient-warm scale-125' 
                          : 'bg-neutral-300 hover:bg-neutral-400'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                      title={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % reviews.length)}
                  className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-300 group hover:scale-110"
                  aria-label="Next review"
                  title="Next review"
                >
                  <ChevronRight className="w-6 h-6 group-hover:stroke-primary-500 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="group animate-fade-in-up" style={{ animationDelay: '0s' }}>
                <div className="text-4xl font-display text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
                  4.9/5
                </div>
                <div className="text-lg font-heading text-neutral-800 mb-2">Average Rating</div>
                <div className="text-sm text-neutral-500">From 10,000+ reviews</div>
              </div>
              
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-display text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
                  98%
                </div>
                <div className="text-lg font-heading text-neutral-800 mb-2">Satisfaction Rate</div>
                <div className="text-sm text-neutral-500">Happy customers</div>
              </div>
              
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-display text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-lg font-heading text-neutral-800 mb-2">Support Available</div>
                <div className="text-sm text-neutral-500">Always here to help</div>
              </div>
              
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl font-display text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
                  50K+
                </div>
                <div className="text-lg font-heading text-neutral-800 mb-2">Happy Customers</div>
                <div className="text-sm text-neutral-500">Trust us daily</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button className="btn-premium group">
            Write a Review
            <MessageCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
