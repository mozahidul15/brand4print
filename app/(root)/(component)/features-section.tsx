"use client"

import React from 'react';
import { Truck, ShieldCheck, Headphones, ShieldIcon } from 'lucide-react';

const FeaturesSection = () => {  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free delivery",
      description: "Free shipping after £100"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Money Back Guarantee",
      description: "Your satisfaction is important to us"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Top-notch support",
      description: "We are happy to assist you 24/7"
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "Low price guarantee",
      description: "With the best price and quality"
    }
  ];
  return (
    <section className="py-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="md:flex items-center text-center md:text-start gap-3">
              <div className="flex-shrink-0 text-gray-700 flex justify-center md:justify-start">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
