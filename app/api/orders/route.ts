import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/services/mongodb';
import Order from '@/lib/models/Order';


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const orderData = await request.json();
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Create order
    const order = new Order({
      orderNumber,
      user: orderData.user,
      items: orderData.items,
      billingInfo: orderData.billingInfo,
      shippingInfo: orderData.shippingInfo,
      orderNotes: orderData.orderNotes,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      artworkStatus: 'awaiting_review',
      createdAt: new Date()
    });

    await order.save();

    // TODO: Send confirmation email
    // TODO: Notify admin of new order

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = {};
    if (userId) {
      query = { user: userId };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
