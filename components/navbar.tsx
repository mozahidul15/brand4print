"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import {
    ChevronDown,
    Phone,
    Mail,
    Search,
    Heart,
    Menu,
    X,
    User
} from "lucide-react";
import { useWishlist } from '@/components/wishlist';
import { useAuth } from '@/components/auth';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import logo from "../public/bran4-logo.svg";
import paperBags from "../public/paperBags.jpg";
import stickerLabels from "../public/stickers.jpg";
import Image from 'next/image';
import ShoppingCart from "./shopping-cart";
const Navbar = () => {
    const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showdropdown, setShowdropdown] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { wishlistItems } = useWishlist();
    const { user, logout } = useAuth();
    const toggleShopMenu = () => {
        setIsShopMenuOpen(!isShopMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <>
            {/* Top Bar */}
            <div className="bg-red-600 text-white ">
                <div className="container  mx-auto px-8 py-4 grid grid-cols-1 md:grid-cols-3 justify-between items-center">
                    <div className="flex  md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6 mb-2 md:mb-0">
                        <div className="flex items-center font-bold text-xs sm:text-base">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>+44 20 3302 9730</span>
                        </div>
                        <div className="flex items-center font-semibold text-xs sm:text-base">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>info@brand4print.co.uk</span>
                        </div>
                    </div>                    <div className="text-center text-xs md:text-base">
                        20% off print services with coupon codes STICKER20 and PAPERBAG20! Don&apos;t miss out!
                    </div>
                    <div className="hidden  md:flex justify-end font-semibold">
                        <Link href="/contact" className="hover:underline">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
            {
                isSearchOpen ?
                    <div className="container mx-auto px-4">
                        {/* Search Overlay */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1 relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full py-4 pl-4 pr-10 border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none text-lg"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            <button
                                onClick={toggleSearch}
                                className="ml-4 p-2 hover:bg-gray-100 rounded-full"
                                aria-label="Close search"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                    :
                    <div className="border-b">
                        {/* Main Navbar */}
                        <div className="container mx-auto px-4 ">
                            {/* Desktop View */}
                            <div className="hidden lg:flex items-center justify-between">
                                {/* Logo */}
                                <Link href="/" className="flex items-center">
                                    <div className="flex items-center">
                                        <Image src={logo} alt="Brand4Print Logo" className="h-30" />
                                    </div>
                                </Link>

                                {/* Desktop Navigation */}
                                <div className="flex items-center space-x-8">
                                    <Link
                                        href="/"
                                        className="text-purple-600 font-medium hover:text-purple-700"
                                    >
                                        Home
                                    </Link>                                    <div className="relative group">
                                        <div className="flex items-center">
                                            <Link
                                                href="/shop"
                                                className="font-medium hover:text-purple-700 mr-1"
                                            >
                                                Shop
                                            </Link>
                                            <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                                        </div>
                                        <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <div className="w-[400px] p-4 border rounded-md shadow-md bg-white flex gap-4 ">
                                                <h3 className="text-purple-600  font-medium mb-4">Special Products</h3>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <div>
                                                        <Link href="/shop?productType=sticker" className="block group/item">
                                                            <div className="mb-3 overflow-hidden rounded-md">
                                                                <Image
                                                                    src={stickerLabels}
                                                                    alt="Stickers"
                                                                    width={150}
                                                                    height={150}
                                                                    className="rounded-md w-full h-auto transition-transform duration-300 group-hover/item:scale-105"
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="font-medium hover:text-[#7000fe]">Sticker & Labels</div>
                                                                <div className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">2</div>
                                                            </div>
                                                        </Link>
                                                    </div>

                                                    <div>
                                                        <Link href="/shop?productType=bag" className="block group/item">
                                                            <div className="mb-3 overflow-hidden rounded-md">
                                                                <Image
                                                                    src={paperBags}
                                                                    alt="Paper Bags"
                                                                    width={150}
                                                                    height={150}
                                                                    className="rounded-md w-full h-auto transition-transform duration-300 group-hover/item:scale-105"
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="font-medium hover:text-[#7000fe]">Paper Bags</div>
                                                                <div className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">2</div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/about-us"
                                        className="font-medium hover:text-purple-700"
                                    >
                                        About Us
                                    </Link>

                                    <Link
                                        href="/request-a-quote"
                                        className="font-medium hover:text-purple-700"
                                    >
                                        Request A Quote
                                    </Link>

                                    <Link
                                        href="/contact"
                                        className="font-medium hover:text-purple-700"
                                    >
                                        Contact
                                    </Link>
                                </div>                                {/* Desktop Right Icons */}
                                <div className="flex items-center space-x-4">
                                    <button
                                        aria-label="Search"
                                        className="p-2"
                                        onClick={toggleSearch}
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>



                                    <Link href="/wishlist">
                                        <button aria-label="Wishlist" className="p-2 cursor-pointer relative">
                                            <Heart className="h-5 w-5" fill={wishlistItems.length > 0 ? "red" : "none"} />
                                            {wishlistItems.length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                    {wishlistItems.length}
                                                </span>
                                            )}
                                        </button>
                                    </Link>
                                    <ShoppingCart />
                                    {
                                        user ? (
                                            <div className="relative group">
                                                <div className="flex items-center cursor-pointer">
                                                    <User className="h-5 w-5 mr-1" />
                                                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                                                    <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                                                </div>
                                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                    <div className="w-48 p-2 border rounded-md shadow-md bg-white">


                                                        {
                                                            user.isAdmin == true ? <>
                                                                <Link href="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                    Admin Panel
                                                                </Link>
                                                            </> :
                                                                <>
                                                                    <Link href="/my-account" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                        My Account
                                                                    </Link>
                                                                    <Link href="/orders" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                        My Orders
                                                                    </Link>
                                                                    <Link href="/wishlist" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                        My Wishlist
                                                                    </Link>
                                                                </>
                                                        }
                                                        <button
                                                            onClick={() => logout()}
                                                            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600"
                                                        >
                                                            Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href="/my-account">
                                                <button aria-label="My Account" className="p-2 cursor-pointer flex items-center">
                                                    <User className="h-5 w-5 mr-1" />
                                                    <span className="font-medium">Login</span>
                                                </button>
                                            </Link>
                                        )}
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="flex lg:hidden items-center justify-between">
                                {/* Mobile menu button - Left */}
                                <div className="flex items-center">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <button
                                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700"
                                            >
                                                <Menu className="h-6 w-6" />
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-full sm:max-w-md p-0">
                                            <div className="flex flex-col h-full">
                                                {/* Mobile Menu Header */}
                                                <SheetHeader className="border-b p-4">
                                                    <SheetTitle className="text-xl font-bold">Main Menu</SheetTitle>
                                                </SheetHeader>

                                                {/* Mobile Menu Items */}                                                <div className="flex-1 overflow-y-auto">
                                                    <Link
                                                        href="/"
                                                        className="block px-4 py-4 text-base font-medium border-b"
                                                    >
                                                        Home
                                                    </Link>


                                                    <div className="border-b">
                                                        <div className="flex items-center justify-between">
                                                            <Link
                                                                href="/shop"
                                                                className="flex-grow px-4 py-4 text-base font-medium"
                                                            >
                                                                Shop
                                                            </Link>
                                                            <button
                                                                onClick={toggleShopMenu}
                                                                className="px-4 py-4"
                                                            >
                                                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <div className={`pl-4 pb-4 space-y-3 overflow-hidden transition-all duration-300 ${isShopMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                            <Link
                                                                href="/shop/stickers"
                                                                className="block py-1 text-sm text-gray-600 hover:text-purple-600"
                                                            >
                                                                Sticker & Labels
                                                            </Link>
                                                            <Link
                                                                href="/shop/paper-bags"
                                                                className="block py-1 text-sm text-gray-600 hover:text-purple-600"
                                                            >
                                                                Paper Bags
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href="/about-us"
                                                        className="block px-4 py-4 text-base font-medium border-b"
                                                    >
                                                        About Us
                                                    </Link>

                                                    <Link
                                                        href="/request-a-quote"
                                                        className="block px-4 py-4 text-base font-medium border-b"
                                                    >
                                                        Request A Quote
                                                    </Link>

                                                    <Link
                                                        href="/contact"
                                                        className="block px-4 py-4 text-base font-medium border-b"
                                                    >
                                                        Contact
                                                    </Link>
                                                </div>

                                                {/* Mobile Menu Footer with Icons */}
                                                <div className="border-t p-4 flex justify-around">
                                                    <div className="flex flex-col items-center">
                                                        <button
                                                            aria-label="Search"
                                                            className="p-2"
                                                            onClick={toggleSearch}
                                                        >
                                                            <Search className="h-5 w-5" />
                                                        </button>
                                                        <span className="text-xs mt-1">Search</span>
                                                    </div>                                                    <div className="flex flex-col items-center">
                                                        <Link href="/wishlist">
                                                            <div className="relative">
                                                                <button aria-label="Wishlist" className="p-2 cursor-pointer">
                                                                    <Heart className="h-5 w-5" fill={wishlistItems.length > 0 ? "red" : "none"} />
                                                                    {wishlistItems.length > 0 && (
                                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                                            {wishlistItems.length}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                                <span className="text-xs mt-1 block text-center">Wishlist</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <ShoppingCart />
                                                        <span className="text-xs mt-1">Cart</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                {/* Logo - Center */}
                                <div className="flex justify-center">
                                    <Link href="/" className="flex items-center">
                                        <Image src={logo} alt="Brand4Print Logo" className="h-30" />
                                    </Link>
                                </div>

                                {/* Shopping Cart - Right */}
                                <div className="flex items-center">
                                    <ShoppingCart />
                                    {user ? (
                                        <div className="relative group">
                                            <div className="flex items-center cursor-pointer" onClick={() => setShowdropdown(!showdropdown)}>
                                                <User className="h-5 w-5 mr-1" />
                                                <span className="font-medium">{user.name.split(' ')[0]}</span>
                                                <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                                            </div>
                                            <div className={`absolute right-0 top-full pt-2 z-50 ${showdropdown === true ? "opacity-100 block" : "opacity-0 hidden"}`}
                                                
                                            >
                                                <div className="w-48 p-2 border rounded-md shadow-md bg-white">


                                                    {
                                                        user.isAdmin == true ? <>
                                                            <Link href="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                Admin Panel
                                                            </Link>
                                                        </> :
                                                            <>
                                                                <Link href="/my-account" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                    My Account
                                                                </Link>
                                                                <Link href="/orders" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                    My Orders
                                                                </Link>
                                                                <Link href="/wishlist" className="block px-3 py-2 rounded hover:bg-gray-100">
                                                                    My Wishlist
                                                                </Link>
                                                            </>
                                                    }
                                                    <button
                                                        onClick={() => logout()}
                                                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href="/my-account">
                                            <button aria-label="My Account" className="p-2 cursor-pointer flex items-center">
                                                <User className="h-5 w-5 mr-1" />
                                                <span className="font-medium">Login</span>
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation - Now handled by Sheet component above */}
                    </div>
            }


        </>
    );
};

export default Navbar;