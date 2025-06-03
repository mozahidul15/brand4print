"use client";

import React, { ReactNode } from 'react';
import { useAuth } from './auth-context';
import Link from 'next/link';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Component to conditionally render content based on authentication state
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = <DefaultFallback /> 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Default fallback component that shows when user is not authenticated
const DefaultFallback = () => (
  <div className="p-8 bg-gray-50 rounded-lg text-center">
    <h3 className="text-xl font-semibold mb-3">Authentication Required</h3>
    <p className="text-gray-600 mb-4">
      Please log in to view this content.
    </p>
    <Link 
      href="/my-account" 
      className="inline-block bg-[#7000fe] hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
    >
      Log in
    </Link>
  </div>
);

export default AuthGuard;
