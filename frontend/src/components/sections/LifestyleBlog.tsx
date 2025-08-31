"use client";

import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, User, Heart, Share2, BookOpen, Star, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';

const LifestyleBlog: React.FC = () => {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tech Gadgets for 2024",
      excerpt: "Discover the must-have technology that will transform your daily routine and enhance your productivity.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Technology",
      image: "/modern-tech-gadgets-and-electronics.png",
      likes: 234,
      trending: true,
      featured: true,
      tags: ["Tech", "Gadgets", "Productivity", "Innovation"]
    },
    {
      id: 2,
      title: "Sustainable Living: A Complete Guide",
      excerpt: "Learn how to adopt eco-friendly practices in your daily life while maintaining luxury and comfort.",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "8 min read",
      category: "Lifestyle",
      image: "/curated-lifestyle-products-and-accessories.png",
      likes: 189,
      trending: false,
      featured: true,
      tags: ["Sustainability", "Eco-friendly", "Lifestyle", "Green Living"]
    },
    {
      id: 3,
      title: "The Art of Minimalist Fashion",
      excerpt: "Master the principles of capsule wardrobes and create timeless style with fewer, better pieces.",
      author: "Emma Rodriguez",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Fashion",
      image: "/luxury-premium-products-showcase.png",
      likes: 156,
      trending: true,
      featured: false,
      tags: ["Fashion", "Minimalism", "Style", "Capsule Wardrobe"]
    },
    {
      id: 4,
      title: "Home Office Essentials for Remote Work",
      excerpt: "Transform your workspace with these essential items that boost productivity and comfort.",
      author: "David Kim",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Work",
      image: "/premium-ceramic-coffee-mug-set.png",
      likes: 203,
      trending: false,
      featured: true,
      tags: ["Remote Work", "Productivity", "Home Office", "Ergonomics"]
    },
    {
      id: 5,
      title: "Wellness Trends That Actually Work",
      excerpt: "Evidence-based wellness practices that will improve your physical and mental health in 2024.",
      author: "Lisa Thompson",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Wellness",
      image: "/smart-fitness-watch.png",
      likes: 278,
      trending: true,
      featured: false,
      tags: ["Wellness", "Health", "Fitness", "Mental Health"]
    },
    {
      id: 6,
      title: "Smart Home Automation Guide",
      excerpt: "Build the perfect smart home ecosystem with these carefully selected devices and systems.",
      author: "Alex Morgan",
      date: "2024-01-03",
      readTime: "10 min read",
      category: "Technology",
      image: "/premium-wireless-headphones.png",
      likes: 145,
      trending: false,
      featured: true,
      tags: ["Smart Home", "Automation", "IoT", "Technology"]
    }
  ];

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = (postId: number) => {
    // Implement share functionality
    console.log(`Sharing post ${postId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-warm opacity-5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Lifestyle Blog
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover insights, trends, and inspiration to elevate your lifestyle with our curated content
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Trending Articles
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Expert Insights
            </span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Lifestyle Tips
            </span>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16 animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Trending
                  </div>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blogPosts[0].date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blogPosts[0].readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blogPosts[0].author}
                    </span>
                  </div>
                  <h3 className="text-3xl font-display text-neutral-900 leading-tight">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-lg text-neutral-600 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blogPosts[0].tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full hover:bg-neutral-200 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(blogPosts[0].id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          likedPosts.has(blogPosts[0].id)
                            ? 'bg-red-50 text-red-600'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedPosts.has(blogPosts[0].id) ? 'fill-current' : ''}`} />
                        {blogPosts[0].likes + (likedPosts.has(blogPosts[0].id) ? 1 : 0)}
                      </button>
                      <button
                        onClick={() => handleShare(blogPosts[0].id)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-all duration-300"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                    <Button className="btn-premium group">
                      <span className="relative z-10">Read More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.slice(1).map((post, index) => (
            <article
              key={post.id}
              className={`group relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-fade-in-up cursor-pointer ${
                hoveredPost === post.id ? 'ring-2 ring-primary-500' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
              onClick={() => window.location.href = `/blog/${post.id}`}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {post.trending && (
                    <div className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  )}
                  {post.featured && (
                    <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <Star className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-display text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-neutral-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full hover:bg-neutral-200 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium rounded-full">
                      +{post.tags.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center gap-1 text-sm transition-all duration-300 ${
                        likedPosts.has(post.id)
                          ? 'text-red-600'
                          : 'text-neutral-500 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post.id);
                      }}
                      className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 transition-colors duration-300"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                  <span className="text-sm text-neutral-500">
                    by {post.author}
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </article>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Stay Updated with Our Latest Insights</h3>
            <p className="text-lg text-neutral-600 mb-6">Get exclusive content, tips, and trends delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-premium group"
                onClick={() => window.location.href = '/blog'}
              >
                <span className="relative z-10">View All Articles</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white hover:shadow-premium transition-all duration-300"
                onClick={() => window.location.href = '/newsletter'}
              >
                <span className="relative z-10">Subscribe to Newsletter</span>
                <BookOpen className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleBlog;
