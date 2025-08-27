import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Welcome to Our
              <span className="block text-indigo-200">E-Commerce Platform</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Discover amazing products, enjoy seamless shopping, and experience the future of online retail.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We provide everything you need for a great shopping experience.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center">
                <ShoppingBag className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Wide Selection</h3>
              <p className="mt-2 text-sm text-gray-600">
                Browse through thousands of products across multiple categories.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Star className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Quality Products</h3>
              <p className="mt-2 text-sm text-gray-600">
                All products are carefully curated and quality-assured.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Truck className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Fast Delivery</h3>
              <p className="mt-2 text-sm text-gray-600">
                Quick and reliable shipping to your doorstep.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Shopping</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your data and transactions are protected with industry-standard security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Start Shopping?
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join thousands of satisfied customers and discover amazing products today.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Browse Products
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
