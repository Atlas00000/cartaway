"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Heart, Star, ArrowRight, Zap, Shield, Truck } from "lucide-react"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const heroSlides = [
    {
      title: "Premium Collection",
      subtitle: "Discover Luxury",
      image: "/luxury-premium-products-showcase.png",
      cta: "Shop Collection",
    },
    {
      title: "Tech Essentials",
      subtitle: "Innovation Meets Style",
      image: "/modern-tech-gadgets-and-electronics.png",
      cta: "Explore Tech",
    },
    {
      title: "Lifestyle Curated",
      subtitle: "Elevate Your Everyday",
      image: "/curated-lifestyle-products-and-accessories.png",
      cta: "Browse Lifestyle",
    },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 1247,
      image: "/premium-wireless-headphones.png",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 249,
      originalPrice: null,
      rating: 4.9,
      reviews: 892,
      image: "/smart-fitness-watch.png",
      badge: "New",
    },
    {
      id: 3,
      name: "Minimalist Backpack",
      price: 89,
      originalPrice: 129,
      rating: 4.7,
      reviews: 634,
      image: "/minimalist-modern-backpack.png",
      badge: "Sale",
    },
    {
      id: 4,
      name: "Ceramic Coffee Mug Set",
      price: 45,
      originalPrice: null,
      rating: 4.6,
      reviews: 423,
      image: "/premium-ceramic-coffee-mug-set.png",
      badge: "Featured",
    },
  ]

  const categories = [
    { name: "Electronics", icon: "⚡", count: "2.4k items" },
    { name: "Fashion", icon: "👔", count: "1.8k items" },
    { name: "Home & Living", icon: "🏠", count: "3.2k items" },
    { name: "Sports & Fitness", icon: "🏃", count: "1.1k items" },
    { name: "Beauty & Care", icon: "💄", count: "956 items" },
    { name: "Books & Media", icon: "📚", count: "2.7k items" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold font-space-grotesk text-primary">CartAway</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Categories
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Deals
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  New Arrivals
                </a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Brands
                </a>
              </nav>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for products..."
                  className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <img
            src={heroSlides[currentSlide].image || "/placeholder.svg"}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <p className="text-accent font-medium mb-2 font-dm-sans">{heroSlides[currentSlide].subtitle}</p>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 font-space-grotesk leading-tight">
              {heroSlides[currentSlide].title}
            </h2>
            <p className="text-xl mb-8 text-white/90 font-dm-sans">
              Experience premium quality with our carefully curated collection of products designed for the modern
              lifestyle.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              {heroSlides[currentSlide].cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 font-space-grotesk">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-0"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h4 className="font-semibold mb-2 font-space-grotesk">{category.name}</h4>
                  <p className="text-sm text-muted-foreground font-dm-sans">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold font-space-grotesk">Featured Products</h3>
            <Button variant="outline" className="group bg-transparent">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-0 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">{product.badge}</Badge>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2 font-space-grotesk group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary font-space-grotesk">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 font-space-grotesk">Free Shipping</h4>
              <p className="text-muted-foreground font-dm-sans">
                Free shipping on orders over $99. Fast and reliable delivery worldwide.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 font-space-grotesk">Secure Payment</h4>
              <p className="text-muted-foreground font-dm-sans">
                Your payment information is processed securely with industry-standard encryption.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 font-space-grotesk">24/7 Support</h4>
              <p className="text-muted-foreground font-dm-sans">
                Get help whenever you need it with our dedicated customer support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 font-space-grotesk">Stay in the Loop</h3>
          <p className="text-xl mb-8 text-primary-foreground/90 font-dm-sans">
            Get the latest updates on new products, exclusive deals, and more.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/70"
            />
            <Button variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 font-space-grotesk text-primary">CartAway</h4>
              <p className="text-muted-foreground mb-4 font-dm-sans">
                Your destination for premium products and exceptional shopping experiences.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  📘
                </Button>
                <Button variant="ghost" size="icon">
                  🐦
                </Button>
                <Button variant="ghost" size="icon">
                  📷
                </Button>
                <Button variant="ghost" size="icon">
                  💼
                </Button>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4 font-space-grotesk">Shop</h5>
              <ul className="space-y-2 text-muted-foreground font-dm-sans">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Sale Items
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 font-space-grotesk">Support</h5>
              <ul className="space-y-2 text-muted-foreground font-dm-sans">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 font-space-grotesk">Company</h5>
              <ul className="space-y-2 text-muted-foreground font-dm-sans">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground font-dm-sans">
            <p>&copy; 2024 CartAway. All rights reserved. Built with precision and care.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
