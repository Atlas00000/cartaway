"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles, CheckCircle, ArrowRight, User, MessageSquare } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@cartaway.com',
      description: 'Get a response within 24 hours',
      gradient: 'bg-gradient-warm',
      action: 'Send Email',
      href: 'mailto:support@cartaway.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Available Mon-Fri, 9AM-6PM EST',
      gradient: 'bg-gradient-fire',
      action: 'Call Now',
      href: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Commerce St, NY 10001',
      description: 'Visit our headquarters',
      gradient: 'bg-gradient-sunset',
      action: 'Get Directions',
      href: 'https://maps.google.com'
    }
  ];

  const supportFeatures = [
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for urgent matters',
      color: 'text-gradient-warm'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant messaging with our support team',
      color: 'text-gradient-fire'
    },
    {
      icon: CheckCircle,
      title: 'Quick Response',
      description: 'Average response time under 2 hours',
      color: 'text-gradient-sunset'
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
            <h1 className="text-4xl lg:text-6xl font-display text-gradient-warm">Contact Us</h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Get in touch with our support team. We&apos;re here to help you with any questions or concerns.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-warm mb-1">24/7</div>
              <div className="text-sm text-neutral-600">Support</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift">
              <div className="text-2xl font-display text-gradient-fire mb-1">&lt;2h</div>
              <div className="text-sm text-neutral-600">Response</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover-lift md:col-span-1 col-span-2">
              <div className="text-2xl font-display text-gradient-sunset mb-1">100%</div>
              <div className="text-sm text-neutral-600">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Enhanced Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8 text-center hover-lift transition-all duration-300 group">
              <div className={`w-16 h-16 ${method.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display text-neutral-900 mb-2">{method.title}</h3>
              <p className="text-neutral-600 mb-2 font-medium">{method.value}</p>
              <p className="text-sm text-neutral-500 mb-4">{method.description}</p>
              <a
                href={method.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-warm text-white font-semibold rounded-lg hover:shadow-glow-warm transition-all duration-300 group-hover:scale-105"
              >
                <span>{method.action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form and Support Features */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-fire rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-display text-gradient-fire">Send us a Message</h2>
            </div>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display text-neutral-900 mb-2">Message Sent!</h3>
                <p className="text-neutral-600">Thank you for contacting us. We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-warm-orange-500 transition-colors duration-300" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-warm-orange-500 transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                    />
                  </div>
                </div>
                
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-warm-orange-500 transition-colors duration-300" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200"
                  />
                </div>
                
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-3 text-neutral-400 w-5 h-5 group-focus-within:text-warm-orange-500 transition-colors duration-300" />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-warm-orange-500 focus:border-transparent transition-all duration-300 group-hover:border-warm-orange-200 resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
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
                    <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display text-neutral-900 mb-1">{feature.title}</h3>
                      <p className="text-neutral-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
              <h3 className="text-xl font-display text-neutral-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h4 className="font-medium text-neutral-900 mb-1">How quickly do you respond?</h4>
                  <p className="text-sm text-neutral-600">We typically respond within 2 hours during business hours.</p>
                </div>
                <div className="border-b border-neutral-200 pb-3">
                  <h4 className="font-medium text-neutral-900 mb-1">Do you offer 24/7 support?</h4>
                  <p className="text-sm text-neutral-600">Yes, we provide 24/7 support for urgent matters via phone.</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">Can I track my order?</h4>
                  <p className="text-sm text-neutral-600">Yes, you can track your order through your account dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-warm-orange-50 to-warm-rose-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-warm opacity-10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-fire opacity-8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <h3 className="text-3xl font-display text-neutral-900 mb-4">
                Need Immediate Assistance?
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Our support team is ready to help you with any questions or concerns. 
                Don&apos;t hesitate to reach out!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+15551234567"
                  className="px-8 py-4 bg-gradient-warm text-white font-semibold rounded-xl hover:shadow-glow-warm transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Call Now
                </a>
                <a
                  href="mailto:support@cartaway.com"
                  className="px-8 py-4 bg-white border border-warm-orange-200 text-neutral-700 font-semibold rounded-xl hover:bg-warm-orange-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
