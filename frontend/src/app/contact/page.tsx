"use client";

import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles, CheckCircle, ArrowRight, User, MessageSquare,
  Shield, Truck, Package, Star, Heart, Zap, Globe, Award, CheckCircle2, Calendar, Share2, Bookmark,
  Eye, Filter, Grid, List, ChevronLeft, ChevronRight, Sliders, Grid3X3, BarChart3, RefreshCw, Tag,
  DollarSign, Percent, Gift, Flame, AlertCircle, Info, Users, Target, Lightbulb, Rocket, Coffee
} from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [supportAgent, setSupportAgent] = useState('Sarah Johnson');
  const [agentStatus, setAgentStatus] = useState('online');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setFormLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', category: '', priority: 'normal' });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: currentMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');
      
      // Simulate agent response
      setTimeout(() => {
        const agentResponse = {
          id: Date.now() + 1,
          text: `Thank you for your message! I'm ${supportAgent}, and I'll be happy to help you. How can I assist you today?`,
          sender: 'agent',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, agentResponse]);
      }, 1000);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@cartaway.com',
      description: 'Get a response within 24 hours',
      gradient: 'bg-gradient-warm',
      action: 'Send Email',
      href: 'mailto:support@cartaway.com',
      responseTime: '24 hours',
      availability: '24/7'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (555) 123-4567',
      description: 'Available Mon-Fri, 9AM-6PM EST',
      gradient: 'bg-gradient-fire',
      action: 'Call Now',
      href: 'tel:+15551234567',
      responseTime: 'Immediate',
      availability: 'Business Hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123 Commerce St, NY 10001',
      description: 'Visit our headquarters',
      gradient: 'bg-gradient-sunset',
      action: 'Get Directions',
      href: 'https://maps.google.com',
      responseTime: 'N/A',
      availability: 'Mon-Fri 9AM-5PM'
    }
  ];

  const supportFeatures = [
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for urgent matters',
      color: 'text-gradient-warm',
      gradient: 'bg-gradient-warm'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant messaging with our support team',
      color: 'text-gradient-fire',
      gradient: 'bg-gradient-fire'
    },
    {
      icon: CheckCircle,
      title: 'Quick Response',
      description: 'Average response time under 2 hours',
      color: 'text-gradient-sunset',
      gradient: 'bg-gradient-sunset'
    },
    {
      icon: Shield,
      title: 'Secure Communication',
      description: 'All communications are encrypted and secure',
      color: 'text-gradient-rose',
      gradient: 'bg-gradient-rose'
    }
  ];

  const faqItems = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond within 2 hours during business hours, and within 24 hours for email inquiries.',
      category: 'Response Time'
    },
    {
      question: 'Do you offer 24/7 support?',
      answer: 'Yes, we provide 24/7 support for urgent matters via phone, and our live chat is available during extended hours.',
      category: 'Availability'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, you can track your order through your account dashboard or by contacting our support team.',
      category: 'Orders'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers.',
      category: 'Payment'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide with competitive shipping rates.',
      category: 'Shipping'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items, with free returns for defective products.',
      category: 'Returns'
    }
  ];

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: Info },
    { value: 'order', label: 'Order Support', icon: Package },
    { value: 'technical', label: 'Technical Issue', icon: Zap },
    { value: 'billing', label: 'Billing & Payment', icon: DollarSign },
    { value: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { value: 'returns', label: 'Returns & Refunds', icon: RefreshCw }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading contact information..."
        showProgress={true}
        progress={40}
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
            <h1 className="text-5xl font-display text-gradient">Contact Us</h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Get in touch with our support team. We're here to help you with any questions or concerns.
          </p>
          
          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">24/7</div>
              <div className="text-sm text-neutral-600">Support</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">&lt;2h</div>
              <div className="text-sm text-neutral-600">Response</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">100%</div>
              <div className="text-sm text-neutral-600">Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 hover-lift group">
              <div className="w-12 h-12 bg-gradient-fire rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display text-gradient font-bold mb-1">50+</div>
              <div className="text-sm text-neutral-600">Countries</div>
            </div>
          </div>
        </div>

        {/* Enhanced Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 p-8 text-center hover-lift transition-all duration-300 group">
              <div className={`w-16 h-16 ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display text-neutral-900 mb-2">{method.title}</h3>
              <p className="text-neutral-600 mb-2 font-medium">{method.value}</p>
              <p className="text-sm text-neutral-500 mb-4">{method.description}</p>
              
              {/* Enhanced Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Response Time:</span>
                  <span className="font-medium">{method.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Availability:</span>
                  <span className="font-medium">{method.availability}</span>
                </div>
              </div>
              
              <a
                href={method.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 group-hover:scale-105"
              >
                <span>{method.action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form and Support Features */}
        <div className="grid lg:grid-cols-2 gap-12 animate-fade-in-up">
          {/* Enhanced Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-fire rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-display text-gradient-fire">Send us a Message</h2>
            </div>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display text-neutral-900 mb-2">Message Sent!</h3>
                <p className="text-neutral-600 mb-4">Thank you for contacting us. We'll get back to you soon.</p>
                <div className="text-sm text-neutral-500">
                  <p>Reference ID: #CT-{Date.now().toString().slice(-6)}</p>
                  <p>Expected response: Within 24 hours</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                      aria-label="Select support category"
                      title="Select support category"
                    >
                      <option value="">Select Category</option>
                      {supportCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative group">
                    <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                      aria-label="Select priority level"
                      title="Select priority level"
                    >
                      {priorityLevels.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200"
                  />
                </div>
                
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-3 text-neutral-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-primary-200 resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Enhanced Support Features */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-sunset rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-display text-gradient-sunset">Why Choose Our Support?</h2>
              </div>
              
              <div className="space-y-6">
                {supportFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display text-neutral-900 mb-1">{feature.title}</h3>
                      <p className="text-neutral-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat Button */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-white/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-fire rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-display text-neutral-900">Live Chat Available</h3>
                  <p className="text-sm text-neutral-600">Chat with {supportAgent} • {agentStatus}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLiveChat(true)}
                className="w-full px-4 py-3 bg-gradient-fire text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Live Chat
              </button>
            </div>

            {/* Enhanced FAQ Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
              <h3 className="text-xl font-display text-neutral-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="border-b border-neutral-200 pb-3">
                    <h4 className="font-medium text-neutral-900 mb-1">{item.question}</h4>
                    <p className="text-sm text-neutral-600">{item.answer}</p>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View All FAQs →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-warm opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <h3 className="text-3xl font-display text-neutral-900 mb-4">
                Need Immediate Assistance?
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Our support team is ready to help you with any questions or concerns. 
                Don't hesitate to reach out!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+15551234567"
                  className="btn-premium group"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Call Now</span>
                </a>
                <a
                  href="mailto:support@cartaway.com"
                  className="bg-white/80 backdrop-blur-sm border border-white/30 text-neutral-700 font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:shadow-premium transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Send Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-primary p-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display">Live Chat</h3>
                    <p className="text-sm opacity-90">{supportAgent} • {agentStatus}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLiveChat(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
                  title="Close chat"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 h-64 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-neutral-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start a conversation with our support team</p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-primary text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="px-4 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
