"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Box, Heart } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useCart } from '@/components/cart';
import { useToast } from '@/components/ui/toast';
import { useWishlist } from '@/components/wishlist';

import FabricEditor from '@/components/product/fabric-editor';

// Tab interface
interface TabProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

// Tab component
const Tab: React.FC<TabProps> = ({ active, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`py-3 px-4 font-medium border-b-2 ${active ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
        >
            {children}
        </button>
    );
};

// Product type definition
type ProductType = 'bag' | 'sticker';

interface ProductData {
    _id: string;
    productType: ProductType;
    title: string;
    sku?: string;
    short_description?: string;
    customizable?: boolean;
    price?: number;
    minPrice?: number;
    maxPrice?: number;
    description: string;
    images?: string[];
    mainImage: string;
    thumbnails: string[];
    inStock?: boolean;
    options?: {
        shapes?: Array<{ id: string; label: string }>;
        bagSizes?: Array<{ id: string; label: string }>;
        printColors?: Array<{ id: string; label: string }>;
        quantity?: number[];
        height?: number;
        width?: number;
    };
    mockupImages?: {
        front?: string;
        back?: string;
    }
}

const ProductDetailsPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const productTitle = params.title as string;
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { isInWishlist, toggleWishlist } = useWishlist();

    // Check if returning from customization
    const isCustomized = searchParams.get('customized') === 'true';
    const [showCustomizationMessage, setShowCustomizationMessage] = useState(false);

    // Effect to handle customization message
    useEffect(() => {
        if (isCustomized) {
            setShowCustomizationMessage(true);
            // Hide the message after 5 seconds
            const timer = setTimeout(() => {
                setShowCustomizationMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isCustomized]);

    // Determine product type based on URL
    const [productType, setProductType] = useState<ProductType>('sticker');


    // Effect to check if item is in wishlist on page load
    useEffect(() => {
        // Only check once the product type is determined
        if (productType) {
            // Create a product ID format similar to the one used in toggleWishlist
            const productId = `${productType}-${productTitle}`;
            const isCurrentlyInWishlist = isInWishlist(productId);
            setIsWishlist(isCurrentlyInWishlist);
        }
    }, [productType, productTitle, isInWishlist]);

    // State for active tab
    const [activeTab, setActiveTab] = useState<'description' | 'additional-information' | 'reviews'>('description');    // State for selected options
    const [selectedShape, setSelectedShape] = useState<string>('circle');
    const [quantity, setQuantity] = useState<number>(50);
    const [width, setWidth] = useState<number>(20);
    const [height, setHeight] = useState<number>(20);
    const [selectedSize, setSelectedSize] = useState<string>('small');
    const [selectedColor, setSelectedColor] = useState<string>('one-color-one-side');
    const [isWishlist, setIsWishlist] = useState<boolean>(false);    // State for bag customizer
    const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<ProductData[]>([]);
    // State for enhanced customizer
    // const [showEnhancedCustomizer, setShowEnhancedCustomizer] = useState<boolean>(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/products/${encodeURIComponent(productTitle)}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product data');
                }
                const data = await res.json();
                console.log("Fetched product data:", data);
                setCurrentProduct(data);
                setProductType(data.productType as ProductType);
            } catch (error) {
                console.error('Error fetching product data:', error);
                setError('Failed to load product data');
            } finally {
                setLoading(false);
            }
        };

        if (productTitle) {
            fetchProductData();
        }
    }, [productTitle])
    useEffect(() => {
        const fetchProductData = async () => {
            try {

                const res = await fetch(`/api/products`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product data');
                }
                const data = await res.json();
                const title = decodeURIComponent(productTitle);
                const getProductType = data.products.find((product: ProductData) => product.title === title);

                const getRelatedProduct = data.products.filter((product: ProductData) => product.productType === getProductType?.productType && product.title !== title);

                setRelatedProducts(getRelatedProduct);
            } catch (error) {
                console.error('Error fetching product data:', error);
                setError('Failed to load product data');
            }
        };

        if (productTitle) {
            fetchProductData();
        }
    }, [productTitle])

    // Handle quantity change
    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuantity(Number(e.target.value));
    };    // Handle width/height change
    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(Number(e.target.value));
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(Number(e.target.value));
    };// Handle bag size change
    const handleSizeChange = (sizeId: string) => {
        setSelectedSize(sizeId);
    };

    // Handle print color change
    const handleColorChange = (colorId: string) => {
        setSelectedColor(colorId);
    };    // Handle wishlist functionality
    const handleToggleWishlist = () => {
        if (!currentProduct) return;

        // Create a consistent ID format for the wishlist item
        const productId = `${productType}-${productTitle}`;

        // Create a wishlist item from the current product
        const wishlistItem = {
            id: productId,
            title: currentProduct.title,
            price: currentProduct.maxPrice
                ? { min: currentProduct.minPrice?.toString() || "0", max: currentProduct.maxPrice?.toString() || "0" }
                : currentProduct.minPrice?.toString() || "0",
            image: currentProduct.mainImage,
            productType,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            link: `/shop/${productTitle}`,
            options: (productType === 'sticker')
                ? { shape: selectedShape, width, height }
                : { size: selectedSize, color: selectedColor }
        };

        // Toggle the item in wishlist
        toggleWishlist(wishlistItem);
        // Update local state to reflect wishlist status
        setIsWishlist(!isWishlist);
    };// Handle add to cart action
    const handleAddToCart = () => {
        if (!currentProduct) return;

        // Generate a unique ID for the cart item
        const itemId = `${productType}-${Date.now()}`;
        // Get the base price from the product data
        const basePrice = currentProduct.price || 0;
        // Construct the options object based on product type
        const options = (productType === 'sticker')
            ? { shape: selectedShape, width, height }
            : { size: selectedSize, color: selectedColor };
        // Collect extra fees from search params (for demo, real logic may use context or state)
        const urlParams = new URLSearchParams(window.location.search);
        const extraFees = [];
        if (urlParams.get('plateFee') === '100') {
            extraFees.push({ label: 'Plate Fee (first time print)', amount: 100 });
        }
        if (urlParams.get('vectorFee') === '30') {
            extraFees.push({ label: 'Vectorisation Fee', amount: 30 });
        }
        if (urlParams.get('vectorFee') === '50') {
            extraFees.push({ label: 'Vectorisation Fee (complex)', amount: 50 });
        }
        // Create a cart item
        const cartItem = {
            id: itemId,
            name: currentProduct.title,
            price: basePrice,
            quantity,
            image: currentProduct.mainImage,
            productType,
            options,
            customized: isCustomized,
            extraFees: extraFees.length > 0 ? extraFees : undefined
        };
        // Add to cart
        addToCart(cartItem);
        // Show feedback to the user
        let msg = `Added ${currentProduct.title} to cart`;
        if (extraFees.length > 0) {
            msg += ` (+fees applied)`;
        }
        addToast({
            message: msg,
            type: 'success',
            duration: 3000
        });
    };    // State for fabric editor modal
    const [showFabricEditor, setShowFabricEditor] = useState(false);

    // Handle opening the customizer
    const openEditor = (productType: ProductType) => {
        // For customizable products, directly open fabric editor
        if (currentProduct?.customizable && productType === 'bag') {
            setShowFabricEditor(true);
        }
    };

    // Thumbnail navigation
    const [activeImage, setActiveImage] = useState<number>(0);    // Format price display
    const formatPrice = (price?: number) => {
        if (!price) return "0.00";
        return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }; return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    {error}
                </div>
            )}

            {/* Product Content */}
            {!loading && !error && currentProduct && (
                <>
                    {/* Customization success message */}
                    {showCustomizationMessage && (
                        <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md mb-6 flex items-center border border-green-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p className="font-medium">Customization saved!</p>
                                <p className="text-sm">Your customized design has been saved successfully.</p>
                            </div>
                        </div>
                    )}

                    {/* Breadcrumbs */}
                    <div className="mb-8 text-sm text-gray-500 flex items-center gap-2">
                        <Box className='text-green-500 h-5 w-5' />
                        <span className="text-green-500">IN STOCK</span>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Product Images */}
                        <div className="space-y-4">                    {/* Main Image */}
                            <div className="border rounded-md overflow-hidden h-[400px] relative bg-gray-50">
                                <Image
                                    key={activeImage} // Add key to force re-render
                                    src={currentProduct.thumbnails[activeImage] || currentProduct.mainImage}
                                    alt={currentProduct.title}
                                    fill
                                    className="object-contain transition-opacity duration-300"
                                    priority // For faster loading of the main product image
                                />
                            </div>                    {/* Thumbnails */}
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {currentProduct.thumbnails.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 border p-1 rounded-md ${activeImage === idx
                                            ? 'border-black border-2 shadow-md'
                                            : 'border-gray-300 hover:border-gray-400'}`}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                fill
                                                className="object-contain"
                                                sizes="80px"
                                                loading={idx < 2 ? "eager" : "lazy"} // Load first two thumbnails eagerly
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}                <div>
                            <h1 className="text-3xl font-bold mb-2">{currentProduct.title}</h1>
                            <div className="text-2xl font-bold mb-6">
                                {currentProduct.maxPrice
                                    ? `£${formatPrice(currentProduct.minPrice)}–£${formatPrice(currentProduct.maxPrice)}`
                                    : `£${formatPrice(currentProduct.minPrice)}`
                                }
                            </div>                            {/* Product description for Paper Bags */}
                            {productType === 'bag' && (
                                <p className="mb-6 text-gray-600">
                                    Brand4Print specializes in custom printing on paper bags in Enfield, offering personalized
                                    branding solutions for businesses. Elevate your brand with our bespoke printed paper bags today!
                                </p>
                            )}

                            <p className="mb-6 text-gray-600">
                                Please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link> for more information.
                            </p>

                            {/* Product Options */}
                            <div className="space-y-6">
                                {/* Print Your Logo & Design */}
                                <div>
                                    <label className="block text-gray-700 mb-2">Print Your Logo & Design</label>

                                </div>                                {/* Sticker Shape Options */}
                                {(productType === 'sticker') && currentProduct?.options?.shapes && (
                                    <div>
                                        <label className="block text-gray-700 mb-2">Shape</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {currentProduct.options.shapes.map((shape) => (
                                                <button
                                                    key={shape.id}
                                                    onClick={() => setSelectedShape(shape.id)}
                                                    className={`border-gray-300 hover:border-gray-400 rounded-md p-2 flex items-center justify-center ${selectedShape === shape.id ? 'border-2 border-black shadow-md' : 'border'}`}
                                                >
                                                    {shape.id === 'circle' && (
                                                        <div className="w-8 h-8 bg-black rounded-full"></div>
                                                    )}
                                                    {shape.id === 'squire' && (
                                                        <div className="w-8 h-8 bg-black"></div>
                                                    )}
                                                    {shape.id === 'rectangle' && (
                                                        <div className="w-10 h-6 bg-black"></div>
                                                    )}
                                                    {shape.id === 'star' && (
                                                        <div className="w-8 h-8 flex items-center justify-center">
                                                            <div className="w-8 h-8">
                                                                {/* Star shape */}
                                                                <svg viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}                                {/* Bag Size Options */}
                                {(productType === 'bag') && currentProduct?.options?.bagSizes && (
                                    <div>
                                        <label className="block text-gray-700 mb-2">Bag Size:</label>
                                        <select
                                            value={selectedSize}
                                            onChange={(e) => handleSizeChange(e.target.value)}
                                            className="w-full h-10 border rounded-md px-3"
                                        >
                                            {currentProduct.options.bagSizes.map((size) => (
                                                <option key={size.id} value={size.id}>
                                                    {size.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Print Color & Side Options for Paper Bags */}
                                {(productType === 'bag') && currentProduct?.options?.printColors && (
                                    <div>
                                        <label className="block text-gray-700 mb-2">Print Color & Side:</label>
                                        <select
                                            value={selectedColor}
                                            onChange={(e) => handleColorChange(e.target.value)}
                                            className="w-full h-10 border rounded-md px-3"
                                        >
                                            {currentProduct.options.printColors.map((color) => (
                                                <option key={color.id} value={color.id}>
                                                    {color.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}{/* Sticker Size */}
                                {(productType === 'sticker') && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">Width mm</label>
                                            <input
                                                type="number"
                                                value={width}
                                                onChange={handleWidthChange}
                                                min="10"
                                                max="500"
                                                className="w-full h-10 border rounded-md px-3"
                                                placeholder="Enter width in mm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">Height mm</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={handleHeightChange}
                                                min="10"
                                                max="500"
                                                className="w-full h-10 border rounded-md px-3"
                                                placeholder="Enter height in mm"
                                            />
                                        </div>
                                    </div>
                                )}                                {/* Quantity */}
                                <div>
                                    <label className="block text-gray-700 mb-2">Quantity</label>
                                    <select
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="w-full h-10 border rounded-md px-3"
                                    >
                                        {currentProduct?.options?.quantity?.map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Notes about artwork */}
                                <div className="text-sm text-gray-500">
                                    {productType === 'sticker'
                                        ? 'Note: Artwork please a blank/clean vector image'
                                        : 'First-Time Order template fee: £50'
                                    }
                                </div>                                {/* Price breakdown for paper bags */}
                                {productType === 'bag' && (
                                    <div className="mt-8">
                                        <div className="flex justify-between py-2 border-t">
                                            <span>Product total</span>
                                            <span className="font-medium">£300.00</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-t">
                                            <span>Options total</span>
                                            <span className="font-medium">£0.00</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-t">
                                            <span>Grand total</span>
                                            <span className="font-bold">£300.00</span>
                                        </div>
                                    </div>
                                )}{/* Add to Cart and Customize Buttons - Dynamic based on product type and customizable flag */}
                                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-6">
                                    {currentProduct.customizable ? (
                                        <button
                                            onClick={() => openEditor(productType)}
                                            className="bg-gray-700 text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors flex-grow"
                                        >
                                            Customize
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2 flex-grow">
                                            <button
                                                onClick={handleAddToCart}
                                                className="bg-black text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition-opacity flex-1"
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={isWishlist ? () => window.location.href = '/wishlist' : handleToggleWishlist}
                                        className={`border rounded-full py-2 px-3 flex items-center justify-center ${isWishlist ? 'text-red-500 border-red-500' : 'text-gray-700 border-gray-300 hover:border-gray-700'
                                            }`}
                                        aria-label="Add to wishlist"
                                    >
                                        <span className="mr-2 text-sm">
                                            {isWishlist ? 'Browse WISHLIST' : 'Add to WISHLIST'}
                                        </span>
                                        <Heart className={`w-4 h-4 ${isWishlist ? 'fill-red-500' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description & Reviews Tabs */}
                    <div className="mt-16">
                        <div className="border-b">
                            <div className="flex">
                                <Tab
                                    active={activeTab === 'description'}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Description
                                </Tab>
                                <Tab
                                    active={activeTab === 'additional-information'}
                                    onClick={() => setActiveTab('additional-information')}
                                >
                                    Additional Information
                                </Tab>
                                <Tab
                                    active={activeTab === 'reviews'}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Reviews (0)
                                </Tab>
                            </div>
                        </div>

                        <div className="py-8">
                            {activeTab === 'description' ? (
                                <div className="prose max-w-none">
                                    <h2 className="text-2xl font-bold mb-4">{currentProduct.title}</h2>
                                    <p className="">
                                        {
                                            currentProduct.description
                                        }
                                    </p>


                                </div>
                            ) : activeTab === 'additional-information' ? (
                                <div>
                                    <p className="text-gray-500">Additional product information will be displayed here.</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-500">There are no reviews yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-16">                        <h2 className="text-2xl font-bold mb-6">Related products</h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Show related products based on current product type */}
                            {
                                relatedProducts.map((product) => (
                                    <div key={product._id} className="border rounded-md p-4 group">
                                        <div className="relative h-40 mb-4 overflow-hidden">
                                            <Image
                                                src={product.mainImage}
                                                alt={product.title}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <Link href={`/shop/${product.title}`} >
                                            <h3 className="font-medium mb-2 cursor-pointer hover:text-purple-600 text-center">{product.title}</h3>
                                        </Link>
                                        {product.productType === "bag" ? <p className="font-bold mb-4 text-center">
                                            {product.maxPrice
                                                ? `£${formatPrice(product.minPrice)}–£${formatPrice(product.maxPrice)}`
                                                : `£${formatPrice(product.minPrice)}`
                                            }
                                        </p> :
                                            <p className="font-bold mb-4 text-center">
                                                £{formatPrice(product.price)}
                                            </p>
                                        }
                                    </div>
                                ))
                            }

                        </div>
                    </div>

                    {/* Sticky Bottom Bar for Mobile

                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden z-50 flex justify-between items-center">                <div className="font-bold">
                        {currentProduct.maxPrice
                            ? `£${formatPrice(currentProduct.minPrice)}`
                            : `£${formatPrice(currentProduct.minPrice)}`
                        }
                    </div>                <button
                        onClick={() => currentProduct.customizable ? openEditor(productType) : handleAddToCart()}
                        className="bg-[#7000fe] text-white py-2 px-4 rounded-full"
                    >
                            {currentProduct.customizable ? 'Customize' : 'Add to cart'}
                        </button>
                    </div> */}



                    {/* Customization Message Notification */}
                    {showCustomizationMessage && (
                        <div className="fixed top-0 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md z-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 13H9v-2h2v2zm0-4H9V7h2v4z" />
                                    </svg>
                                    <span className="font-semibold">Welcome back!</span>
                                </div>
                                <button
                                    onClick={() => setShowCustomizationMessage(false)}
                                    className="text-green-500 hover:text-green-700"
                                    aria-label="Close notification"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2 text-sm">
                                You have successfully returned from customization. Review your changes and proceed with your order.                    </div>
                        </div>
                    )}                    {/* Enhanced Customizer Modal */}
                    {/* {showEnhancedCustomizer && currentProduct && (
                        <EnhancedCustomizer
                            product={{
                                id: `${productType}-${Date.now()}`,
                                title: currentProduct.title,
                                productType: currentProduct.productType,
                                mockupImages:{
                                    front: currentProduct.mainImage,
                                    back: currentProduct.mainImage
                                },
                                quantity,
                                minPrice: currentProduct.minPrice || 0,
                                maxPrice: currentProduct.maxPrice || currentProduct.minPrice || 0,
                                options: {
                                    bagSizes: currentProduct.options?.bagSizes || [],
                                    printColors: currentProduct.options?.printColors || [],
                                    shapes: currentProduct.options?.shapes || []
                                }
                            }}
                            onClose={() => setShowEnhancedCustomizer(false)}
                        />
                    )} */}

                    {/* Fabric Editor Modal */}
                    {showFabricEditor && currentProduct && (
                        <FabricEditor
                            product={{
                                id: `${productType}-${Date.now()}`,
                                title: currentProduct.title,
                                productType: currentProduct.productType,
                                mockupImages: {
                                    front: currentProduct.mockupImages?.front || currentProduct.mainImage,
                                    // back: currentProduct.mockupImages?.back || currentProduct.mainImage
                                },
                                quantity,
                                minPrice: currentProduct.minPrice || 0,
                                maxPrice: currentProduct.maxPrice || currentProduct.minPrice || 0,
                                bagSize: selectedSize,
                                printColor: selectedColor,

                            }}
                            onDesignReady={(designData) => {
                                console.log('Design ready:', designData);
                                // Handle design completion
                                setShowFabricEditor(false);
                            }}
                            onClose={() => setShowFabricEditor(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ProductDetailsPage;