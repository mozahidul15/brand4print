"use client"

import React from 'react';
import { ArrowRight, Star, ListChecks, Pencil, Timer, ShoppingBag } from 'lucide-react';

const BrandFeatures = () => {
    const features = [
        {
            icon: <ArrowRight className="h-12 w-12 text-white" />,
            title: "Custom Design Expertise:",
            description: "Our team specializes in creating custom designs that reflect your brand's identity, ensuring your paper bags and stickers stand out."
        },
        {
            icon: <Star className="h-12 w-12 text-white" />,
            title: "High-Quality Materials:",
            description: "We use premium materials for our paper bags and stickers, ensuring durability and visual appeal that leave a lasting impression."
        },
        {
            icon: <ListChecks className="h-12 w-12 text-white" />,
            title: "Versatile Printing Options:",
            description: "From intricate designs to bold logos, we offer versatile printing options to bring your brand vision to life on paper bags and stickers."
        },
        {
            icon: <Pencil className="h-12 w-12 text-white" />,
            title: "Attention to Sustainability:",
            description: "We prioritize eco-friendly practices, offering sustainable printing solutions that align with your brand's values."
        },
        {
            icon: <Timer className="h-12 w-12 text-white" />,
            title: "Prompt Turnaround Time:",
            description: "With our efficient production process, we ensure timely delivery of your customized paper bags and stickers without compromising quality."
        },
        {
            icon: <ShoppingBag className="h-12 w-12 text-white" />,
            title: "Exceptional Customer Service:",
            description: "Our dedicated team is committed to providing personalized assistance and support throughout the printing process, ensuring your satisfaction at every step."
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 max-w-xl mx-auto">   
                    <p className="text-[#7000fe] font-medium mb-2">PRINTING MADE EASY</p>
                    <h2 className="text-3xl md:text-6xl font-semibold">
                        Standing Out: What Sets <span className="text-[#7000fe]">Brand4Print</span> Apart
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 rounded-full bg-[#7000fe] p-4 ">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandFeatures;
