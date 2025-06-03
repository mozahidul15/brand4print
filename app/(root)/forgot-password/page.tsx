"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [resetRequested, setResetRequested] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    text: data.message,
                    type: 'success',
                });
                setResetRequested(true);
            } else {
                setMessage({
                    text: data.error || 'Something went wrong. Please try again.',
                    type: 'error',
                });
            }
        } catch (error) {
            console.log(error);
            setMessage({
                text: 'An error occurred. Please try again later.',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Reset Your Password</h1>
                    <p className="text-gray-600 mt-2">
                        {resetRequested 
                            ? 'Check your email for the password reset link' 
                            : 'Enter your email address and we\'ll send you a link to reset your password.'}
                    </p>
                </div>

                {message && (
                    <div 
                        className={`p-4 mb-6 rounded-md ${
                            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {!resetRequested ? (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                    Email address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] bg-gray-50"
                                    placeholder="Enter your email address..."
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#7000fe] hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-full transition duration-300 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="mb-6">
                            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h2 className="text-xl font-semibold mt-4">Email Sent</h2>
                            <p className="text-gray-600 mt-2">
                                If {email} is registered with us, you&apos;ll receive a password reset link shortly.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[#7000fe] hover:underline font-medium"
                        >
                            Try with a different email
                        </button>
                    </div>
                )}

                <div className="text-center mt-6">
                    <Link href="/login" className="text-[#7000fe] hover:underline font-medium">
                        Return to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
