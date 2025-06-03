/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// User interface
interface User {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  iat?: number;  // JWT issued at timestamp
  exp?: number;  // JWT expiration timestamp
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await fetch('/api/auth/me');

        if (response.ok) {
          const data = await response.json();
          console.log('User data from API:', data.user); // Debug log
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);

      // Redirect admins to admin dashboard, regular users to home page
      if (data.user.isAdmin) {
        console.log('Redirecting admin user to admin dashboard');
        // Add a small delay to ensure cookie is set before redirect
        setTimeout(() => {
          router.push('/admin/orders');
        }, 100);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json(); if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);

      // Redirect admins to admin dashboard, regular users to home page
      if (data.user.isAdmin) {
        console.log('Redirecting admin user to admin dashboard after registration');
        // Add a small delay to ensure cookie is set before redirect
        setTimeout(() => {
          router.push('/admin/orders');
        }, 100);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/logout');

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      router.push('/'); // Redirect to home page after logout
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
