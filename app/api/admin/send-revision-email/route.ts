import { NextRequest, NextResponse } from 'next/server';
import { sendRevisionRequiredEmail } from '@/lib/services/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerEmail, customerName, orderNumber, artworkIssues } = body;

    // Validate required fields
    if (!orderId || !customerEmail || !customerName || !orderNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the revision email
    const result = await sendRevisionRequiredEmail({
      customerEmail,
      customerName,
      orderNumber,
      artworkIssues: artworkIssues || 'Professional adjustment needed for optimal print quality'
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Revision email sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-revision-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
