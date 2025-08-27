import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Platform',
  description: 'Modern e-commerce platform with Django backend and Next.js frontend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthInitializer>
      </body>
    </html>
  );
}
