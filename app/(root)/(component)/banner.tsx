"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// // Add custom styles for script font
// const scriptStyle = {
//     fontFamily: 'cursive, "Brush Script MT", "Comic Sans MS", sans-serif',
//     fontStyle: 'italic'
// };

const Banner = () => {
    const [activeSlide, setActiveSlide] = useState(0);    const slides = [
        {
            id: 0,
            category: "PRINTING SERVICES",
            title: "Custom Stickers & Labels",
            description: "Stand out with custom stickers and labels that reflect your brand's identity.",
            buttonText: "Shop Now",
            buttonLink: "/products/stickers",
            imageSrc: "/sticker-print_banerd.png",
            bgImage: "/rev_home7.jpg",
            discount: "20% OFF",
            accentImage: "/sticker-red-f.png",
            hasRedCircle: true,
        },
        {
            id: 1,
            category: "PRINTING SERVICES",
            title: "Customized Paper Bags",
            description: "Experience the power of customization with our tailored paper bags, designed to amplify your brand's message with every use.",
            buttonText: "Shop Now",
            buttonLink: "/products/paper-bags",
            imageSrc: "/paperbag-banner0001.png",
            bgImage: "/rev_home7.jpg",
            discount: "20% OFF",
            accentImage: "/Yellow-Circle-No-Background.png",
            hasYellowCircle: true,
        }
    ];

    // Auto rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev === 0 ? 1 : 0));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setActiveSlide(index);
    };

    return (
        <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-100">
            {/* Background with subtle pattern */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-95"
                style={{
                    backgroundImage: `url(${slides[activeSlide].bgImage})`,
                    backgroundPosition: 'center',
                }}
            />            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-5 mix-blend-overlay z-5"
                style={{
                    backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23000000\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
                    backgroundSize: '100px 100px'
                }}
            />            {/* Content */}
            <div className="max-w-7xl mx-auto h-full relative z-20 px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row items-center h-full"
                    >                        {/* Left content */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 z-30">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-sm text-gray-700 font-medium tracking-wider mb-2"
                            >
                                {slides[activeSlide].category}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6 relative z-30"
                            >
                                {slides[activeSlide].title}
                            </motion.h1>                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="text-gray-700 mb-8 max-w-lg text-base relative z-30"
                            >
                                {slides[activeSlide].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="relative z-30"
                            >                                <a
                                href={slides[activeSlide].buttonLink}
                                className="inline-flex items-center bg-white text-black border border-black/80 rounded-full px-8 py-3 font-medium hover:bg-black hover:text-white transition-all duration-300 group shadow-sm"
                            >
                                    {slides[activeSlide].buttonText}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </motion.div>
                        </div>                        {/* Right content - product images */}
                        <div className="w-full md:w-1/2 relative h-full flex items-center justify-center p-4">                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full h-[300px] md:h-[800px]"
                            >
                                {/* First slide: Stickers */}
                                {activeSlide === 0 && (
                                    <>                                        {/* Red circle backdrop - keep at z-20 to be above the sticker image */}
                                        <div className="absolute left-0 top-0 md:top-20 z-20">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 15,
                                                    delay: 0.2
                                                }}
                                                className="relative w-[400px] h-[400px]"
                                            >
                                                <Image
                                                    src="/sticker-red-f.png"
                                                    alt="Red circle"
                                                    fill
                                                    className="object-contain animate-pulse"
                                                />
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                                                    <div className="text-2xl font-bold mb-2">PRINT YOUR</div>
                                                    <div className="text-3xl font-light italic" style={{fontFamily: "cursive, 'Brush Script MT', sans-serif"}}>Design</div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Main product image */}
                                        <div className="absolute inset-0 right-0 z-10 flex items-center justify-end">
                                            <Image
                                                src="/sticker-print_banerd.png"
                                                alt="Custom Stickers & Labels"
                                                width={1100}
                                                height={900}
                                                className="object-contain max-w-none"
                                                priority
                                                style={{ transform: "scale(1.15)" }}
                                            />
                                        </div>
                                    </>
                                )}                                {/* Second slide: Paper Bags */}
                                {activeSlide === 1 && (
                                    <>                                        {/* Yellow circle backdrop - moved to z-10 to be behind the image */}
                                        <div className="absolute left-0 top-0 md:top-20 z-10">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ 
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 15,
                                                    delay: 0.2
                                                }}
                                                className="relative w-[350px] h-[350px]"
                                            >                                                <Image
                                                    src="/Yellow-Circle-No-Background.png"
                                                    alt="Yellow circle"
                                                    fill
                                                    className="object-contain animate-pulse"
                                                />
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                                                    <div className="text-2xl font-bold mb-2">YOUR</div>
                                                    <div className="text-3xl font-bold">LOGO</div>
                                                </div>
                                            </motion.div>
                                        </div>                                        {/* Main product image */}                                        <div className="absolute inset-0 right-0 z-20 flex items-center justify-end">
                                            <Image
                                                src="/paperbag-banner0001.png"
                                                alt="Customized Paper Bags"
                                                width={1100}
                                                height={900}
                                                className="object-contain max-w-none"
                                                priority
                                                style={{ transform: "scale(1.15)" }}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Discount badge */}                                <motion.div
                                    initial={{ scale: 0, rotate: -15 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.5
                                    }}
                                    className="absolute top-10 right-4 md:right-16 z-30"
                                >
                                    <div className="relative w-[160px] h-[160px]">
                                        <Image
                                            src="/20discoutn.png"
                                            alt="20% discount"
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>                {/* Navigation dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            onClick={() => handleDotClick(index)}
                            className={`transition-all duration-300 shadow-sm ${activeSlide === index
                                    ? "w-8 h-3 bg-[#f03e3e] rounded-full"
                                    : "w-3 h-3 bg-gray-300 hover:bg-gray-500 rounded-full"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Banner;