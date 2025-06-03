"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the subscription logic
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail('');
  };
  return (
    <section 
      className="w-full py-20 relative overflow-hidden rounded-3xl my-8 mx-auto max-w-7xl"
      style={{
        background: `url('/h5-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side with icon and main heading */}
          <motion.div 
            className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >            <motion.div 
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-2"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M85 15L60 40M85 15L60 15M85 15L85 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 85L40 60M15 85L15 60M15 85L40 85" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M40 40L60 60" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
              <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Sign up for <br />
                <span className="text-white">exclusive offers</span> <br />
                <span className="text-white/90">from us</span>
              </h2>
            </div>
          </motion.div>
          
          {/* Right side with description and form */}
          <motion.div 
            className="flex-1 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >            <p className="text-lg mb-8 max-w-md">
              Sign up to your newsletter for all the latest news and our
              villa exclusives promotion.
            </p>
            
            <form onSubmit={handleSubmit} className="flex max-w-md relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full py-4 px-6 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/70"
                required
              />
              <motion.button
                type="submit"
                className="absolute right-1 top-1 bg-white text-[#7000fe] hover:bg-[#7000fe] hover:text-white transition-colors duration-300 rounded-full p-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={submitted}
              >
                {submitted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <Send size={24} />
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
        {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff99ac]/40 via-[#a78bfa]/40 to-[#38bdf8]/40 backdrop-blur-[2px]"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light" 
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 2c7.18 0 13 5.82 13 13s-5.82 13-13 13S2 22.18 2 15 7.82 2 15 2z\" fill=\"%23FFF\" fill-opacity=\"0.2\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
          backgroundSize: '30px 30px'
        }}>
      </div>
    </section>
  );
};

export default NewsletterSignup;
