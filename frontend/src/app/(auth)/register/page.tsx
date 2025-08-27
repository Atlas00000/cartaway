'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validation';
import { useAuthStore } from '@/lib/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/');
    }
    
    // Clear any existing errors
    clearError();
  }, [isAuthenticated, router, clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      router.push('/');
    } catch (error) {
      // Error is handled by the store
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              {...register('username')}
              type="text"
              label="Username"
              placeholder="Choose a username"
              error={errors.username?.message}
              autoComplete="username"
              required
            />

            <Input
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              error={errors.email?.message}
              autoComplete="email"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('first_name')}
                type="text"
                label="First name"
                placeholder="First name"
                error={errors.first_name?.message}
                autoComplete="given-name"
                required
              />

              <Input
                {...register('last_name')}
                type="text"
                label="Last name"
                placeholder="Last name"
                error={errors.last_name?.message}
                autoComplete="family-name"
                required
              />
            </div>

            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Create a password"
              error={errors.password?.message}
              autoComplete="new-password"
              helperText="Password must be at least 8 characters long"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}

