"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="py-20 md:py-28 px-4 md:px-8 lg:px-16 overflow-hidden bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">                        {/* Left side - Images */}
                        <motion.div
                            className="w-full md:w-1/2 relative"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Main image with sticker overlays */}
                            <div className="relative w-full h-[450px] md:h-[500px] mb-8">
                                {/* Main bag image in center */}
                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] z-20">
                                    <Image
                                        src="/cu.png"
                                        alt="Custom paper bag with logo"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto"
                                        priority
                                    />
                                </div>

                                {/* Blue sticker - top right */}
                                <div className="absolute right-0 top-0 w-[150px] md:w-[180px] z-20">
                                    <div className="backdrop-blur-sm bg-white/30 rounded-md p-2 shadow-lg transition-transform duration-300 hover:scale-110">
                                        <Image
                                            src="/cu-sm-1.png"
                                            alt="Blue custom sticker design"
                                            width={180}
                                            height={180}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>

                                {/* Yellow sticker - bottom left */}
                                <div className="absolute left-0 -bottom-30 w-[150px] md:w-[180px] z-20">
                                    <div className="backdrop-blur-sm bg-white/30 rounded-md p-2 shadow-lg transition-transform duration-300 hover:scale-110">
                                        <Image
                                            src="/cu-sm-2.png"
                                            alt="Yellow custom sticker design"
                                            width={180}
                                            height={180}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>

                                {/* Red sticker - bottom right */}
                                <div className="absolute right-10 -bottom-20 w-[150px] md:w-[180px] z-20">
                                    <div className="backdrop-blur-sm bg-white/30 rounded-md p-2 shadow-lg transition-transform duration-300 hover:scale-110">
                                        <Image
                                            src="/cu-sm-3.png"
                                            alt="Red custom sticker design"
                                            width={180}
                                            height={180}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right side - Text content */}
                        <motion.div
                            className="w-full md:w-1/2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >                            <span className="text-[#7000fe] font-semibold uppercase tracking-wider mb-2 block">
                                ABOUT PRINTING
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Create Impactful Prints, <br /><span className="text-[#7000fe]">Elevate Your Brand</span>
                            </h1>

                            <p className="text-gray-700 mb-6">
                                At Brand4Print, we understand the power of visual branding. Let us help you create stunning prints that
                                showcase your brand and leave a lasting impression. Here&apos;s how we can help:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 bg-[#7000fe] rounded-full mt-2.5"></div>
                                    <div>
                                        <span className="font-bold">Custom Designs:</span> Tailor-made designs reflecting your brand&apos;s identity and values.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 bg-[#7000fe] rounded-full mt-2.5"></div>
                                    <div>
                                        <span className="font-bold">Quality Materials:</span> Premium materials ensuring durability and visual appeal.
                                    </div>
                                </li>                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 bg-[#7000fe] rounded-full mt-2.5"></div>
                                    <div>
                                        <span className="font-bold">Attention to Detail:</span> Precision in color accuracy and intricate designs.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 bg-[#7000fe] rounded-full mt-2.5"></div>
                                    <div>
                                        <span className="font-bold">Fast Turnaround:</span> Quick production times without compromising quality.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 bg-[#7000fe] rounded-full mt-2.5"></div>
                                    <div>
                                        <span className="font-bold">Sustainable Solutions:</span> Eco-friendly printing options to reduce environmental impact.
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/shop"
                                    className="inline-flex items-center justify-center bg-[#7000fe] hover:bg-purple-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
                                    See our products
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>            </section>

            {/* Brand Story Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.h2
                            className="text-3xl md:text-5xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Prints That Define Your <span className="text-[#7000fe]">Brand</span>
                        </motion.h2>
                        <div className="w-24 h-1 bg-[#7000fe] mx-auto mb-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold mb-6">About Us</h3>
                            <p className="text-gray-700 mb-6">
                                Welcome to Brand4Print, your premier destination for top-quality printing solutions in Enfield and beyond.
                                Established with a passion for creativity and excellence, Brand4Print is dedicated to helping businesses
                                elevate their brand image through customized paper bag and sticker printing services.
                            </p>
                            <p className="text-gray-700">
                                At Brand4Print, we understand the power of branding and the importance of leaving a lasting impression.
                                Our team of experienced professionals is committed to delivering exceptional results tailored to meet
                                the unique needs and preferences of each client.
                            </p>
                        </motion.div>

                        <motion.div
                            className="relative h-[350px] overflow-hidden rounded-lg shadow-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/paperBags.jpg"
                                alt="Premium custom printed bags"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                                <div className="p-6 text-white">
                                    <span className="text-sm uppercase tracking-wider">Premium Quality</span>
                                    <h4 className="text-xl font-bold">Custom Paper Bags & Stickers</h4>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-gray-50 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="order-2 md:order-1 relative h-[350px] overflow-hidden rounded-lg shadow-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/stickers.jpg"
                                alt="Premium custom stickers"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                                <div className="p-6 text-white">
                                    <span className="text-sm uppercase tracking-wider">Excellence in Design</span>
                                    <h4 className="text-xl font-bold">Bringing Your Vision to Life</h4>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="order-1 md:order-2"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                            <p className="text-gray-700 mb-6">
                                Our mission at Brand4Print is simple: to provide our clients with the highest quality printing solutions
                                that exceed expectations. We believe in the power of collaboration and strive to build long-lasting
                                relationships with our clients based on trust, reliability, and outstanding service.
                            </p>

                            <h3 className="text-2xl font-bold mt-10 mb-6">What Sets Us Apart</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-[#7000fe] flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-bold block">Customization:</span>
                                        <p className="text-gray-700">We understand that every brand is unique. That&apos;s why we offer fully customizable printing solutions to help our clients stand out in the market.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-[#7000fe] flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-bold block">Quality Assurance:</span>
                                        <p className="text-gray-700">We take pride in using premium materials and state-of-the-art printing techniques to ensure impeccable results with every project.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-[#7000fe] flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-bold block">Sustainability:</span>
                                        <p className="text-gray-700">As stewards of the environment, we are committed to eco-friendly practices and offer sustainable printing options to minimize our ecological footprint.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-[#7000fe] flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-bold block">Prompt Delivery:</span>
                                        <p className="text-gray-700">We value your time. With our efficient production process, we guarantee timely delivery of your printed materials without compromising on quality.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#7000fe] text-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment to You</h3>
                        <p className="text-lg mb-8">
                            At Brand4Print, your satisfaction is our top priority. From the initial consultation to the final delivery,
                            we are dedicated to providing exceptional service, personalized attention, and unmatched expertise every step of the way.
                        </p>
                        <div className="mt-8">
                            <Link href="/request-a-quote"
                                className="inline-flex items-center justify-center bg-white text-[#7000fe] hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition-colors">
                                Request a Quote
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
                        <motion.div
                            className="w-full md:w-1/2"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-gray-700 mb-6">
                                Ready to elevate your brand with premium printing solutions? Contact us today to discuss your project
                                and discover how Brand4Print can bring your vision to life.
                            </p>
                            <p className="text-gray-700 mb-8">
                                Thank you for choosing Brand4Print – where quality meets excellence.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/contact"
                                    className="inline-flex items-center justify-center bg-[#7000fe] hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-full transition-colors">
                                    Contact Us
                                </Link>
                                <Link href="/shop"
                                    className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full transition-colors">
                                    Browse Products
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="w-full md:w-2/5"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-[#7000fe]/10 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7000fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block">Address</span>
                                            <p className="text-gray-600">Unit 7, Rear of 151, Hertford Road, EN3 5JG</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-[#7000fe]/10 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7000fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block">Phone</span>
                                            <a href="tel:+442039932732" className="text-gray-600 hover:text-[#7000fe]">+44 7495215306</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-[#7000fe]/10 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7000fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block">Email</span>
                                            <a href="mailto:info@brand4print.co.uk" className="text-gray-600 hover:text-[#7000fe]">info@brand4print.co.uk</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;