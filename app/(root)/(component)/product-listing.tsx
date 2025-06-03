"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/components/product/use-product-data';

// Define product interface from the database model
interface Product {
  _id: string;
  title: string;
  sku?: string;
  description?: string;
  images: string[];
  mainImage?: string;
  thumbnails?: string[];
  price: number | { min: number; max: number };
  minPrice?: number;
  maxPrice?: number;
  slug: string;
  productType: string;
  customizable?: boolean;
  inStock?: boolean;
  options?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string | { min: string; max: string };
  rating: number;
  link: string;
  maxRating?: number;
  customizable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  title,
  price,
  rating,
  link,
  maxRating = 5,
  customizable = false
}) => {
  return (
    <motion.div
      className="product-card flex p-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link href={link} className="group w-full">
        <div className="flex justify-between">
          <div className="relative h-32 flex-1">
            {/* Customizable badge */}
            {customizable && (
              <div className="absolute top-1 left-1 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">
                Customizable
              </div>
            )}
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-contain transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          <div className="flex-1">


            <div className="flex items-center mb-2">
              {[...Array(maxRating)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < rating ? "#FFB800" : "none"}
                  stroke={i < rating ? "#FFB800" : "#D1D5DB"}
                  className="h-4 w-4 mr-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={i < rating ? 0 : 1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>

            <h3 className="text-sm font-medium mb-1 text-gray-800 line-clamp-2 h-10 text-wrap">
              {title}
            </h3>

            <div className="font-bold text-md">
              {typeof price === 'string' ? (
                `£${price}`
              ) : (
                <>£{price.min} – £{price.max}</>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format product price for display
  const formatProductPrice = (product: Product): string | { min: string; max: string } => {
    // If product has minPrice and maxPrice fields, use those
    if (product.minPrice !== undefined && product.maxPrice !== undefined) {
      return {
        min: formatPrice(product.minPrice) as string,
        max: formatPrice(product.maxPrice) as string
      };
    }
    // Otherwise, fall back to the price field
    else if (typeof product.price === 'number') {
      return formatPrice(product.price) as string;
    } else {
      return {
        min: formatPrice((product.price as { min: number; max: number }).min) as string,
        max: formatPrice((product.price as { min: number; max: number }).max) as string
      };
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Using the products API endpoint with a limit of 4
        const response = await fetch('/api/products?limit=4&featured=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-gray-600">Our most popular products for your business needs</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product._id}
                imageSrc={product.mainImage || product.images[0] || "/placeholder.jpg"}
                title={product.title}
                price={formatProductPrice(product)}
                rating={0} // We could add ratings in future
                link={`/shop/${product.title}`}
                customizable={product.customizable}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListing;
