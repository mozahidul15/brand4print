"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Product {
  _id: string;
  title: string;
  sku: string;
  description: string;
  mainImage: string;
  productType: string;
}

interface DeleteConfirmModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      onConfirm();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={handleKeyPress}
      tabIndex={-1}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Delete Product
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Product Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200">
                <Image
                  src={product.mainImage || '/placeholder-image.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500">
                  SKU: {product.sku}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {product.productType.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Are you sure you want to delete this product?
            </p>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </p>
            <p className="text-xs text-gray-500">
              The product will be permanently removed from your catalog and any related data will be lost.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteConfirmModal;
