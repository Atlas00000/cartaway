"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, User, ArrowRight, Heart, Share2, Eye } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  read_time: number;
  category: string;
  image_url?: string;
  likes_count: number;
  views_count: number;
  slug: string;
}

const LifestyleBlogSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // For now, we'll use mock data since we don't have a blog API yet
        // In a real implementation, this would be: const response = await api.getBlogPosts();
        const mockBlogPosts: BlogPost[] = [
          {
            id: 1,
            title: "10 Essential Items for a Minimalist Lifestyle",
            excerpt: "Discover how to declutter your life and embrace the beauty of less with these must-have minimalist essentials.",
            content: "Minimalism isn't just about having fewer things—it's about having the right things. In this comprehensive guide, we explore the essential items that every minimalist needs in their home and wardrobe...",
            author: "Sarah Johnson",
            published_date: "2024-01-15",
            read_time: 8,
            category: "Lifestyle",
            likes_count: 1247,
            views_count: 8923,
            slug: "minimalist-lifestyle-essentials"
          },
          {
            id: 2,
            title: "Sustainable Shopping: How to Make Eco-Friendly Choices",
            excerpt: "Learn how to shop responsibly and reduce your environmental impact while still enjoying quality products.",
            content: "Sustainable shopping is more than just a trend—it's a necessary shift in how we consume. From choosing eco-friendly materials to supporting ethical brands, here's your complete guide...",
            author: "Michael Chen",
            published_date: "2024-01-12",
            read_time: 12,
            category: "Sustainability",
            likes_count: 2156,
            views_count: 15678,
            slug: "sustainable-shopping-guide"
          },
          {
            id: 3,
            title: "The Art of Gift Giving: Thoughtful Presents for Every Occasion",
            excerpt: "Master the art of gift giving with our curated selection of thoughtful presents that will delight your loved ones.",
            content: "Gift giving is an art form that combines thoughtfulness, creativity, and understanding. Whether it's a birthday, anniversary, or just because, the perfect gift can strengthen relationships...",
            author: "Emma Rodriguez",
            published_date: "2024-01-10",
            read_time: 6,
            category: "Gift Guide",
            likes_count: 892,
            views_count: 5432,
            slug: "art-of-gift-giving"
          },
          {
            id: 4,
            title: "Home Organization: Transform Your Space with Smart Storage Solutions",
            excerpt: "Revolutionize your living space with innovative storage solutions that combine functionality with style.",
            content: "A well-organized home is the foundation for a peaceful and productive life. From clever storage hacks to beautiful organizational systems, discover how to transform your space...",
            author: "David Kim",
            published_date: "2024-01-08",
            read_time: 10,
            category: "Home & Living",
            likes_count: 1678,
            views_count: 9876,
            slug: "home-organization-guide"
          }
        ];
        
        setBlogPosts(mockBlogPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = (postId: number) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count + 1 }
        : post
    ));
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/blog/${post.slug}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.title} - ${window.location.origin}/blog/${post.slug}`);
    }
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
              Lifestyle Blog
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover tips, trends, and inspiration for your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-neutral-200 aspect-video rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
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
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-fire opacity-10 rounded-full blur-xl animate-float"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-neutral-900 mb-6">
            Lifestyle Blog
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover tips, trends, and inspiration for your lifestyle. From minimalist living to sustainable shopping, 
            we've got you covered with expert insights and practical advice.
          </p>
        </div>

        {/* Featured Blog Post */}
        {blogPosts.length > 0 && (
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warm-orange-50 to-warm-rose-50">
              <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
                {/* Content */}
                <div className="space-y-6 animate-fade-in-left">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-gradient-warm text-white text-sm font-semibold rounded-full">
                      {blogPosts[0].category}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(blogPosts[0].published_date)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-display text-neutral-900 leading-tight">
                    {blogPosts[0].title}
                  </h3>
                  
                  <p className="text-lg text-neutral-600 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{blogPosts[0].read_time} min read</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="btn-premium group">
                      Read More
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <button 
                      onClick={() => handleLike(blogPosts[0].id)}
                      className="relative p-3 text-neutral-700 hover:text-accent-600 transition-all duration-300 group hover:scale-110"
                      aria-label="Like article"
                      title="Like article"
                    >
                      <Heart className="w-6 h-6 group-hover:fill-accent-500 group-hover:stroke-accent-500 transition-all duration-300" />
                      <span className="absolute -top-1 -right-1 bg-gradient-accent text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                        {blogPosts[0].likes_count}
                      </span>
                      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                    </button>
                    <button 
                      onClick={() => handleShare(blogPosts[0])}
                      className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-300 group hover:scale-110"
                      aria-label="Share article"
                      title="Share article"
                    >
                      <Share2 className="w-6 h-6 group-hover:stroke-primary-500 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
                
                {/* Image */}
                <div className="relative animate-fade-in-right">
                  <div className="relative w-full h-80 lg:h-96">
                    <div className="absolute inset-0 bg-gradient-warm opacity-20 rounded-2xl blur-2xl"></div>
                    <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-premium">
                      <div className="text-6xl">📚</div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-sunset rounded-full opacity-60 animate-float"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-fire rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {blogPosts.slice(1).length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post, index) => (
                <div
                  key={post.id}
                  className="group cursor-pointer animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 transition-all duration-300 group-hover:shadow-premium">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-warm-orange-50 to-warm-rose-50 flex items-center justify-center">
                      <div className="text-4xl">📖</div>
                      <div className="absolute top-3 left-3">
                        <div className="px-2 py-1 bg-gradient-warm text-white text-xs font-semibold rounded-full">
                          {post.category}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.published_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.read_time} min</span>
                        </div>
                      </div>
                      
                      <h3 className="font-heading text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-neutral-600 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(post.id);
                            }}
                            className="relative p-2 text-neutral-400 hover:text-accent-600 transition-all duration-300 group-hover:scale-110"
                            aria-label="Like article"
                            title="Like article"
                          >
                            <Heart className="w-4 h-4 group-hover:fill-accent-500 group-hover:stroke-accent-500 transition-all duration-300" />
                            <span className="absolute -top-1 -right-1 bg-gradient-accent text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                              {post.likes_count}
                            </span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(post);
                            }}
                            className="relative p-2 text-neutral-400 hover:text-primary-600 transition-all duration-300 group-hover:scale-110"
                            aria-label="Share article"
                            title="Share article"
                          >
                            <Share2 className="w-4 h-4 group-hover:stroke-primary-500 transition-all duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button className="btn-premium group">
                View All Articles
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LifestyleBlogSection;
