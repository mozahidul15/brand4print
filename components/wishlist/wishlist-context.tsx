"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';

export interface WishlistItem {
    id: string;
    title: string;
    price: string | { min: string; max: string };
    image: string;
    productType: string;
    date: string;
    link: string;
    inStock?: number;
    options?: {
        size?: string;
        color?: string;
        shape?: string;
        width?: number;
        height?: number;
    };
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    toggleWishlist: (item: WishlistItem) => void;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const { addToast } = useToast();

    // Load wishlist from localStorage on component mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('brand4print-wishlist');
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (error) {
                console.error('Failed to parse wishlist from localStorage', error);
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('brand4print-wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        // Add only if not already in wishlist
        if (!isInWishlist(item.id)) {
            setWishlistItems(prevItems => [...prevItems, item]);

            // Show toast notification
            addToast({
                message: `${item.title} added to wishlist`,
                type: 'success',
                duration: 3000
            });
        }
    };

    const removeFromWishlist = (id: string) => {
        const itemToRemove = wishlistItems.find(item => item.id === id);
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));

        // Show toast notification if an item was actually removed
        if (itemToRemove) {
            addToast({
                message: `${itemToRemove.title} removed from wishlist`,
                type: 'info',
                duration: 3000
            });
        }
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some(item => item.id === id);
    };

    const toggleWishlist = (item: WishlistItem) => {
        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
        } else {
            addToWishlist(item);
        }
    };

    const clearWishlist = () => {
        setWishlistItems([]);

        // Show toast notification
        addToast({
            message: 'Wishlist cleared',
            type: 'info',
            duration: 3000
        });
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                clearWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
