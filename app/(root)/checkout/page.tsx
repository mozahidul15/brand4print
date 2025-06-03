"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-context';
import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingInfo extends BillingInfo {
  sameAsBilling: boolean;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'UK'
  });
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    ...billingInfo,
    sameAsBilling: true
  });

  const [orderNotes, setOrderNotes] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setBillingInfo(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleBillingChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
    
    // Update shipping if same as billing
    if (shippingInfo.sameAsBilling) {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleShippingChange = (field: keyof ShippingInfo, value: string | boolean) => {
    if (field === 'sameAsBilling') {
      setShippingInfo(prev => ({
        ...prev,
        sameAsBilling: value as boolean,
        ...(value ? billingInfo : {})
      }));
    } else {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
      for (const field of requiredFields) {
      if (!billingInfo[field as keyof BillingInfo]) {
        addToast({
          message: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          type: "error"
        });
        return false;
      }
    }

    if (!shippingInfo.sameAsBilling) {
      for (const field of requiredFields) {
        if (!shippingInfo[field as keyof ShippingInfo]) {
          addToast({
            message: `Please fill in shipping ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
            type: "error"
          });
          return false;
        }
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: cartItems,
        billingInfo,
        shippingInfo: shippingInfo.sameAsBilling ? billingInfo : shippingInfo,
        orderNotes,
        totalAmount: getTotalPrice(),
        user: user?._id|| user?.userId||null
      };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });      if (response.ok) {
        const order = await response.json();
        
        addToast({
          message: `Order #${order.orderNumber} has been placed. You'll receive a confirmation email shortly.`,
          type: "success"
        });
        
        clearCart();
        router.push(`/order-confirmation/${order._id}`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      addToast({
        message: error instanceof Error ? error.message : "There was an error placing your order. Please try again.",
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const extraFeesTotal = cartItems.reduce((total, item) => {
    return total + (item.extraFees || []).reduce((sum, fee) => sum + fee.amount, 0);
  }, 0);
  const shippingCost: number = 0; // Free shipping for now
  const total = subtotal + extraFeesTotal + shippingCost;

  if (cartItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order details below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Billing Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.firstName}
                    onChange={(e) => handleBillingChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.lastName}
                    onChange={(e) => handleBillingChange('lastName', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.company}
                    onChange={(e) => handleBillingChange('company', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.address}
                    onChange={(e) => handleBillingChange('address', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/County *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.postalCode}
                    onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={billingInfo.country}
                    onChange={(e) => handleBillingChange('country', e.target.value)}
                  >
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shippingInfo.sameAsBilling}
                    onChange={(e) => handleShippingChange('sameAsBilling', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Same as billing address</span>
                </label>
              </div>
              
              {!shippingInfo.sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                    />
                  </div>
                  {/* Add all other shipping fields similar to billing */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/County *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                    >
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                    </select>
                  </div>
                </div>
              )}
            </Card>

            {/* Order Notes */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Any special instructions for your order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      {item.options && (
                        <div className="text-xs text-gray-400">
                          {item.options.size && `Size: ${item.options.size}`}
                          {item.options.color && ` • Color: ${item.options.color}`}
                        </div>
                      )}
                      {item.extraFees && item.extraFees.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          {item.extraFees.map((fee, index) => (
                            <div key={index}>{fee.label}: £{fee.amount}</div>
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

              {/* Order Totals */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                {extraFeesTotal > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Additional Fees:</span>
                    <span>£{extraFeesTotal.toFixed(2)}</span>
                  </div>
                )}                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? 'Processing Order...' : 'Place Order'}
              </Button>

              {/* Important Notes */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-medium text-yellow-800 mb-2">Important Notice</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All artwork will be manually reviewed before plate creation</li>
                  <li>• First-time designs include £100 plate setup fee</li>
                  <li>• Only 1-2 solid spot colors supported (no gradients)</li>
                  <li>• Production begins after artwork approval</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;