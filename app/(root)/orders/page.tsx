"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productType: string;
  options?: {
    size?: string;
    color?: string;
    shape?: string;
    width?: number;
    height?: number;
    designHash?: string;
    isFirstTimePrinting?: boolean;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  artworkStatus: 'awaiting_review' | 'approved' | 'revision_required' | 'plates_created';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useAuth();
    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        if (!user?.userId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/orders?userId=${user.userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const fetchedOrders = await response.json();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [user?.userId]);

    useEffect(() => {
        if (!user) {
            router.push('/my-account');
            return;
        }
        fetchOrders();
    }, [user, router, fetchOrders]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'pending':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getArtworkStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600';
            case 'revision_required':
                return 'text-orange-600';
            case 'plates_created':
                return 'text-blue-600';
            case 'awaiting_review':
            default:
                return 'text-gray-600';
        }
    };

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link 
                        href="/my-account" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to My Account
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="text-gray-600 mt-2">View and track all your orders</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <svg className="animate-spin mx-auto h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-gray-600">Loading your orders...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <div className="text-red-500 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={fetchOrders}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet. Start shopping to see your order history here.</p>
                            <Link 
                                href="/shop" 
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                <span>Start Shopping</span>
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                            <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                                            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadgeColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <p className="text-lg font-bold text-gray-900 mt-1">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {order.artworkStatus && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                            <p className="text-sm">
                                                <span className="text-gray-600">Artwork Status: </span>
                                                <span className={`font-medium ${getArtworkStatusColor(order.artworkStatus)}`}>
                                                    {order.artworkStatus.replace('_', ' ').charAt(0).toUpperCase() + order.artworkStatus.replace('_', ' ').slice(1)}
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Order Items ({order.items.length})</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center space-x-4">
                                                    {item.image ? (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                                                        <p className="text-sm text-gray-600">{item.productType}</p>
                                                        {item.options && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {item.options.size && <span>Size: {item.options.size} </span>}
                                                                {item.options.color && <span>Color: {item.options.color} </span>}
                                                                {item.options.width && item.options.height && 
                                                                    <span>Dimensions: {item.options.width}&quot; × {item.options.height}&quot; </span>
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
