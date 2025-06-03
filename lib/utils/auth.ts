/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { IUser } from '../models/user';

// Secret keys for JWT
// Make sure to use the same JWT_SECRET for both creating and verifying tokens
const JWT_SECRET = process.env.JWT_SECRET || 'brand4print-jwt-secret';
// Add console log to debug JWT_SECRET value during initialization
console.log('JWT_SECRET initialization:', JWT_SECRET.substring(0, 5) + '...');

// Token expiration time (1 day)
const TOKEN_EXPIRATION = '1d';

/**
 * Create a JWT token for the authenticated user
 */
export const createToken = (user: IUser): string => {
  // Log the JWT_SECRET being used for token creation (first 5 chars only for security)
  console.log('JWT_SECRET for token creation:', JWT_SECRET.substring(0, 5) + '...');
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): any => {
  try {
    // Log the JWT_SECRET being used for verification (first 5 chars only for security)
    console.log('JWT_SECRET for verification:', JWT_SECRET.substring(0, 5) + '...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified:', decoded);
    return decoded;
  } catch (error) {
    console.log('Token verification error:', error);
    return null;
  }
};

/**
 * Set authentication token in cookies
 */
export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'brand4print-auth-token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day in seconds
    sameSite: 'strict',
  });
};
/**
 * Remove authentication token from cookies (logout)
 */
export const removeAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('brand4print-auth-token');
};

/**
 * Get the current authenticated user from the request
 */
export const getCurrentUser = (req: NextRequest): any | null => {
  const token = req.cookies.get('brand4print-auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
};

/**
 * Get the current authenticated user from cookies (for server components)
 */
export const getCurrentUserFromCookies = async (): Promise<any | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('brand4print-auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
};
