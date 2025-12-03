"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSlider({ bannerImages, baseUrl }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === bannerImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToSlide = (i) => setCurrentImageIndex(i);

  const goNext = () =>
    setCurrentImageIndex((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );

  const goPrev = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );

  const currentImage = bannerImages[currentImageIndex];

   return (
    <section className="relative h-[75vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${baseUrl}/${currentImage.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="text-white max-w-2xl px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {currentImage.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6">
            {currentImage.description}
          </p>
          <Link

            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            {currentImage.buttonText}
          </Link>
        </div>
      </div>

      {/* Arrows */}
      {bannerImages.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {bannerImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {bannerImages.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
