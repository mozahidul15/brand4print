import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  return NextResponse.json({ message: 'Validated successfully' });
}
