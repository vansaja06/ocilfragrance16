"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useFetch } from "@/lib/useFetch";
import { api } from "@/lib/api";
import { getSubscriberEmail } from "@/lib/subscription";
import {
  Collection as CollectionConfig,
  LimitedOffer,
  Product,
} from "@/lib/types";

interface CollectionsResponse {
  collection: CollectionConfig;
}

interface LimitedOfferResponse {
  limitedOffer: LimitedOffer;
}

interface SubscribedResponse {
  subscribed: boolean;
}

interface CollectionCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  product: Product | null;
}

const BLUR_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function Collection() {
  const router = useRouter();

  const { data: collectionData } =
    useFetch<CollectionsResponse>("/collections");

  const { data: offerData } =
    useFetch<LimitedOfferResponse>("/limited-offers");

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const email = getSubscriberEmail();

    if (!email) return;

    api
      .get<SubscribedResponse>(
        `/subscribers/status?email=${encodeURIComponent(email)}`
      )
      .then((res) => setIsSubscribed(Boolean(res.data.subscribed)))
      .catch(() => {});
  }, []);

  const cards: CollectionCard[] = useMemo(() => {
    const slots = [
      collectionData?.collection?.leftProduct,
      collectionData?.collection?.topRightProduct,
      collectionData?.collection?.bottomLeftProduct,
    ];

    return slots.map((product) => {
      if (typeof product !== "object" || !product) {
        return {
          id: "empty",
          title: "Collection",
          subtitle: "OCIL FRAGRANCE",
          image: "",
          product: null,
        };
      }

      const categoryName =
        typeof product.category === "object" && product.category
          ? product.category.name
          : null;

      return {
        id: product._id,
        title: categoryName || product.name,
        subtitle: categoryName ? categoryName.toUpperCase() : "COLLECTION",
        image: product.image || "",
        product,
      };
    });
  }, [collectionData]);

  if (!cards.some((card) => card.product)) {
    return null;
  }

  const [left, topRight, bottomLeft] = cards;

  const promo = offerData?.limitedOffer;

  const promoProduct =
    promo?.product && typeof promo.product === "object"
      ? promo.product
      : null;

  const showPromo = Boolean(
    isSubscribed && promo?.active !== false && promoProduct
  );

  const handlePromoClick = () => {
    if (promoProduct) {
      router.push(`/product/${promoProduct.slug || promoProduct._id}`);
    }
  };

  const handleCardClick = (card: CollectionCard) => {
    if (card.product) {
      router.push(`/product/${card.product.slug || card.product._id}`);

      return;
    }

    const el = document.getElementById("just-in");

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="collection"
      className="bg-white py-16 md:py-20 lg:py-24 mb-20 md:mb-32"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="text-center mb-12 md:mb-20">
          <p className="uppercase tracking-[0.35em] text-neutral-500 text-sm">
            Ocil Fragrance
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light">
            Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="relative rounded-3xl overflow-hidden group h-[450px] md:h-[600px] lg:h-auto">
            {left.image ? (
              <Image
                src={left.image}
                alt={left.title}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs tracking-[0.35em]">{left.subtitle}</p>

              <h3 className="mt-3 text-3xl max-w-sm leading-tight">
                {left.title}
              </h3>

              <button
                onClick={() => handleCardClick(left)}
                className="mt-8 rounded-full bg-white px-7 py-3 text-black transition hover:scale-105"
                aria-label={`Beli ${left.title}`}
              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:col-span-2 lg:grid-rows-[1.2fr_1fr]">

            <button
              onClick={() => handleCardClick(topRight)}
              className="relative rounded-3xl overflow-hidden group h-[350px] md:h-[450px] text-left w-full"
              aria-label={`Jelajahi ${topRight.title}`}
            >
              {topRight.image ? (
                <Image
                  src={topRight.image}
                  alt={topRight.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-neutral-100" />
              )}

              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute left-8 top-8 text-white">
                <p className="text-xs tracking-[0.35em]">
                  {topRight.subtitle}
                </p>

                <h3 className="mt-4 text-4xl max-w-lg leading-tight">
                  {topRight.title}
                </h3>

                <span className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-black transition group-hover:scale-105">
                  Explore
                </span>
              </div>
            </button>

            <div
              className={`grid gap-6 ${showPromo ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
            >

              <button
                onClick={() => handleCardClick(bottomLeft)}
                className={`rounded-3xl bg-[#f8f8f8] p-8 flex flex-col justify-between text-left w-full ${
                  showPromo ? "" : "md:col-span-2"
                }`}
                aria-label={`Lihat ${bottomLeft.title}`}
              >
                <div>
                  <p className="text-xs tracking-[0.35em] text-neutral-500">
                    {bottomLeft.subtitle}
                  </p>

                  <h3 className="mt-4 text-3xl leading-tight max-w-xs">
                    {bottomLeft.title}
                  </h3>

                  <p className="mt-5 text-neutral-600 line-clamp-3">
                    {bottomLeft.product?.description ||
                      "Experience luxury fragrances in 5ml, 10ml and 30ml sizes."}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <span className="underline underline-offset-4">
                    Browse
                  </span>

                  {bottomLeft.image ? (
                    <Image
                      src={bottomLeft.image}
                      alt={bottomLeft.title}
                      width={160}
                      height={160}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className="object-contain transition-all duration-500 hover:scale-110 w-32 md:w-40"
                    />
                  ) : null}
                </div>
              </button>

              {showPromo ? (
                <div
                  className="rounded-3xl bg-gradient-to-br from-black to-neutral-800 text-white flex flex-col justify-center items-center py-14"
                  role="region"
                  aria-label="Penawaran terbatas"
                >
                  <p className="uppercase tracking-[0.3em] text-sm text-neutral-300">
                    {promo?.label || "Limited Offer"}
                  </p>

                  <p className="text-6xl font-bold my-4">
                    {promo?.discountText || "30%"}
                  </p>

                  <p className="text-neutral-300 mb-8">
                    {promo?.description ||
                      "Discount For Selected Perfumes"}
                  </p>

                  <button
                    onClick={handlePromoClick}
                    className="rounded-full bg-white text-black px-8 py-3 transition hover:scale-105"
                  >
                    {promo?.buttonText || "Shop Now"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
