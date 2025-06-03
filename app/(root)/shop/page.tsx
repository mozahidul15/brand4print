"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from './(components)/productCard';
import { formatPrice } from '@/components/product/use-product-data';

// Define product interface
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

// Define pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}




const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchParams = useSearchParams();
  const router = useRouter();
  const productType = searchParams.get('productType') || 'all';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Function to update search parameters
  const updateSearchParams = (params: { [key: string]: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });

    router.push(`/shop?${newSearchParams.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    let newSortBy = 'createdAt';
    let newSortOrder = 'desc';

    switch (value) {
      case 'latest':
        newSortBy = 'createdAt';
        newSortOrder = 'desc';
        break;
      case 'popularity':
        newSortBy = 'popularity';
        newSortOrder = 'desc';
        break;
      case 'price-low':
        newSortBy = 'price';
        newSortOrder = 'asc';
        break;
      case 'price-high':
        newSortBy = 'price';
        newSortOrder = 'desc';
        break;
    }

    updateSearchParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' });
  };
  // Fetch products from API
  useEffect(() => {
    // Track if the component is mounted
    let isMounted = true;
    // Add AbortController for fetch cancellation
    const controller = new AbortController();

    const fetchProducts = async () => {
      // Don't set loading to true immediately, add a small delay to prevent flickering
      const loadingTimeout = setTimeout(() => {
        if (isMounted) setLoading(true);
      }, 200);

      try {
        // Add signal to fetch request for cancellation
        const response = await fetch(
          `/api/products?productType=${productType}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        // Only update state if component is still mounted
        if (isMounted) {
          setProducts(data.products);
          setPagination(data.pagination);
          setError(null);
        }
      } catch (err) {
        // Only handle error if it's not an abort error and component is mounted
        if (err instanceof Error && err.name !== 'AbortError' && isMounted) {
          setError('Error loading products. Please try again later.');
          console.error('Error fetching products:', err);
        }
      } finally {
        // Clear the loading timeout
        clearTimeout(loadingTimeout);
        // Only update loading state if component is still mounted
        if (isMounted) setLoading(false);
      }
    };

    // Use requestAnimationFrame to schedule fetch during idle browser time
    const animationFrameId = requestAnimationFrame(() => {
      fetchProducts();
    });

    // Cleanup function to prevent memory leaks and state updates on unmounted components
    return () => {
      isMounted = false;
      controller.abort(); // Cancel any in-flight fetch requests
      cancelAnimationFrame(animationFrameId);
    };
  }, [productType,sortBy, sortOrder, page, limit ]);  // Format price for display in the product list
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
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop Our Products</h1>
        <p className="text-gray-600">Discover high-quality print products designed for your business needs</p>
      </div>

      {/* Results count and sorting options */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600 mb-3 sm:mb-0">
          {loading ? 'Finding the perfect products for you...' : `Showing ${pagination?.total ? pagination.total : 0} products`}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Sort by</span>
          <select
            className="text-sm border border-gray-300 rounded-full px-3 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            value={
              sortBy === 'price' && sortOrder === 'asc'
                ? 'price-low'
                : sortBy === 'price' && sortOrder === 'desc'
                  ? 'price-high'
                  : sortBy === 'popularity'
                    ? 'popularity'
                    : 'latest'
            }
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="latest">latest</option>
            <option value="popularity">popularity</option>
            <option value="price-low">price: low to high</option>
            <option value="price-high">price: high to low</option>          </select>

          {/* View mode buttons (grid/list) */}
          <div className="flex bg-gray-50 rounded-full p-1 shadow-inner">
            <button
              className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}      {/* Loading state */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-500 animate-pulse">Loading amazing products...</p>
        </div>
      )}{/* Product Grid or List */}
      {!loading && products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-2xl font-medium">No products found</h3>
          <p className="text-gray-500 mt-2">Try changing your search criteria or browse our categories</p>
          <button
            onClick={() => updateSearchParams({ sortBy: 'createdAt', sortOrder: 'desc' })}
            className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-6"
        }>
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
              className="h-full"
            >
              <ProductCard
                id={product._id}
                imageSrc={product.mainImage || product.images[0] || "/placeholder.jpg"}
                title={product.title}
                price={formatProductPrice(product)}
                link={`/shop/${product.title}`}
                viewMode={viewMode}
                productType={product.productType}
                customizable={product.customizable}
              />
            </motion.div>
          ))}
        </div>
      )}      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-12 mb-4">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => updateSearchParams({ page: (page - 1).toString() })}
              disabled={page <= 1}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${page <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                }`}
            >
              &larr; Previous
            </button>

            <div className="hidden sm:flex gap-1.5 mx-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => updateSearchParams({ page: pageNum.toString() })}
                  className={`w-9 h-9 flex items-center justify-center rounded-full font-medium transition-all duration-300 ${pageNum === page
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <span className="sm:hidden text-sm text-gray-500 mx-2">
              Page {page} of {pagination.pages}
            </span>

            <button
              onClick={() => updateSearchParams({ page: (page + 1).toString() })}
              disabled={page >= pagination.pages}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${page >= pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                }`}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
