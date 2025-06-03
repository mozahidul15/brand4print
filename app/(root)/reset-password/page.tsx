"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [resetComplete, setResetComplete] = useState(false);

    useEffect(() => {
        // Get token from URL query parameter
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setMessage({
                text: 'Passwords do not match.',
                type: 'error',
            });
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setMessage({
                text: 'Password must be at least 6 characters long.',
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    text: data.message || 'Your password has been reset successfully.',
                    type: 'success',
                });
                setResetComplete(true);
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setMessage({
                    text: data.error || 'Password reset failed. Please try again.',
                    type: 'error',
                });
            }
        } catch (error) {
            console.log('Error:', error);
            setMessage({
                text: 'An error occurred. Please try again later.',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-gray-50 min-h-screen py-16 px-4">
                <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
                        <p className="text-gray-600 mt-2">
                            The password reset link is invalid or has expired.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="mb-6">
                            Please request a new password reset link.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-block bg-[#7000fe] hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-full transition duration-300"
                        >
                            Request New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Reset Your Password</h1>
                    <p className="text-gray-600 mt-2">
                        {resetComplete 
                            ? 'Your password has been reset successfully' 
                            : 'Create a new password for your account'}
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

                {!resetComplete ? (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] bg-gray-50"
                                    placeholder="Enter your new password..."
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 6 characters long
                                </p>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000fe] bg-gray-50"
                                    placeholder="Confirm your new password..."
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#7000fe] hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-full transition duration-300 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Set New Password'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="mb-6">
                            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h2 className="text-xl font-semibold mt-4">Password Reset Complete</h2>
                            <p className="text-gray-600 mt-2">
                                Your password has been changed successfully. Redirecting to login...
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="inline-block bg-[#7000fe] hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-full transition duration-300"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
