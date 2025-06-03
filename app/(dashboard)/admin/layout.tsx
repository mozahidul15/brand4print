"use client";

import React, { useState } from 'react';
import AdminSidebar from './components/admin-sidebar';
import { useAuth } from '@/components/auth';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if not authenticated or not admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check if user data is already in context
        if (user && user.isAdmin) {
          console.log('User is admin according to auth context');
          return; // Already verified as admin
        }
        
        // If not in context or not admin, verify with server
        if (!isLoading) {
          console.log('Verifying admin status with server');
          const response = await fetch('/api/auth/me');
          const data = await response.json();
          
          if (response.ok && data.user && data.user.isAdmin) {
            console.log('User is admin according to server check');
            return; // Verified as admin via API
          }
          
          // Not admin, redirect
          console.log('Not admin or not authenticated, redirecting to login');
          router.push('/admin-login');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        router.push('/admin-login');
      }
    };
    
    checkAdminStatus();
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  // Show admin dashboard if authenticated and admin
  if (user && user.isAdmin) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Mobile sidebar with overlay */}
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <header className="bg-white shadow-sm z-10 lg:hidden">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
              
              {/* Spacer for mobile to center the title */}
              <div className="lg:hidden w-10"></div>
            </div>
          </header>
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here due to redirect
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-xl">Verifying admin access...</div>
    </div>
  );
};

export default AdminLayout;
