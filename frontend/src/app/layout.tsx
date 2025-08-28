import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CartAway - Your Premium Shopping Destination",
  description: "Experience luxury shopping with curated products, exceptional service, and seamless delivery. Your lifestyle, elevated.",
  keywords: "luxury shopping, premium products, curated collection, lifestyle, fashion, electronics, home decor",
  authors: [{ name: "CartAway Team" }],
  openGraph: {
    title: "CartAway - Your Premium Shopping Destination",
    description: "Experience luxury shopping with curated products, exceptional service, and seamless delivery.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CartAway - Your Premium Shopping Destination",
    description: "Experience luxury shopping with curated products, exceptional service, and seamless delivery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
