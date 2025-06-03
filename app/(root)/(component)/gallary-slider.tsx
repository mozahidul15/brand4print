"use client"
import React, { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import slider images
import slider1 from "@/public/gallary-img-1.jpg"
import slider2 from "@/public/gallary-img-2.jpg"
import slider3 from "@/public/gallary-img-3.jpg"
import slider4 from "@/public/gallary-img-4.jpg"
import slider5 from "@/public/gallary-img-5.jpg"

const images = [
  slider1,
  slider2,
  slider3,
  slider4,
  slider5
];

// Custom arrow components
const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> }) => (
  <button
    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-md opacity-70 hover:opacity-100 transition-opacity"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <ChevronLeft className="h-6 w-6 text-gray-700" />
  </button>
);

const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLButtonElement> }) => (
  <button
    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-md opacity-70 hover:opacity-100 transition-opacity"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <ChevronRight className="h-6 w-6 text-gray-700" />
  </button>
);

const GallerySlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <div
        className={`w-3 h-3  rounded-full transition-all duration-300 ${
          currentSlide === i ? "bg-black" : "bg-gray-300"
        }`}
      />
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 overflow-hidden">      <Slider ref={setSliderRef} {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="outline-none">
            <div className="aspect-square relative overflow-hidden">
              <Image 
                src={img} 
                alt={`Brand4Print Gallery Item ${idx + 1}`}
                fill
                className="object-contain "
                priority={idx === 0}
              />
            </div>
          </div>
        ))}
      </Slider>
      <PrevArrow onClick={sliderRef?.slickPrev} />
      <NextArrow onClick={sliderRef?.slickNext} />
        <style jsx global>{`
        .custom-dots {
          position: absolute;
          bottom: -30px;
          display: flex !important;
          justify-content: center;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style: none;
          gap: 8px;

        }
        
        .slick-slide {
          padding: 0 0px;
        }
      `}</style>
    </div>
  );
};

export default GallerySlider;