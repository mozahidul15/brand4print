import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json(); // parse request body if needed
  return NextResponse.json({ message: 'Validated successfully', data: body });
}
