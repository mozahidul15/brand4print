"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart as CartIcon, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from './cart/cart-context';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();
  // const closeCart = () => {
  //   // This function would be used to close the cart sheet
  //   // We would need to control the Sheet component's open state
  // };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Shopping Cart" className="relative p-2 cursor-pointer">
          <CartIcon className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Shopping cart</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto ">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <p className="text-gray-500">No products in the cart.</p>
            </div>
          ) : (
            <div className="space-y-4 px-4">
              {cartItems.map((item) => (<div key={item.id} className="flex gap-4 border-b pb-4">
                {item.image && (
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      width={64}
                      height={64}
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-purple-600">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Product options */}
                  <div className="mt-1 text-sm text-gray-600">
                    {item.options && item.productType === 'bag' && (
                      <>
                        <p>Bag Size: {item.options.size}</p>
                        <p>Print Color & Side: {item.options.color}</p>
                      </>
                    )}
                    {item.options && item.productType === 'sticker' && (
                      <>
                        <p>Shape: {item.options.shape}</p>
                        <p>Size: {item.options.width}mm × {item.options.height}mm</p>
                      </>
                    )}
                    <p>Quantity: {item.quantity}</p>
                    {item.customized && <p className="text-green-500">Customized</p>}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold">{item.quantity} ×</p>
                    <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-4">

          {cartItems.length > 0 && (
            <div className="border-t pt-4 mt-auto">
              {/* Subtotal for items only */}
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span className="font-medium">
                  £{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>

              {/* Extra fees display */}
              {cartItems.some(item => item.extraFees && item.extraFees.length > 0) && (
                <div className="border-t border-gray-100 pt-2">
                  {cartItems.map(item => (
                    item.extraFees && item.extraFees.length > 0 ? (
                      <div key={`fees-${item.id}`} className="text-sm">
                        {item.extraFees.map((fee) => (
                          <div key={fee.label} className="flex justify-between py-1 text-gray-600">
                            <span>{fee.label}</span>
                            <span>£{fee.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : null
                  ))}
                </div>
              )}

              {/* Total including fees */}
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold mt-2">
                <span>Total</span>
                <span>£{getTotalPrice().toFixed(2)}</span>
              </div>
              <Link href="/checkout">

                <button
                  className="w-full bg-purple-600 text-white py-2 rounded-md mt-4 hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    // Handle checkout process
                    console.log('Proceeding to checkout');
                  }}
                >
                  Checkout
                </button>
              </Link>
              <Link
                href="/cart"
                className="w-full block text-center text-purple-600 underline mt-2 text-sm py-1"
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;