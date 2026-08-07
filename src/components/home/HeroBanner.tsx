"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import { api } from "@/lib/api";
import { Banner } from "@/lib/types";

const fallbackBanners: Banner[] = [
  {
    _id: "fallback-1",
    active: true,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop",
    subtitle: "Ocil Fragrance",
    title: "The Essence\nof Elegance",
    description:
      "Discover an unforgettable fragrance crafted for those who embrace elegance, confidence, and timeless character.",
    button: "Shop Collection",
  },

  {
    _id: "fallback-2",
    active: true,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop",
    subtitle: "Signature Collection",
    title: "Find Your\nSignature Scent",
    description:
      "A refined selection of fragrances designed to become part of your everyday identity.",
    button: "Explore Scents",
  },

  {
    _id: "fallback-3",
    active: true,
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop",
    subtitle: "New Arrival",
    title: "A Scent\nThat Defines You",
    description:
      "Experience sophisticated notes blended with modern character and lasting elegance.",
    button: "Discover More",
  },
];

interface BannersResponse {
  banners: Banner[];
}

export default function HeroBanner() {
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [current, setCurrent] = useState(0);

  const banner = banners[current];
  const product =
    typeof banner.product === "object" && banner.product ? banner.product : null;

  useEffect(() => {
    let cancelled = false;

    api
      .get<BannersResponse>("/banners/active")
      .then((res) => {
        if (!cancelled && res.data?.banners?.length) {
          setBanners(res.data.banners);
          setCurrent(0);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToProduct = () => {
    if (product) {
      router.push(`/product/${product.slug || product._id}`);
    }
  };

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length]);

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
    );

    return () => {
      tl.kill();
    };
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
        alt={banner.title.replace("\n", " ")}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

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
          {/* Subtitle */}
          <p
            className="
              uppercase
              tracking-[4px]
              md:tracking-[8px]
              text-xs
              md:text-sm
              mb-4
              md:mb-5
              font-medium
            "
          >
            {banner.subtitle}
          </p>

          {/* Title */}
          <h1
            className="
              text-4xl
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
              font-bold
              leading-[1.05]
              tracking-tight
            "
          >
            {banner.title.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </h1>

          {/* Description */}
          <p
            className="
              mt-5
              text-sm
              sm:text-base
              md:text-lg
              text-gray-200
              leading-7
              md:leading-8
              max-w-lg
            "
          >
            {banner.description}
          </p>

          {/* Button */}
          <button
            onClick={goToProduct}
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
              hover:bg-gray-100
              transition-all
              duration-300
            "
          >
            {banner.button || "Shop Now"}
          </button>
        </div>
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
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
        aria-label="Next slide"
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
        {banners.map((item, index) => (
          <button
            key={item._id || index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-[4px] rounded-full transition-all duration-500 ${
              current === index
                ? "w-12 bg-white"
                : "w-8 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-48
          bg-gradient-to-t
          from-black/50
          to-transparent
          pointer-events-none
        "
      />
    </section>
  );
}
