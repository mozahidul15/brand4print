"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ProductFeatures = () => {
  const products = [
    {
      title: "Sticker &\nLabels",
      imageSrc: "/sticker-001-disc.jpg",
      bgColor: "#ff6b6b",
      discount: "20% OFF",
      link: "/products/stickers"
    },
    {
      title: "Craft Paper\nBags",
      imageSrc: "/paper-bag-001-dis.jpg",
      bgColor: "#4dabf7",
      discount: "20% OFF",
      link: "/products/paper-bags"
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product, index) => (
          <motion.div 
            key={index}
            className="relative rounded-2xl overflow-hidden h-[380px] group perspective-1000"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Card Front */}
            <motion.div 
              className="absolute inset-0 w-full h-full backface-hidden group-hover:rotateX-180 transition-all duration-700"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${product.imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: product.bgColor
              }}
            >
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                  viewport={{ once: true }}
                  className="uppercase font-medium mb-4"
                >
                  CUSTOMIZED
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-bold mb-6 whitespace-pre-line z-10"
                >
                  {product.title}
                </motion.h3>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="z-10"
                >
                  <a 
                    href={product.link}
                    className="inline-flex items-center border-2 hover:bg-white  rounded-full px-6 py-3 font-medium  hover:text-black text-white transition-all duration-300 group"
                  >
                    Shop Now 
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </motion.div>
              </div>

              {/* Discount badge */}
              {/* <motion.div 
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.2 + 0.5 
                }}
                viewport={{ once: true }}
                className="absolute top-4 right-4 bg-[#d90429] text-white font-bold flex items-center justify-center transform origin-center z-20"
                style={{ 
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  width: "80px",
                  height: "80px",
                  fontSize: "18px",
                  lineHeight: "1",
                  textAlign: "center"
                }}
              >
                {product.discount}
              </motion.div> */}
            </motion.div>            {/* Card Back */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden rotateX-180 group-hover:rotateX-0 transition-all duration-700 p-8 flex flex-col justify-center items-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${product.imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: product.bgColor
              }}
            >
              <h3 className="text-4xl font-bold mb-6 text-white text-center">
                {product.title.replace('\n', ' ')}
              </h3>
              <p className="text-white text-center mb-6">
                Premium quality, custom-designed {product.title.includes('Sticker') ? 'stickers and labels' : 'paper bags'} for your business needs.
              </p>
              <a 
                href={product.link}
                className="inline-flex items-center bg-[#7000fe] text-white rounded-full px-6 py-3 font-medium hover:bg-white hover:text-black transition-all duration-300 group"
              >
                Shop Now 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              
              {/* Discount badge on back */}
              {/* <div 
                className="absolute top-4 right-4 bg-[#d90429] text-white font-bold flex items-center justify-center z-20"
                style={{ 
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  width: "80px",
                  height: "80px",
                  fontSize: "18px",
                  lineHeight: "1",
                  textAlign: "center"
                }}
              >
                {product.discount}
              </div> */}
            </div>          </motion.div>
        ))}
      </div>

      {/* CSS for 3D flip effect */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .rotateX-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotateX-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotateX-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </section>
  );
};

export default ProductFeatures;
