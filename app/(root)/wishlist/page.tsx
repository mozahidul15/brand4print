"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, X } from 'lucide-react';
import { useWishlist } from '@/components/wishlist';
import { useToast } from '@/components/ui/toast';
import { AuthGuard } from '@/components/auth';

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToast } = useToast();

    const handleClearWishlist = () => {
        if (wishlistItems.length > 0) {
            clearWishlist();
            addToast({
                message: 'Wishlist cleared',
                type: 'info',
                duration: 3000
            });
        }
    };

    const wishlistContent = (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                {wishlistItems.length > 0 && (
                    <button 
                        onClick={handleClearWishlist}
                        className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="h-5 w-5 mr-2" />
                        <span>Clear All</span>
                    </button>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-medium text-gray-400 mb-4">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8">Browse our products and add items to your wishlist</p>
                    <Link
                        href="/shop"
                        className="inline-block bg-[#7000fe] text-white py-2 px-6 rounded-full hover:bg-purple-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="border-b last:border-0 relative hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row items-stretch p-4 gap-6">
                                {/* Remove button */}
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 z-10"
                                    aria-label="Remove item"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                {/* Product image */}
                                <div className="sm:w-52 h-32 relative">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Product info */}
                                <div className="flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="font-medium text-lg">{item.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{item.date}</p>
                                        
                                        {/* Display product options if available */}
                                        {item.options && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                {item.options.shape && <p>Shape: {item.options.shape}</p>}
                                                {item.options.width && item.options.height && (
                                                    <p>Size: {item.options.width}mm × {item.options.height}mm</p>
                                                )}
                                                {item.options.size && <p>Size: {item.options.size}</p>}
                                                {item.options.color && <p>Color: {item.options.color}</p>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-0">
                                        <div>
                                            <div className="text-gray-900 font-medium">
                                                {typeof item.price === 'string'
                                                    ? `£${item.price}`
                                                    : `£${item.price.min} – £${item.price.max}`
                                                }
                                            </div>

                                            {item.inStock && (
                                                <div className="flex items-center mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                    <span className="text-sm text-green-600">{item.inStock} in stock</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 sm:mt-0">
                                            <Link 
                                                href={item.link}
                                                className="bg-[#7000fe] hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors inline-block"
                                            >
                                                Select options
                                            </Link>
                                        </div>
                                    </div>
                                </div>                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <AuthGuard>
            {wishlistContent}
        </AuthGuard>
    );
};

export default WishlistPage;

