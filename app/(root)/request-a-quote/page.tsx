"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const RequestAQuotePage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

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
        }, 1500);
    };

    const toggleAccordion = (index: number) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const faqs = [
        {
            question: "What types of printing services do you offer?",
            answer: "We offer a range of printing services including custom paper bags, stickers, labels, and other branding materials for businesses."
        },
        {
            question: "How does the printing process work?",
            answer: "Once we receive your request, our team will discuss the requirements, provide a quote, and upon approval, proceed with production. We keep you updated throughout the process."
        },
        {
            question: "What file formats do you accept?",
            answer: "We accept various file formats including AI, PSD, PDF, EPS, and high-quality JPG or PNG files for best print quality."
        },
        {
            question: "How long does the printing process take?",
            answer: "The timeline depends on the complexity and quantity of your order. Typically, most projects are completed within 1-2 weeks from approval."
        },
        {
            question: "What is the minimum order quantity?",
            answer: "Minimum order quantities vary by product. Please contact us for specific requirements for your project."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is in production, we'll provide you with updates on its progress. You can also contact us directly for any inquiries about your order status."
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column - Image and Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="relative mb-8">
                        <Image
                            src="/raq.png"
                            alt="Custom printing services"
                            width={500}
                            height={500}
                            className="w-full h-auto rounded-md "
                        />
                    </div>
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            Submit a <span className="text-[#7000fe]">print job</span> or <br />
                            <span className="text-[#7000fe]">request</span> a quote
                        </h1>                        <p className="text-gray-700 mb-6">
                            Are you ready to bring your vision to life? Whether you&apos;re looking to print custom paper
                            bags for your business or create vibrant stickers to promote your brand, we&apos;re here to
                            help at Brand4Print.
                        </p>
                        <h3 className="font-bold text-lg mb-4">How It Works:</h3>
                        <ol className="list-decimal list-inside space-y-4 pl-4 mb-6">
                            <li className="pl-2">
                                <strong>Submit Your Requirements:</strong> Simply fill out our easy-to-use online form with details
                                about your printing project. Let us know the quantity, size, design preferences, and other requirements.
                            </li>
                            <li className="pl-2">
                                <strong>Receive Your Quote:</strong> Once we receive your request, our team will review the
                                information provided and generate a personalized quote tailored to your specific needs.
                                We pride ourselves on competitive pricing without compromising quality.
                            </li>
                            <li className="pl-2">                                <strong>Approval and Production:</strong> After receiving your quote, let us know if you have any
                                questions or require any clarifications. Once you&apos;re satisfied with the quote, we can proceed
                                with your printing order.
                            </li>
                            <li className="pl-2">
                                <strong>Sit Back and Relax:</strong> Once your quote is approved, our dedicated team will get to                                work bringing your design to life. We&apos;ll keep you updated throughout the process
                                and ensure that your project is completed to your satisfaction.
                            </li>
                        </ol>
                    </div>


                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4">Why Choose Brand4Print:</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <div className="min-w-5 mt-1 text-[#7000fe]">•</div>
                                <div>
                                    <strong>Quality Printing:</strong> We use the latest printing technology and high-quality
                                    materials to ensure your printed products look professional and durable.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="min-w-5 mt-1 text-[#7000fe]">•</div>
                                <div>
                                    <strong>Customization Options:</strong> From size and shapes to color and finish, we offer a wide
                                    range of customization options to suit your specific needs.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="min-w-5 mt-1 text-[#7000fe]">•</div>
                                <div>                                    <strong>Fast Turnaround Times:</strong> We understand that time is of the essence. That&apos;s why we
                                    strive to complete your printing project quickly and efficiently, without
                                    compromising on quality.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="min-w-5 mt-1 text-[#7000fe]">•</div>
                                <div>
                                    <strong>Exceptional Customer Service:</strong> Our friendly and knowledgeable team is here to                                    assist you every step of the way. Have a question or need assistance? Don&apos;t
                                    hesitate to reach out – we&apos;re here to help.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4">Get Started Today:</h3>
                        <p className="text-gray-700 mb-4">
                            Ready to submit a print job or request a quote? Visit our website to fill out our online form
                            or get in touch with our team directly. We look forward to helping you bring your vision to
                            life with premium printing solutions from Brand4Print.
                        </p>
                        <p className="text-gray-700">
                            Thank you for choosing Brand4Print for all your printing needs.
                        </p>
                    </div>
                </motion.div>

                {/* Right Column - Form and FAQ */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-white rounded-md shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Order, Quote Or Question...</h2>                        <p className="text-gray-600 mb-6">
                            Enter your details below and we&apos;ll reply back as soon as possible.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe]/50"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Your email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe]/50"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Subject"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe]/50"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Your message (optional)"
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe]/50"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={`w-24 py-2 px-4 bg-[#7000fe] text-white rounded-md hover:bg-purple-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Submit'}
                            </button>

                            {isSubmitted && (
                                <p className="mt-4 text-green-600">
                                    Thank you! We&apos;ve received your request and will get back to you shortly.
                                </p>
                            )}
                        </form>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">
                            Discover Brand4Print: Your Printing Partner for Quality and Convenience
                        </h3>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-md overflow-hidden"
                                >
                                    <button
                                        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <span className="font-medium text-[#7000fe]">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 transform transition-transform ${activeAccordion === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {activeAccordion === index && (
                                        <div className="p-4 bg-white">
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">                            <p className="text-gray-700 mb-4">Don&apos;t hesitate to Ask for More Information - We&apos;re Here to Help!</p>
                            <p className="text-gray-700">
                                At Brand4Print, we are dedicated to providing you with the best printing solutions
                                tailored to your needs. If you have any questions or need further information about
                                our services, don&apos;t hesitate to reach out to us. Our friendly and knowledgeable team is
                                here to assist you every step of the way.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RequestAQuotePage;