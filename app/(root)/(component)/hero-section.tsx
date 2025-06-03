"use client"

import React from 'react';
import Image from 'next/image';
import badge from '@/public/wt.png';  // Importing a badge image
const HeroSection = () => {
    return (
        <div className="relative mb-30">
            <section className="relative overflow-hidden">      {/* Fixed background image with grocery items and shopping bags */}
                <div className="absolute inset-0 z-0 bg-fixed" style={{ backgroundImage: 'url("/food-paper_Bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                </div>
                {/* Black overlay for better text readability */}
                <div className="absolute inset-0 z-[1] bg-black opacity-50"></div>
                {/* Content overlay */}
                <div className="relative z-[2] max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32 min-h-[600px] flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left side text content */}
                        <div className="text-white">
                            <span className="text-[#7000fe] font-medium text-sm md:text-base mb-3 block">LET&apos;S GET PRINTING</span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Your Premier Destination <br className="hidden md:block" />
                                for Exceptional Printing <br className="hidden md:block" />
                                Solutions <span className="text-[#7000fe]">Brand4print</span>
                            </h1>

                            <p className="text-gray-200 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
                                At Brand4Print, we take pride in delivering printing solutions that elevate your brand to new heights.
                                With our dedication to quality craftsmanship, customizable options, and competitive pricing,
                                we stand as your top choice in Enfield. Whether you need personalized paper bags or vibrant stickers,
                                we offer the perfect blend of excellence and affordability. Trust us to bring your brand vision to life,
                                one print at a time.
                            </p>
                        </div>

                        {/* Right side images - Paper bags with logos */}
                        <div className="hidden md:flex items-center justify-end">
                            <div className="relative">
                                <div className="flex items-center">
                                    <Image
                                        src="/paper-bag_brand-double.png"
                                        alt="Brand4print product showcase"
                                        width={550}
                                        height={650}
                                        className="object-contain"
                                    />
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="absolute -mt-36 z-50 flex justify-center w-full">
                <Image
                    src={badge}
                    alt='badge'
                    width={500}
                    height={500}
                />
            </div>
        </div>
    );
};

export default HeroSection;