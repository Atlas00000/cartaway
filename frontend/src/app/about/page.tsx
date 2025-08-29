"use client";

import React, { useState, useEffect } from 'react';
import { Users, Award, Globe, Heart, Star, Shield, Sparkles, TrendingUp, Zap, Crown, ArrowRight, CheckCircle } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState(false);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setAnimatedStats(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Happy Customers', color: 'text-gradient-warm' },
    { value: '1,000+', label: 'Premium Products', color: 'text-gradient-fire' },
    { value: '50+', label: 'Brands', color: 'text-gradient-sunset' },
    { value: '4.9★', label: 'Customer Rating', color: 'text-gradient-rose' }
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      avatar: '👨‍💼',
      gradient: 'bg-gradient-warm',
      description: 'Passionate about creating exceptional shopping experiences and building lasting customer relationships.',
      achievements: ['15+ years experience', 'E-commerce expert', 'Customer-focused leader']
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      avatar: '👩‍💼',
      gradient: 'bg-gradient-fire',
      description: 'Dedicated to ensuring smooth operations and maintaining our high standards of quality and service.',
      achievements: ['Operations specialist', 'Quality assurance', 'Process optimization']
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      avatar: '👨‍💻',
      gradient: 'bg-gradient-sunset',
      description: 'Leading our technology initiatives to create seamless and innovative shopping experiences.',
      achievements: ['Tech innovator', 'Platform architect', 'Digital transformation']
    }
  ];

  const values = [
    {
      icon: Star,
      title: 'Quality',
      description: 'We never compromise on quality. Every product in our collection is carefully selected to meet our high standards.',
      gradient: 'bg-gradient-warm',
      features: ['Premium Selection', 'Quality Assurance', 'Rigorous Testing']
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Building lasting relationships with our customers through transparency, reliability, and exceptional service.',
      gradient: 'bg-gradient-fire',
      features: ['Transparent Pricing', 'Secure Transactions', 'Reliable Service']
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Creating a vibrant community of shoppers who share our passion for quality and exceptional experiences.',
      gradient: 'bg-gradient-sunset',
      features: ['Customer Support', 'Community Events', 'Feedback Integration']
    }
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
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center shadow-glow-warm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-display text-gradient-warm">About CartAway</h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We&apos;re passionate about bringing you the finest products and exceptional shopping experiences. 
            Our mission is to make premium shopping accessible to everyone.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-warm mb-1">2020</div>
              <div className="text-sm text-neutral-600">Founded</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-fire mb-1">24/7</div>
              <div className="text-sm text-neutral-600">Support</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-sunset mb-1">100%</div>
              <div className="text-sm text-neutral-600">Secure</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-rose mb-1">Global</div>
              <div className="text-sm text-neutral-600">Reach</div>
            </div>
          </div>
        </div>

        {/* Enhanced Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8 hover-lift transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Our Mission</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              To provide our customers with curated, high-quality products that enhance their lifestyle 
              while delivering exceptional service and seamless shopping experiences.
            </p>
            <div className="flex items-center gap-2 text-warm-orange-600 font-medium">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8 hover-lift transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-fire rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Our Vision</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              To become the leading destination for premium lifestyle products, known for quality, 
              innovation, and customer satisfaction across the globe.
            </p>
            <div className="flex items-center gap-2 text-warm-orange-600 font-medium">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Enhanced Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-fire rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-fire">Our Values</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${value.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-display text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 mb-4">
                  {value.description}
                </p>
                <div className="space-y-2">
                  {value.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-warm-orange-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div id="stats-section" className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8 mb-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-sunset rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-3xl font-display text-gradient-sunset">CartAway by the Numbers</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-4xl font-display ${stat.color} mb-2 transition-all duration-1000 ${
                    animatedStats ? 'animate-bounce-slow' : ''
                  }`} style={{ animationDelay: `${index * 0.2}s` }}>
                    {stat.value}
                  </div>
                  <div className="text-neutral-600 group-hover:text-neutral-800 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-rose rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-rose">Meet Our Team</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => {
              const isHovered = hoveredTeam === index;
              
              return (
                <div 
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-6 text-center group hover-lift transition-all duration-300"
                  onMouseEnter={() => setHoveredTeam(index)}
                  onMouseLeave={() => setHoveredTeam(null)}
                >
                  <div className={`w-24 h-24 ${member.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-display text-neutral-900 mb-2">{member.name}</h3>
                  <p className="text-warm-orange-600 mb-3 font-medium">{member.role}</p>
                  <p className="text-neutral-600 text-sm mb-4">
                    {member.description}
                  </p>
                  <div className="space-y-2">
                    {member.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center justify-center gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-3 h-3 text-warm-orange-500" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Awards */}
        <div className="bg-gradient-to-r from-warm-orange-50 to-warm-rose-50 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-warm">Awards & Recognition</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center gap-4 group">
                <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-neutral-900">Best E-commerce 2023</h3>
                  <p className="text-neutral-600 text-sm">Digital Commerce Awards</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 group">
                <div className="w-12 h-12 bg-gradient-fire rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-neutral-900">Customer Choice</h3>
                  <p className="text-neutral-600 text-sm">Shopping Excellence Awards</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 group">
                <div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-neutral-900">Most Loved Brand</h3>
                  <p className="text-neutral-600 text-sm">Consumer Choice Awards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
