"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Globe, Heart, Star, Shield, Sparkles, TrendingUp, Zap, Crown, ArrowRight, CheckCircle,
  Clock, Truck, Package, ShoppingBag, Eye, Share2, Bookmark, Calendar, MapPin, Phone, Mail, 
  MessageCircle, BarChart, Target, Lightbulb, Rocket, Coffee, Gift, Flame, CheckCircle2
} from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';

const AboutPage: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState(false);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTimeline, setCurrentTimeline] = useState(0);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeline((prev) => (prev + 1) % timeline.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Happy Customers', color: 'text-gradient-warm', icon: Users },
    { value: '1,000+', label: 'Premium Products', color: 'text-gradient-fire', icon: Package },
    { value: '50+', label: 'Brands', color: 'text-gradient-sunset', icon: ShoppingBag },
    { value: '4.9★', label: 'Customer Rating', color: 'text-gradient-rose', icon: Star }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Founded',
      description: 'CartAway was born with a vision to revolutionize online shopping',
      icon: Rocket,
      color: 'bg-gradient-warm'
    },
    {
      year: '2021',
      title: 'First 1000 Customers',
      description: 'Reached our first major milestone with 1000 satisfied customers',
      icon: Target,
      color: 'bg-gradient-fire'
    },
    {
      year: '2022',
      title: 'Expansion',
      description: 'Expanded to 50+ premium brands and launched mobile app',
      icon: Globe,
      color: 'bg-gradient-sunset'
    },
    {
      year: '2023',
      title: 'Award Winner',
      description: 'Won Best E-commerce Platform at Digital Commerce Awards',
      icon: Award,
      color: 'bg-gradient-rose'
    },
    {
      year: '2024',
      title: 'Global Reach',
      description: 'Serving customers across 25+ countries with 10,000+ happy customers',
      icon: Crown,
      color: 'bg-gradient-primary'
    }
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      avatar: '👨‍💼',
      gradient: 'bg-gradient-warm',
      description: 'Passionate about creating exceptional shopping experiences and building lasting customer relationships.',
      achievements: ['15+ years experience', 'E-commerce expert', 'Customer-focused leader'],
      email: 'john@cartaway.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      social: {
        linkedin: 'https://linkedin.com/in/johnsmith',
        twitter: 'https://twitter.com/johnsmith',
        github: 'https://github.com/johnsmith'
      },
      skills: ['Strategic Planning', 'Team Leadership', 'Customer Experience', 'Business Development']
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      avatar: '👩‍💼',
      gradient: 'bg-gradient-fire',
      description: 'Dedicated to ensuring smooth operations and maintaining our high standards of quality and service.',
      achievements: ['Operations specialist', 'Quality assurance', 'Process optimization'],
      email: 'sarah@cartaway.com',
      phone: '+1 (555) 123-4568',
      location: 'San Francisco, CA',
      social: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson'
      },
      skills: ['Operations Management', 'Quality Control', 'Process Improvement', 'Team Coordination']
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      avatar: '👨‍💻',
      gradient: 'bg-gradient-sunset',
      description: 'Leading our technology initiatives to create seamless and innovative shopping experiences.',
      achievements: ['Tech innovator', 'Platform architect', 'Digital transformation'],
      email: 'mike@cartaway.com',
      phone: '+1 (555) 123-4569',
      location: 'Seattle, WA',
      social: {
        linkedin: 'https://linkedin.com/in/mikechen',
        github: 'https://github.com/mikechen'
      },
      skills: ['Software Architecture', 'Cloud Computing', 'AI/ML', 'System Design']
    }
  ];

  const values = [
    {
      icon: Star,
      title: 'Quality',
      description: 'We never compromise on quality. Every product in our collection is carefully selected to meet our high standards.',
      gradient: 'bg-gradient-warm',
      features: ['Premium Selection', 'Quality Assurance', 'Rigorous Testing'],
      color: 'text-gradient-warm'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Building lasting relationships with our customers through transparency, reliability, and exceptional service.',
      gradient: 'bg-gradient-fire',
      features: ['Transparent Pricing', 'Secure Transactions', 'Reliable Service'],
      color: 'text-gradient-fire'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Creating a vibrant community of shoppers who share our passion for quality and exceptional experiences.',
      gradient: 'bg-gradient-sunset',
      features: ['Customer Support', 'Community Events', 'Feedback Integration'],
      color: 'text-gradient-sunset'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Best E-commerce 2023',
      organization: 'Digital Commerce Awards',
      description: 'Recognized for outstanding customer experience and innovation',
      year: '2023',
      color: 'bg-gradient-warm'
    },
    {
      icon: Star,
      title: 'Customer Choice',
      organization: 'Shopping Excellence Awards',
      description: 'Voted best online shopping platform by customers',
      year: '2023',
      color: 'bg-gradient-fire'
    },
    {
      icon: Heart,
      title: 'Most Loved Brand',
      organization: 'Consumer Choice Awards',
      description: 'Highest customer satisfaction and brand loyalty',
      year: '2022',
      color: 'bg-gradient-sunset'
    },
    {
      icon: Crown,
      title: 'Innovation Award',
      organization: 'Tech Innovation Summit',
      description: 'Pioneering new technologies in e-commerce',
      year: '2022',
      color: 'bg-gradient-rose'
    }
  ];

  const handleTeamMemberClick = (member: any) => {
    setSelectedTeamMember(member);
    setShowTeamModal(true);
  };

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading our story..."
        showProgress={true}
        progress={45}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-sunset opacity-8 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-fire opacity-8 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-display text-gradient">About CartAway</h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We're passionate about bringing you the finest products and exceptional shopping experiences. 
            Our mission is to make premium shopping accessible to everyone.
          </p>
          
          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">2020</div>
              <div className="text-sm text-neutral-600">Founded</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">24/7</div>
              <div className="text-sm text-neutral-600">Support</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">100%</div>
              <div className="text-sm text-neutral-600">Secure</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-fire rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">Global</div>
              <div className="text-sm text-neutral-600">Reach</div>
            </div>
          </div>
        </div>

        {/* Enhanced Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 p-8 hover-lift transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Our Mission</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              To provide our customers with curated, high-quality products that enhance their lifestyle 
              while delivering exceptional service and seamless shopping experiences.
            </p>
            <div className="flex items-center gap-2 text-primary-600 font-medium">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 p-8 hover-lift transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-fire rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display text-neutral-900 mb-4">Our Vision</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              To become the leading destination for premium lifestyle products, known for quality, 
              innovation, and customer satisfaction across the globe.
            </p>
            <div className="flex items-center gap-2 text-primary-600 font-medium">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Enhanced Timeline */}
        <div className="mb-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-primary">Our Journey</h2>
            </div>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-accent-500"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 px-8">
                    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-6 hover-lift transition-all duration-300 ${
                      currentTimeline === index ? 'ring-2 ring-primary-500 shadow-glow' : ''
                    }`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-display text-gradient font-bold">{item.year}</div>
                          <h3 className="text-lg font-display text-neutral-900">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-neutral-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className={`w-8 h-8 ${item.color} rounded-full border-4 border-white shadow-lg ${
                      currentTimeline === index ? 'animate-pulse' : ''
                    }`}></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Values */}
        <div className="mb-20 animate-fade-in-up">
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
                <div className={`w-20 h-20 ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-display text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 mb-4">
                  {value.description}
                </p>
                <div className="space-y-2">
                  {value.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-primary-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div id="stats-section" className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 p-8 mb-20 relative overflow-hidden animate-fade-in-up">
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
                  <div className={`w-16 h-16 ${stat.color.replace('text-', 'bg-')} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
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
        <div className="mb-20 animate-fade-in-up">
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
                  className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 p-6 text-center group hover-lift transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredTeam(index)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  onClick={() => handleTeamMemberClick(member)}
                >
                  <div className={`w-24 h-24 ${member.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-display text-neutral-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 mb-3 font-medium">{member.role}</p>
                  <p className="text-neutral-600 text-sm mb-4">
                    {member.description}
                  </p>
                  <div className="space-y-2">
                    {member.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center justify-center gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-3 h-3 text-primary-500" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Contact */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex justify-center space-x-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 text-neutral-400 hover:text-primary-500 transition-colors"
                        title="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="p-2 text-neutral-400 hover:text-primary-500 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        className="p-2 text-neutral-400 hover:text-primary-500 transition-colors"
                        title="View profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Awards */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-12 text-center relative overflow-hidden animate-fade-in-up">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-center gap-4 group">
                  <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-neutral-900">{achievement.title}</h3>
                    <p className="text-neutral-600 text-sm">{achievement.organization}</p>
                    <p className="text-neutral-500 text-xs">{achievement.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      {showTeamModal && selectedTeamMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-display text-neutral-900">{selectedTeamMember.name}</h2>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className={`w-32 h-32 ${selectedTeamMember.gradient} rounded-2xl flex items-center justify-center mx-auto`}>
                    <span className="text-4xl">{selectedTeamMember.avatar}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-display text-neutral-900">{selectedTeamMember.role}</h3>
                    <p className="text-primary-600 font-medium">{selectedTeamMember.location}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-display text-neutral-900 mb-2">About</h4>
                    <p className="text-neutral-600">{selectedTeamMember.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-display text-neutral-900 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMember.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-display text-neutral-900 mb-2">Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${selectedTeamMember.email}`} className="hover:text-primary-600 transition-colors">
                          {selectedTeamMember.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${selectedTeamMember.phone}`} className="hover:text-primary-600 transition-colors">
                          {selectedTeamMember.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTeamMember.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
