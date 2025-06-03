import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Import edge-compatible JWT verification instead of Node.js version
import { verifyJwtEdge } from './lib/utils/auth-edge';

// Paths that require authentication - now handled by AuthGuard component
const protectedPaths: string[] = [
  '/my-account',
  '/wishlist',
  '/orders',
];

// Paths that require admin authentication
const adminPaths = [
  '/admin',
];

// Paths that are only accessible if NOT authenticated (e.g., login, register)
const authPaths = [
  '/login',
  '/register',
  '/admin-login', // Add admin login path
];

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('brand4print-auth-token')?.value;
  
  // Check if the user is authenticated using edge-compatible function
  const user = token ? verifyJwtEdge(token) : null;
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin === true;
  
  // Debug log - output to server console
  console.log('Middleware Check:', {
    path: request.nextUrl.pathname,
    isAuthenticated,
    isAdmin,
    user: user ? { userId: user.userId, isAdmin: user.isAdmin } : null
  });
  
  // Get the path from the request
  const path = request.nextUrl.pathname;
  
  // If the path is protected and the user is not authenticated, redirect to login
  if (protectedPaths.some(prefix => path.startsWith(prefix)) && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  // If the path is admin-only and the user is not an admin, redirect to home
  if (adminPaths.some(prefix => path.startsWith(prefix)) && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
    // If the path is auth-only (login/register) and the user is authenticated, redirect to appropriate dashboard
  if (authPaths.some(prefix => path.startsWith(prefix)) && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/my-account', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/my-account/:path*', // Now handled by AuthGuard
    '/wishlist/:path*',   // Now handled by AuthGuard
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
