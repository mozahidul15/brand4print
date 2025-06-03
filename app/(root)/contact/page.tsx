"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Send } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Contact Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Get in <span className="text-[#7000fe]">touch</span> with us
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Have questions about our printing services? Feel free to reach out, and our team will get back to you as soon as possible.
                </p>
            </motion.div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Address */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white  rounded-lg p-8 text-center"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-[#7000fe]/10 rounded-full">
                            <MapPin className="h-8 w-8 text-[#7000fe]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Address</h3>
                    <p className="text-gray-600">
                        Unit 7, Rear of 151, Hertford Road, EN3 5JG
                    </p>
                </motion.div>

                {/* Get In Touch */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white  rounded-lg p-8 text-center"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-[#7000fe]/10 rounded-full">
                            <Phone className="h-8 w-8 text-[#7000fe]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
                    <p className="text-gray-600 mb-2">
                        Phone: +44 7495215306
                    </p>
                    <p className="text-gray-600">
                        Email: info@brand4print.co.uk
                    </p>
                </motion.div>

                {/* Hour of Operation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white  rounded-lg p-8 text-center"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-[#7000fe]/10 rounded-full">
                            <Clock className="h-8 w-8 text-[#7000fe]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Hour of Operation</h3>
                    <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM<br />
                        Sunday: Closed
                    </p>
                </motion.div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-gray-100 rounded-lg">
                {/* Left: Message Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="   p-8"
                >
                    <h2 className="text-5xl font-semibold mb-6 text-center ">Send a <span className="text-[#7000fe]">message</span></h2>


                    {isSubmitted ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                            Thank you for your message! We&lsquo;ll get back to you soon.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] focus:border-transparent bg-white"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] focus:border-transparent bg-white"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] focus:border-transparent bg-white"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] focus:border-transparent resize-none bg-white"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#7000fe] hover:bg-[#5d00d6] text-white py-3 px-6 rounded-md font-medium transition-all duration-200 flex justify-center items-center"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                Submit Message
                                                <Send className="ml-2 h-4 w-4" />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </motion.div>


            </div>


        </div>
    );
};

export default ContactPage;