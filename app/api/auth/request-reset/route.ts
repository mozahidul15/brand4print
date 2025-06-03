/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import User from '@/lib/models/user';
import crypto from 'crypto';

// Generates a random token for password reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse request body
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Please provide an email address' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    // If no user found, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link shortly',
      });
    }

    // Generate reset token and expiry
    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Update user with reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real application, send an email with the reset link
    // For this example, we'll just return the token (in production, you would NEVER do this)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link shortly',
      // Only include the token in development for testing (DO NOT DO THIS IN PRODUCTION)
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
