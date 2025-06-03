/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/utils/auth';

export async function GET() {
  try {
    // Remove auth cookie
    await removeAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
