"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/components/wishlist';
import { Heart } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState } from 'react';

// Define props types for product cards
interface ProductCardProps {
    id: string;
    imageSrc: string;
    title: string;
    price: string | { min: string; max: string };
    link: string;
    viewMode: 'grid' | 'list';
    productType: string;
    customizable?: boolean;
}
const ProductCard: React.FC<ProductCardProps> = ({
    imageSrc,
    title,
    price,
    link,
    viewMode,
    productType,
    customizable = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToast } = useToast();

    // Extract the product ID from the link
    const productId = `${productType}-${link.split('/').pop()}`;

    // Check if the product is in the wishlist
    const [isInWishlistState, setIsInWishlistState] = useState(false);

    // Update isInWishlistState when the component mounts or when isInWishlist changes
    useEffect(() => {
        setIsInWishlistState(isInWishlist(productId));
    }, [productId, isInWishlist]);

    // Handle wishlist functionality
    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Create a wishlist item
        const wishlistItem = {
            id: productId,
            title: title,
            price: price,
            image: imageSrc,
            productType: productType,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            link: link,
            options: {}
        };

        // Toggle the item in wishlist
        toggleWishlist(wishlistItem);

        // Update local state to reflect wishlist status
        setIsInWishlistState(!isInWishlistState);

        // Show toast notification
        addToast({
            message: isInWishlistState
                ? `${title} removed from wishlist`
                : `${title} added to wishlist`,
            type: isInWishlistState ? 'info' : 'success',
            duration: 3000
        });
    };    if (viewMode === 'list') {
        return (
            <div
                className="product-card p-5 flex gap-8 border border-gray-100 hover:border-gray-200 rounded-lg mb-4 transition-all duration-300 hover:shadow-lg bg-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={link} className="block w-1/3 relative overflow-hidden rounded-lg">
                    <div className="relative aspect-square overflow-hidden rounded-lg group">
                        {/* Customizable badge for list view */}
                        {customizable && (
                            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-medium">
                                Customizable
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <Image
                            src={imageSrc}
                            alt={title}
                            fill
                            className="object-contain transition-transform duration-500 hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                </Link>

                <div className="w-2/3 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold mb-2">
                                <Link href={link} className="hover:text-purple-700 transition-colors">
                                    {title}
                                </Link>
                            </h3>

                            {/* Wishlist button */}
                            <button
                                className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
                                aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`h-5 w-5 ${isInWishlistState ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                        </div>

                        <div className="font-bold text-xl mb-3 text-gray-800">
                            {typeof price === 'string' ? (
                                <>£{price}</>
                            ) : (
                                <>£{price.min} – £{price.max}</>
                            )}
                        </div>

                        <p className="text-gray-600 mb-4 text-sm">Premium quality products for your business needs. Designed to meet professional standards with fast turnaround times.</p>
                        
                        {/* Product type tag */}
                        <div className="mb-4">
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md font-medium">
                                {productType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={link}
                        className={`inline-block text-white px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full shadow-md hover:shadow-lg ${
                            customizable 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                                : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800'
                        }`}
                    >
                        {customizable ? "Customize Now" : "Select Options"}
                    </Link>
                </div>
            </div>
        );
    }    return (
        <div
            className="product-card bg-white transition-all duration-300 relative rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-lg group overflow-hidden h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative p-4 pb-0">
                {/* Wishlist button - always visible but styled differently based on hover */}
                <button
                    className={`absolute top-5 right-5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isHovered || isInWishlistState 
                            ? 'bg-white shadow-md' 
                            : 'bg-white/80'
                    }`}
                    aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={handleToggleWishlist}
                >
                    <Heart className={`h-5 w-5 transition-all duration-300 ${isInWishlistState ? 'fill-red-500 text-red-500' : isHovered ? 'text-gray-700' : 'text-gray-400'}`} />
                </button>

                {/* Customizable badge */}
                {customizable && (
                    <div className="absolute top-5 left-5 z-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-medium">
                        Customizable
                    </div>
                )}

                <Link href={link} className="block">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg group">
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <Image
                            src={imageSrc}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-contain transition-transform duration-500"
                            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                        />
                    </div>
                </Link>
            </div>

            <div className="p-4 pt-2 flex flex-col flex-grow text-center">
                {/* Product type tag */}
                <div className="mb-2">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                        {productType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                </div>
                
                <h3 className="text-sm font-semibold mb-2 line-clamp-2 hover:text-purple-700 transition-colors">
                    <Link href={link}>{title}</Link>
                </h3>
                
                <div className="font-bold text-lg mb-3 text-gray-800 mt-auto">
                    {typeof price === 'string' ? (
                        <>£{price}</>
                    ) : (
                        <>£{price.min} – £{price.max}</>
                    )}
                </div>

                <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <Link
                        href={link}
                        className={`inline-block text-white py-2.5 text-sm font-medium transition-all duration-300 rounded-full w-full shadow-md hover:shadow-lg ${
                            customizable 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                                : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800'
                        }`}
                    >
                        {customizable ? "Customize Now" : "Select Options"}
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;