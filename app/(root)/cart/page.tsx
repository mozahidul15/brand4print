"use client";

import React from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/cart';
import { useToast } from '@/components/ui/toast';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { addToast } = useToast();

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    addToast({
      message: `${name} removed from cart`,
      type: 'info',
      duration: 3000
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#7000fe] text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="hidden md:grid md:grid-cols-12 text-sm text-gray-500 border-b pb-4">
                <div className="md:col-span-6">Product</div>
                <div className="md:col-span-2 text-center">Price</div>
                <div className="md:col-span-2 text-center">Quantity</div>
                <div className="md:col-span-2 text-center">Subtotal</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 py-6 border-b last:border-0 gap-4 md:gap-0">
                  {/* Product */}
                  <div className="md:col-span-6 flex gap-4">
                    <div className="w-24 h-24 relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          fill
                          alt={item.name}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <div className="text-sm text-gray-500 mb-4">
                        {Object.entries(item.options || {}).map(([key, value]) => (
                          <div key={key}>
                            <span className="capitalize">{key}:</span> {value}
                          </div>
                        ))}
                        {item.customized && (
                          <div className="text-green-600 font-medium mt-1">
                            Customized
                          </div>
                        )}
                        {/* Show extra fees for this item */}
                        {item.extraFees && item.extraFees.length > 0 && (
                          <div className="mt-2 text-xs text-red-600">
                            {item.extraFees.map((fee, idx) => (
                              <div key={idx}>
                                +£{fee.amount.toFixed(2)} <span className="font-medium">{fee.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 flex md:justify-center items-center">
                    <div className="md:hidden font-medium mr-2">Price:</div>
                    <div>£{item.price.toFixed(2)}</div>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex md:justify-center items-center">
                    <div className="md:hidden font-medium mr-2">Quantity:</div>
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="border rounded-md p-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 10, 15, 20].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>                  {/* Subtotal */}
                  <div className="md:col-span-2 flex md:justify-center items-center font-medium">
                    <div className="md:hidden mr-2">Subtotal:</div>
                    <div>
                      <div>£{(item.price * item.quantity).toFixed(2)}</div>
                      {item.extraFees && item.extraFees.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {item.extraFees.map((fee, idx) => (
                            <div key={idx}>+£{fee.amount.toFixed(2)} {fee.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => {
                  clearCart();
                  addToast({
                    message: 'Cart cleared',
                    type: 'info',
                    duration: 3000
                  });
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear Cart
              </button>
              <Link href="/shop" className="text-[#7000fe] hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="border-t border-b py-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (Products)</span>
                <span>£{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              
              {/* Group and display fees by type */}
              {(() => {
                const feesByType = cartItems.flatMap(item => item.extraFees || []).reduce((acc, fee) => {
                  if (!acc[fee.label]) acc[fee.label] = 0;
                  acc[fee.label] += fee.amount;
                  return acc;
                }, {} as Record<string, number>);
                
                return Object.entries(feesByType).map(([label, amount]) => (
                  <div className="flex justify-between text-orange-600 text-sm" key={label}>
                    <span>{label}</span>
                    <span>+£{amount.toFixed(2)}</span>
                  </div>
                ));
              })()}
              
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between py-4 font-semibold text-lg">
              <span>Total</span>
              <span>£{getTotalPrice().toFixed(2)}</span>
            </div>
            
            <button 
              className="w-full bg-[#7000fe] text-white py-3 rounded-full hover:bg-purple-700 transition-colors"
              onClick={() => {
                // This would typically handle checkout process
                addToast({
                  message: 'Proceeding to checkout...',
                  type: 'info',
                  duration: 3000
                });
              }}
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-sm text-gray-500 text-center">
              Taxes and shipping calculated at checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
