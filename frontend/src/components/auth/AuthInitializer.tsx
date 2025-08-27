'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

