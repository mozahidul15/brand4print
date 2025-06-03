/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

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
  customized?: boolean;
  extraFees?: Array<{ label: string; amount: number }>;
}

interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  items: OrderItem[];
  billingInfo: {
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
  };
  shippingInfo: {
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
  };
  orderNotes?: string;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');  const [filterArtwork, setFilterArtwork] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignImage, setSelectedDesignImage] = useState<{ src: string; name: string } | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [artworkIssues, setArtworkIssues] = useState('');
  const { addToast } = useToast();
  const fetchOrders = React.useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      addToast({
        message: 'Failed to load orders',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string, artworkStatus?: string) => {
    try {
      const updates: any = { status };
      if (artworkStatus) {
        updates.artworkStatus = artworkStatus;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prev => prev.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        
        addToast({
          message: 'Order updated successfully',
          type: 'success'
        });
        
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      addToast({
        message: 'Failed to update order',
        type: 'error'
      });
    }
  };
  const updateArtworkStatus = async (orderId: string, artworkStatus: string) => {
    await updateOrderStatus(orderId, selectedOrder?.status || 'pending', artworkStatus);
  };

  const sendRevisionEmail = async () => {
    if (!selectedOrder) return;

    setEmailSending(true);
    try {
      const response = await fetch('/api/admin/send-revision-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          customerEmail: selectedOrder.billingInfo.email,
          customerName: `${selectedOrder.billingInfo.firstName} ${selectedOrder.billingInfo.lastName}`,
          orderNumber: selectedOrder.orderNumber,
          artworkIssues: artworkIssues || 'Professional adjustment needed for optimal print quality'
        }),
      });

      if (response.ok) {
        addToast({
          message: 'Revision email sent successfully',
          type: 'success'
        });
        setShowEmailDialog(false);
        setArtworkIssues('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending revision email:', error);
      addToast({
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setEmailSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getArtworkStatusColor = (status: string) => {
    switch (status) {
      case 'awaiting_review': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'revision_required': return 'bg-red-100 text-red-800';
      case 'plates_created': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesArtwork = filterArtwork === 'all' || order.artworkStatus === filterArtwork;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.billingInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.billingInfo.firstName} ${order.billingInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesArtwork && matchesSearch;
  });

//   const getFirstTimePrintingItems = (items: OrderItem[]) => {
//     return items.filter(item => item.options?.isFirstTimePrinting);
//   };

  const hasPlateSetupFees = (items: OrderItem[]) => {
    return items.some(item => 
      item.extraFees?.some(fee => fee.label.toLowerCase().includes('plate'))
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Orders: {orders.length}
          </span>
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
     {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
          <p className="text-2xl font-bold text-orange-600">
            {orders.filter(o => o.artworkStatus === 'awaiting_review').length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">First Time Prints</h3>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => hasPlateSetupFees(o.items)).length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            £{orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
          </p>        </Card>
      </div>
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Order number, email, or name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artwork Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterArtwork}
              onChange={(e) => setFilterArtwork(e.target.value)}
            >
              <option value="all">All Artwork Status</option>
              <option value="awaiting_review">Awaiting Review</option>
              <option value="approved">Approved</option>
              <option value="revision_required">Revision Required</option>
              <option value="plates_created">Plates Created</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={() => {
                setFilterStatus('all');
                setFilterArtwork('all');
                setSearchTerm('');
              }}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Orders ({filteredOrders.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredOrders.map((order) => (
              <Card 
                key={order._id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedOrder?._id === order._id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {order.billingInfo.firstName} {order.billingInfo.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{order.billingInfo.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getArtworkStatusColor(order.artworkStatus)}`}>
                    {order.artworkStatus.replace('_', ' ')}
                  </span>
                  {hasPlateSetupFees(order.items) && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      First Time Print
                    </span>
                  )}
                </div>
              </Card>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No orders found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div>
          {selectedOrder ? (
            <Card className="p-6">
              <div className="space-y-6">
                {/* Order Header */}
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Order Details - {selectedOrder.orderNumber}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="ml-2 font-medium">£{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Management */}
                <div className="space-y-4">
                  <h3 className="font-medium">Status Management</h3>
                  
                  {/* Order Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <div className="flex space-x-2">
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={selectedOrder.status === status ? "default" : "outline"}
                          onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>                  {/* Artwork Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artwork Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['awaiting_review', 'approved', 'revision_required', 'plates_created'].map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={selectedOrder.artworkStatus === status ? "default" : "outline"}
                          onClick={() => updateArtworkStatus(selectedOrder._id, status)}
                        >
                          {status.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Send Email Button - Only visible when status is revision_required */}
                    {selectedOrder.artworkStatus === 'revision_required' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700 mb-2">
                          Artwork revision required. Send customer an email with vectorization service offer.
                        </p>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setShowEmailDialog(true)}
                        >
                          📧 Send Revision Email
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-600">Name:</span> {selectedOrder.billingInfo.firstName} {selectedOrder.billingInfo.lastName}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedOrder.billingInfo.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedOrder.billingInfo.phone}</p>
                    {selectedOrder.billingInfo.company && (
                      <p><span className="text-gray-600">Company:</span> {selectedOrder.billingInfo.company}</p>
                    )}
                    <p><span className="text-gray-600">Address:</span> {selectedOrder.billingInfo.address}, {selectedOrder.billingInfo.city}, {selectedOrder.billingInfo.state} {selectedOrder.billingInfo.postalCode}, {selectedOrder.billingInfo.country}</p>
                  </div>
                </div>                {/* Order Items */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-start space-x-3">
                          {item.image && (
                            <div className="flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedDesignImage({ src: item.image!, name: item.name })}
                                title="Click to view full design"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} • £{item.price.toFixed(2)} each
                            </p>
                            {item.customized && (
                              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Custom Design
                              </span>
                            )}
                            {item.options?.isFirstTimePrinting && (
                              <span className="inline-block mt-1 ml-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                First Time Print
                              </span>
                            )}
                            {item.extraFees && item.extraFees.length > 0 && (
                              <div className="mt-1">
                                {item.extraFees.map((fee, feeIndex) => (
                                  <div key={feeIndex} className="text-xs text-blue-600">
                                    {fee.label}: £{fee.amount}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-sm">
                              £{(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.customized && item.image && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 text-xs"
                                onClick={() => setSelectedDesignImage({ src: item.image!, name: item.name })}
                              >
                                Review Design
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.orderNotes && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Order Notes</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedOrder.orderNotes}
                    </p>
                  </div>
                )}

                {/* Flexographic Print Notes */}
                {hasPlateSetupFees(selectedOrder.items) && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2 text-purple-800">Flexographic Print Requirements</h3>
                    <div className="bg-purple-50 p-3 rounded text-sm space-y-1">
                      <p>• This order includes first-time designs requiring plate creation</p>
                      <p>• Artwork must be reviewed and approved before plate creation</p>
                      <p>• Only 1-2 solid spot colors supported (no gradients)</p>
                      <p>• Plate setup fee: £100 per first-time design</p>
                      <p>• Production begins after artwork approval and plate creation</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <p>Select an order from the list to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
      {/* Design Image Review Modal */}
      {selectedDesignImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Design Review - {selectedDesignImage.name}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDesignImage(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <div className="text-center">
                <img
                  src={selectedDesignImage.src}
                  alt={selectedDesignImage.name}
                  className="max-w-full max-h-[70vh] mx-auto border rounded shadow-lg"
                />
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <h4 className="font-medium text-yellow-800 mb-2">Flexographic Print Requirements:</h4>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Design should use only 1-2 solid spot colors</li>
                  <li>• No gradients or complex color blends allowed</li>
                  <li>• Text should be at least 8pt size for readability</li>
                  <li>• Fine details may not reproduce well in flexographic printing</li>
                  <li>• Vector format preferred for optimal print quality</li>
                </ul>
              </div>
              {selectedOrder && (
                <div className="mt-4 flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => {
                      updateArtworkStatus(selectedOrder._id, 'revision_required');
                      setSelectedDesignImage(null);
                    }}
                  >
                    Request Revision
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      updateArtworkStatus(selectedOrder._id, 'approved');
                      setSelectedDesignImage(null);
                    }}
                  >
                    Approve Design
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Dialog Modal */}
      {showEmailDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Send Revision Email</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowEmailDialog(false);
                  setArtworkIssues('');
                }}
              >
                ×
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Customer:</strong> {selectedOrder.billingInfo.firstName} {selectedOrder.billingInfo.lastName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Email:</strong> {selectedOrder.billingInfo.email}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Order:</strong> {selectedOrder.orderNumber}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artwork Issues (Optional)
                </label>
                <textarea
                  value={artworkIssues}
                  onChange={(e) => setArtworkIssues(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none"
                  rows={4}
                  placeholder="Describe specific issues with the artwork that need revision (optional). If left blank, a generic message will be sent."
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Email Will Include:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Professional vectorization service offer</li>
                  <li>• Pricing: £30 (1-colour) or £50 (2-colour)</li>
                  <li>• Three response options for the customer</li>
                  <li>• Brand4Print contact information</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEmailDialog(false);
                    setArtworkIssues('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={sendRevisionEmail}
                  disabled={emailSending}
                >
                  {emailSending ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;