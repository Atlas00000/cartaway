import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CartAway - Your Gateway to Premium Shopping',
  description: 'Discover curated products from top brands, delivered with excellence and backed by our commitment to quality.',
  keywords: 'ecommerce, shopping, premium products, online store, CartAway',
  authors: [{ name: 'CartAway Team' }],
  openGraph: {
    title: 'CartAway - Your Gateway to Premium Shopping',
    description: 'Discover curated products from top brands, delivered with excellence and backed by our commitment to quality.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CartAway - Your Gateway to Premium Shopping',
    description: 'Discover curated products from top brands, delivered with excellence and backed by our commitment to quality.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthInitializer />
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
