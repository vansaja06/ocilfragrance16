"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

import { api } from "@/lib/api";
import { Banner } from "@/lib/types";

interface BannersResponse {
  banners: Banner[];
}

const BLUR_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function HeroBanner() {
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  const banner = banners[current];

  useEffect(() => {
    let cancelled = false;

    api
      .get<BannersResponse>("/banners/active")
      .then((res) => {
        if (!cancelled) {
          setBanners(res.data?.banners ?? []);
          setCurrent(0);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToProduct = () => {
    if (!banner?.product) return;

    if (typeof banner.product === "object") {
      router.push(`/product/${banner.product.slug || banner.product._id}`);
    } else {
      router.push(`/product/${banner.product}`);
    }
  };

  useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (!contentRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );

    return () => {
      tl.kill();
    };
  }, [current]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <section
      id="shop"
      ref={heroRef}
      className="relative w-full h-[100svh] overflow-hidden"
      aria-label="Banner utama"
    >
      <Image
        src={banner.image || "/placeholder.jpg"}
        alt={banner.title.replace("\n", " ")}
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        className="object-contain bg-[#f8f8f8]"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-12 lg:px-24"
      >
        <div className="text-white max-w-md lg:max-w-xl">
          <p className="uppercase tracking-[4px] md:tracking-[8px] text-xs md:text-sm mb-4 md:mb-5 font-medium">
            {banner.subtitle}
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            {banner.title.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-200 leading-7 md:leading-8 max-w-lg">
            {banner.description}
          </p>

          <button
            onClick={goToProduct}
            className="mt-8 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white text-black font-semibold hover:scale-105 hover:bg-gray-100 transition-all duration-300"
          >
            {banner.button || "Shop Now"}
          </button>
        </div>
      </div>

      <button
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute top-1/2 -translate-y-1/2 left-3 md:left-8 w-10 h-10 md:w-16 md:h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 z-20"
      >
        <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-2xl text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 z-20"
      >
        <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
      </button>

      <div
        role="tablist"
        aria-label="Navigasi slide"
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-20"
      >
        {banners.map((item, index) => (
          <button
            key={item._id || index}
            role="tab"
            aria-selected={current === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`h-[4px] rounded-full transition-all duration-500 ${
              current === index
                ? "w-12 bg-white"
                : "w-8 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}
