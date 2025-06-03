import { useState, useEffect } from 'react';

// Define product interface based on database structure
export interface ProductData {
  _id: string;
  title: string;
  sku?: string;
  description?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  images: string[];
  mainImage?: string;
  thumbnails?: string[];
  productType: string;
  customizable?: boolean;
  inStock?: boolean;
  options?: {
    shapes?: Array<{ id: string; label: string }>;
    sizes?: Array<{ width: number; height: number; label: string }>;
    bagSizes?: Array<{ id: string; label: string }>;
    printColors?: Array<{ id: string; label: string }>;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Format price display utility function
export const formatPrice = (product: ProductData | number): string | { min: string; max: string } => {
  // If product is just a number, format it directly
  if (typeof product === 'number') {
    return product.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // If product has minPrice and maxPrice fields, use those
  if (product.minPrice !== undefined && product.maxPrice !== undefined) {
    return {
      min: product.minPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      max: product.maxPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    };
  }
  
  // Otherwise, fall back to the price field
  return product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Hook to fetch product data
export function useProductData(productId?: string, productSlug?: string) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/products';
        
        if (productId) {
          endpoint += `/id/${productId}`;
        } else if (productSlug) {
          endpoint += `/slug/${productSlug}`;
        } else {
          throw new Error('Either productId or productSlug must be provided');
        }

        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId || productSlug) {
      fetchProduct();
    }
  }, [productId, productSlug]);

  // Utility functions specific to this product
  const getImageUrl = (index = 0): string => {
    if (!product) return '/placeholder.jpg';
    
    if (product.mainImage && index === 0) return product.mainImage;
    
    if (product.images && product.images.length > index) {
      return product.images[index];
    }
    
    return '/placeholder.jpg';
  };

  const isCustomizable = (): boolean => {
    return product?.customizable === true;
  };

  const getPriceDisplay = (): string => {
    if (!product) return '';
    
    const formattedPrice = formatPrice(product);
    
    if (typeof formattedPrice === 'string') {
      return `£${formattedPrice}`;
    } else {
      return `£${formattedPrice.min} - £${formattedPrice.max}`;
    }
  };

  return {
    product,
    loading,
    error,
    getImageUrl,
    isCustomizable,
    getPriceDisplay
  };
}
