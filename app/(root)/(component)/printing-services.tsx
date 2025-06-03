"use client"

import React from 'react';
import Image from 'next/image';

// Create a component for our printing services
const PrintingServices = () => {  const services = [
    {
      icon: "/quality-print-icon.svg",
      title: "Quality Printing:",
      description: "We deliver top-notch printing services with meticulous attention to detail."
    },
    {
      icon: "/low-minimum-icon.svg",
      title: "Low Minimum Orders:",
      description: "Enjoy the flexibility of placing small orders to meet your needs."
    },
    {
      icon: "/affordable-icon.svg",
      title: "Affordable Pricing:",
      description: "Benefit from competitive pricing without compromising on quality."
    },
    {
      icon: "/custom-solutions-icon.svg",
      title: "Custom Solutions:",
      description: "Tailored printing solutions to enhance your brand's image effectively."
    }
  ];


  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full w-32 h-32 flex items-center justify-center mb-6 shadow-sm">
                <Image 
                  src={service.icon} 
                  alt={service.title}
                  width={130}
                  height={130}
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 max-w-xs text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrintingServices;