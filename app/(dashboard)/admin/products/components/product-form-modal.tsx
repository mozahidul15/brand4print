/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SafeImage from '@/components/ui/SafeImage';
import { toast } from 'react-hot-toast';

interface Product {
  _id?: string;
  title: string;
  sku: string;
  short_description: string;
  description: string;
  price: number;
  minPrice: number;
  maxPrice?: number;
  images: string[];
  mainImage: string;
  thumbnails: string[];
  productType: string;
  customizable: boolean;
  inStock: boolean;
  options?: {
    shapes?: Array<{ id: string; label: string }>;
    bagSizes?: Array<{ id: string; label: string }>;
    printColors?: Array<{ id: string; label: string }>;
    quantity?: number[];
  }; mockupImages?: {
    front?: string;
    back?: string;
  };
}

interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    sku: '',
    short_description: '',
    description: '',
    price: 0,
    minPrice: 0,
    maxPrice: undefined,
    images: [],
    mainImage: '',
    thumbnails: [],
    productType: 'sticker',
    customizable: false,
    inStock: true,
    options: {
      shapes: [],
      bagSizes: [],
      printColors: [],
      quantity: []
    },
    mockupImages: {
      front: '',
      back: ''
    }
  }); const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newQuantity, setNewQuantity] = useState('');
  const [newBagSize, setNewBagSize] = useState({ id: '', label: '' });
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({
    main: false,
    thumbnail: false,
    image: false,
    frontMockup: false,
    backMockup: false,
  });
  const mainImageRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  // const imageRef = useRef<HTMLInputElement>(null);
  const frontMockupRef = useRef<HTMLInputElement>(null);
  // const backMockupRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        sku: product.sku,
        short_description: product.short_description || '',
        description: product.description,
        price: product.price,
        minPrice: product.minPrice,
        maxPrice: product.maxPrice,
        // images: product.images || [],
        images: product.thumbnails || [],
        mainImage: product.mainImage,
        thumbnails: product.thumbnails || [],
        productType: product.productType,
        customizable: product.customizable,
        inStock: product.inStock,
        options: product.options || {
          shapes: [{ id: "circle", label: "Circle" },
          { id: "squire", label: "Squire" },
          { id: "rectangle", label: "Rectangle" },
          { id: "star", label: "Star" }],
          bagSizes: [{ id: "standard", label: "Standard (18x9x21cm)" },
          { id: "medium", label: "Medium (22x11x25cm)" },
          { id: "large", label: "Large (29x14x26cm)" },
          { id: "extra-large", label: "Extra Large (35x21x32cm)" }],
          printColors: [{ id: "one-color-one-side", label: "1 Color, 1 Side" },
          { id: "one-color-two-sides", label: "1 Color, 2 Sides" },
          { id: "two-color-one-side", label: "2 Colors, 1 Side" },
          { id: "two-color-two-sides", label: "2 Colors, 2 Sides" }],
          quantity: product.productType === "bag" ? [1000, 2500, 5000, 10000] : [50, 100, 250, 500, 1000, 2500, 5000, 10000]
        },
        mockupImages: product.mockupImages || {
          front: '',
          back: ''
        }
      });
    }
  }, [product]);
  const productTypes = [
    { value: 'sticker', label: 'Stickers' },
    { value: 'bag', label: 'Bags' },

  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.short_description?.trim()) {
      newErrors.short_description = 'Short description is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.minPrice || formData.minPrice <= 0) {
      newErrors.minPrice = 'Min price must be greater than 0';
    }

    if (formData.maxPrice && formData.maxPrice < formData.minPrice!) {
      newErrors.maxPrice = 'Max price must be greater than min price';
    }

    if (!formData.mainImage?.trim()) {
      newErrors.mainImage = 'Main image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Generate SKU if not provided
      if (!formData.sku?.trim()) {
        const sku = formData.title?.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        formData.sku = sku;
      }      // Set price to minPrice if not provided
      if (!formData.price) {
        formData.price = formData.minPrice;
      }

      // Ensure images array includes thumbnails if not already populated
      if (!formData.images || formData.images.length === 0) {
        formData.images = formData.thumbnails || [];
      }

      // Ensure thumbnails includes images if not already populated
      if (!formData.thumbnails || formData.thumbnails.length === 0) {
        formData.thumbnails = formData.images || [];
      }

      // Ensure options exists before setting printColors
      if (!formData.options) {
        formData.options = {};
      }

      formData.options.printColors = [
        { id: "one-color-one-side", label: "1 Color, 1 Side" },
        { id: "one-color-two-sides", label: "1 Color, 2 Sides" },
        { id: "two-color-one-side", label: "2 Colors, 1 Side" },
        {
          id: "two-color-two-sides",
          label: "2 Colors, 2 Sides"
        }
      ]
      formData.options.shapes = [
        { id: "circle", label: "Circle" },
        { id: "squire", label: "Squire" },
        { id: "rectangle", label: "Rectangle" },
        { id: "star", label: "Star" }
      ]
      onSave(formData);
    }
  };
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const removeThumbnail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      thumbnails: prev.thumbnails?.filter((_, i) => i !== index) || []
    }));
  };

  // const removeImage = (index: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     images: prev.images?.filter((_, i) => i !== index) || []
  //   }));
  // };

  const addQuantity = () => {
    const qty = parseInt(newQuantity);
    if (qty && qty > 0) {
      setFormData(prev => ({
        ...prev,
        options: {
          ...prev.options,
          quantity: [...(prev.options?.quantity || []), qty].sort((a, b) => a - b)
        }
      }));
      setNewQuantity('');
    }
  };
  const removeQuantity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        quantity: prev.options?.quantity?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const addBagSize = () => {
    if (newBagSize.id.trim() && newBagSize.label.trim()) {
      // Check if bag size with same ID already exists
      const exists = formData.options?.bagSizes?.some(size => size.id === newBagSize.id);
      if (!exists) {
        setFormData(prev => ({
          ...prev,
          options: {
            ...prev.options,
            bagSizes: [...(prev.options?.bagSizes || []), { id: newBagSize.id.trim(), label: newBagSize.label.trim() }]
          }
        }));
        setNewBagSize({ id: '', label: '' });
      }
    }
  };

  const removeBagSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        bagSizes: prev.options?.bagSizes?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  const uploadImage = async (file: File, type: 'main' | 'thumbnail' | 'image' | 'frontMockup' | 'backMockup') => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      } const data = await response.json();

      if (!data.success || !data.url) {
        console.error('Invalid response from image upload API:', data);
        throw new Error('Failed to get image URL from upload response');
      }

      const imageUrl = data.url;
      console.log('Uploaded image URL:', imageUrl); switch (type) {
        case 'main':
          handleInputChange('mainImage', imageUrl);
          break;
        case 'thumbnail':
          setFormData(prev => ({
            ...prev,
            thumbnails: [...(prev.thumbnails || []), imageUrl]
          }));
          break;
        case 'image':
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), imageUrl]
          }));
          break;
        case 'frontMockup':
          setFormData(prev => ({
            ...prev,
            mockupImages: {
              ...prev.mockupImages,
              front: imageUrl,
              back: imageUrl
            }
          }));
          break;
        // case 'backMockup':
        //   setFormData(prev => ({
        //     ...prev,
        //     mockupImages: {
        //       ...prev.mockupImages,
        //       back: imageUrl
        //     }
        //   }));
        //   break;
      }

      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
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

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter product title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sku ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter SKU"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                )}              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <textarea
                value={formData.short_description || ''}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.short_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter a brief product description for listings"
              />
              {errors.short_description && (
                <p className="text-red-500 text-sm mt-1">{errors.short_description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Product Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>                <select
                  value={formData.productType || 'sticker'}
                  onChange={(e) => handleInputChange('productType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {productTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={formData.customizable || false}
                  onChange={(e) => handleInputChange('customizable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="customizable" className="ml-2 block text-sm text-gray-700">
                  Customizable Product
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock !== false}
                  onChange={(e) => handleInputChange('inStock', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                  In Stock
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (£) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.minPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                />
                {errors.minPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.minPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.maxPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                />
                {errors.maxPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Price (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || formData.minPrice || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Image *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={mainImageRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadImage(e.target.files[0], 'main');
                    }
                  }}
                  className="hidden"
                />
                <div className="flex-1 flex">
                  <input
                    type="text"
                    value={formData.mainImage || ''}
                    onChange={(e) => handleInputChange('mainImage', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mainImage ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Image URL will appear here after upload"
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={() => mainImageRef.current?.click()}
                    disabled={uploading.main}
                    className="rounded-l-none"
                  >
                    {uploading.main ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {errors.mainImage && (
                <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>
              )}              {formData.mainImage && (
                <div className="mt-2">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                    <SafeImage
                      src={formData.mainImage}
                      alt="Main product image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Thumbnail Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Images
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  ref={thumbnailRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadImage(e.target.files[0], 'thumbnail');
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => thumbnailRef.current?.click()}
                  disabled={uploading.thumbnail}
                  className="flex items-center gap-2"
                >
                  {uploading.thumbnail ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Additional Image
                </Button>
              </div>

              {formData.thumbnails && formData.thumbnails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.thumbnails.map((thumbnail, index) => (
                    <div key={index} className="relative">                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <SafeImage
                        src={thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                      <button
                        type="button"
                        onClick={() => removeThumbnail(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Product Images */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  ref={imageRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadImage(e.target.files[0], 'image');
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  disabled={uploading.image}
                  className="flex items-center gap-2"
                >
                  {uploading.image ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Product Image
                </Button>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                        <SafeImage
                          src={image}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* Product Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Options</h3>

              {/* Quantity Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Quantities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                    min="1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addQuantity();
                      }
                    }}
                  />
                  <Button type="button" onClick={addQuantity} disabled={!newQuantity.trim()}>
                    Add Quantity
                  </Button>
                </div>

                {formData.options?.quantity && formData.options.quantity.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.options.quantity.map((qty, index) => (
                      <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span>{qty.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => removeQuantity(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>)}
              </div>

              {/* Bag Sizes Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Bag Sizes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newBagSize.id}
                    onChange={(e) => setNewBagSize(prev => ({ ...prev, id: e.target.value }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBagSize();
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={newBagSize.label}
                    onChange={(e) => setNewBagSize(prev => ({ ...prev, label: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Small (18x9x21cm)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBagSize();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addBagSize}
                    disabled={!newBagSize.id.trim() || !newBagSize.label.trim()}
                  >
                    Add Size
                  </Button>
                </div>

                {formData.options?.bagSizes && formData.options.bagSizes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.options.bagSizes.map((size, index) => (
                      <div key={index} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <span>{size.label}</span>
                        <button
                          type="button"
                          onClick={() => removeBagSize(index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mockup Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mockup Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={frontMockupRef}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          uploadImage(e.target.files[0], 'frontMockup');
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex-1 flex">
                      <input
                        type="text"
                        value={formData.mockupImages?.front || ''}
                        className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                        placeholder="Image URL will appear here after upload"
                        readOnly
                      />
                      <Button
                        type="button"
                        onClick={() => frontMockupRef.current?.click()}
                        disabled={uploading.frontMockup}
                        className="rounded-l-none"
                      >
                        {uploading.frontMockup ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>                  {formData.mockupImages?.front && (
                    <div className="mt-2">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                        <SafeImage
                          src={formData.mockupImages.front}
                          alt="Front mockup"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Back Mockup Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={backMockupRef}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          uploadImage(e.target.files[0], 'backMockup');
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex-1 flex">
                      <input
                        type="text"
                        value={formData.mockupImages?.back || ''}
                        className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                        placeholder="Image URL will appear here after upload"
                        readOnly
                      />
                      <Button
                        type="button"
                        onClick={() => backMockupRef.current?.click()}
                        disabled={uploading.backMockup}
                        className="rounded-l-none"
                      >
                        {uploading.backMockup ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>                  {formData.mockupImages?.back && (
                    <div className="mt-2">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                        <SafeImage
                          src={formData.mockupImages.back}
                          alt="Back mockup"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {product ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFormModal;
