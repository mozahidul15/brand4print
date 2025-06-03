import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // ✅ Parse the JSON body

    // You can now use body.whatever if needed
    return NextResponse.json({
      message: 'Validated successfully',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid JSON body', error: String(error) },
      { status: 400 }
    );
  }
}
