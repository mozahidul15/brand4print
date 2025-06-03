import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json(); // Use the request
  // Example: process the body if needed
  return NextResponse.json({ message: 'Validated successfully', data: body });
}