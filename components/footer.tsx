import React from 'react';
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import logo from "../public/bran4-logo.svg";
import Image from 'next/image';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full max-w-7xl mx-auto">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Logo and Company Description */}
                    <div>
                        <Link href="/" className="block mb-6">
                            <div className="flex items-center">
                                <Image src={logo} alt="Brand4Print Logo" className="h-30" />
                            </div>
                        </Link>
                        <p className="text-gray-600 mb-8">
                            Our company is a printing firm located in Enfield, specializing in brand imprints on
                            stickers and paper bags. We offer personalized designs to provide our
                            customers with unique and striking brand promotions.
                        </p>
                        <div className="flex space-x-2">
                            <Link href="https://facebook.com" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Facebook size={18} className="text-gray-600" />
                            </Link>
                            <Link href="https://instagram.com" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Instagram size={18} className="text-gray-600" />
                            </Link>
                        </div>
                    </div>

                    {/* Get In Touch */}
                    <div>
                        <h3 className="text-xl font-medium mb-6">Get In Touch</h3>
                        <div className="space-y-3 text-gray-600">
                            <p>Unit 7, Rear of, 151 Hertford Rd,</p>
                            <p>Enfield EN3 5JG</p>
                            <p>info@brand4print.co.uk</p>
                            <p>+44 20 3302 9730</p>
                        </div>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="text-xl font-medium mb-6">Information</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/help-center" className="text-gray-600 hover:text-gray-900">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-gray-600 hover:text-gray-900">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/quote" className="text-gray-600 hover:text-gray-900">
                                    Request a Quote
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-xl font-medium mb-6">Useful links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/my-account" className="text-gray-600 hover:text-gray-900">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link href="/order-tracking" className="text-gray-600 hover:text-gray-900">
                                    Order Tracking
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-gray-600 hover:text-gray-900">
                                    Wishlist
                                </Link>
                            </li>
                        </ul>
                    </div>


                    {/* Terms */}
                    <div>
                        <h3 className="text-xl font-medium mb-6">Terms</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy-notice" className="text-gray-600 hover:text-gray-900">
                                    Privacy Notice
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900">
                                    Terms and Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/return-and-refund-policy" className="text-gray-600 hover:text-gray-900">
                                    Return and Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t border-gray-200">
                <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600">Copyright © {currentYear} Brand4print. All rights reserved</p>
                    <Link
                        href="#top"
                        className="flex items-center mt-4 md:mt-0"
                    >
                        <span className='font-bold text-xs'>

                        BACK TO TOP
                        </span>
                        <span className="ml-2 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 5L6 1L11 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;