"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    extraFees?: Array<{ label: string; amount: number }>;
  }>;
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  status: string;
  artworkStatus: string;
  createdAt: string;
}

const OrderConfirmationPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`);
        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (params.orderId) {
      fetchOrder();
    }
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Thank you for your order. We&apos;ll send you a confirmation email shortly.</p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Artwork Status:</span>
                  <span className="font-medium capitalize text-blue-600">
                    {order.artworkStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {order.billingInfo.firstName} {order.billingInfo.lastName}
                </p>
                <p>{order.billingInfo.email}</p>
                <p>{order.billingInfo.phone}</p>
                <p>{order.billingInfo.address}</p>
                <p>
                  {order.billingInfo.city}, {order.billingInfo.state} {order.billingInfo.postalCode}
                </p>
                <p>{order.billingInfo.country}</p>
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.extraFees && item.extraFees.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          {item.extraFees.map((fee, feeIndex) => (
                            <div key={feeIndex}>{fee.label}: £{fee.amount}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>£{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium">Artwork Review</h3>
                <p className="text-sm text-gray-600">
                  Our design team will review your artwork for print compatibility and quality.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium">Plate Creation</h3>                <p className="text-sm text-gray-600">
                  Once approved, we&apos;ll create the printing plates for your design.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium">Production & Shipping</h3>
                <p className="text-sm text-gray-600">
                  Your order will be printed and shipped to your address.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="px-8"
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={() => router.push('/my-account')}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
