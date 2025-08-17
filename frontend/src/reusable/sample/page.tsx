'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Example images (can replace with dynamic image URLs or fetched ones)
const images = [
  'https://source.unsplash.com/random/400x400/?watch',
  'https://source.unsplash.com/random/401x401/?watch',
  'https://source.unsplash.com/random/402x402/?watch',
  'https://source.unsplash.com/random/403x403/?watch',
  'https://source.unsplash.com/random/404x404/?watch',
];

export default function ImageCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 relative">
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="rounded-lg"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Watch ${index + 1}`}
              className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
