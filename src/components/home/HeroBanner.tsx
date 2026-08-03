"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
    subtitle: "eXfr Collection",
    title: "Jackets for\nModern Man",
    description:
      "Discover premium collections with minimalist style and timeless fashion.",
    button: "Shop Now",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2000&auto=format&fit=crop",
    subtitle: "Summer Drop",
    title: "Streetwear\nEssentials",
    description: "Minimalist collection designed for everyday comfort.",
    button: "Explore",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2000&auto=format&fit=crop",
    subtitle: "New Arrival",
    title: "Minimal\nLifestyle",
    description: "Premium quality with timeless modern design.",
    button: "Discover",
  },
];

export default function HeroBanner() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);

  const banner = banners[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animation
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4",
    );
  }, [current]);

  return (
    <section
      id="shop"
      ref={heroRef}
      className="relative w-full h-[100svh] overflow-hidden"
    >
      {/* Background */}
      <img
        src={banner.image}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div
        ref={contentRef}
        className="
        absolute
        inset-0
        flex
        items-center
        px-6
        sm:px-8
        md:px-12
        lg:px-24
        "
      >
        <div className="text-white max-w-md lg:max-w-xl">
          <p className="uppercase tracking-[4px] md:tracking-[8px] text-xs md:text-sm mb-4 md:mb-5">
            {banner.subtitle}
          </p>

          <h1
            className="
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-bold
            leading-tight
          "
          >
            {banner.title.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </h1>

          <p
            className="
            mt-5
            text-sm
            sm:text-base
            md:text-lg
            text-gray-200
            leading-7
            md:leading-8
          "
          >
            {banner.description}
          </p>

          <button
            className="
            mt-8
            px-6
            py-3
            md:px-8
            md:py-4
            rounded-full
            bg-white
            text-black
            font-semibold
            hover:scale-105
            transition-all
            duration-300
            "
          >
            {banner.button}
          </button>
        </div>
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="
          absolute
          top-1/2
          -translate-y-1/2
          left-3
          md:left-8
          w-10
          h-10
          md:w-16
          md:h-16
          rounded-full
          border
          border-white/30
          bg-white/10
          backdrop-blur-2xl
          text-white
          flex
          items-center
          justify-center
          hover:bg-white/20
          hover:scale-110
          transition-all
          duration-300
          z-20
        "
      >
        <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="
        absolute
        right-3
        md:right-8
        top-1/2
        -translate-y-1/2
        w-10
        h-10
        md:w-16
        md:h-16
        rounded-full
        border
        border-white/30
        bg-white/10
        backdrop-blur-2xl
        text-white
        flex
        items-center
        justify-center
        hover:bg-white/20
        hover:scale-110
        transition-all
        duration-300
        z-20
      "
      >
        <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
      </button>

      {/* Pagination */}
      <div
        className="
        absolute
        bottom-6
        md:bottom-10
        left-1/2
        -translate-x-1/2
        flex
        items-center
        gap-2
        md:gap-3
        z-20
        "
      >
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-[4px] rounded-full transition-all duration-500 ${
              current === index
                ? "w-12 bg-white"
                : "w-8 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Gradient bawah */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </section>
  );
}
