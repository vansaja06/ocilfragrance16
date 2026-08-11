"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useFetch } from "@/lib/useFetch";
import { Collection as CollectionConfig, Product } from "@/lib/types";

interface CollectionsResponse {
  collection: CollectionConfig;
}

interface CollectionCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  product: Product | null;
}

export default function Collection() {
  const router = useRouter();

  const { data: collectionData } =
    useFetch<CollectionsResponse>("/collections");

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
        {/* TITLE */}

        <div className="text-center mb-12 md:mb-20">
          <p className="uppercase tracking-[0.35em] text-neutral-500 text-sm">
            Ocil Fragrance
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light">
            Collections
          </h2>
        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}

          <div
            className="
              relative
              rounded-3xl
              overflow-hidden
              group
              h-[450px]
              md:h-[600px]
              lg:h-auto
            "
          >
            {left.image ? (
              <img
                src={left.image}
                alt={left.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
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
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div className="grid gap-6 lg:col-span-2 lg:grid-rows-[1.2fr_1fr]">
            {/* TOP */}

            <div
              className="relative rounded-3xl overflow-hidden group h-[350px] md:h-[450px]"
              onClick={() => handleCardClick(topRight)}
            >
              {topRight.image ? (
                <img
                  src={topRight.image}
                  alt={topRight.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    handleCardClick(topRight);
                  }}
                  className="mt-8 rounded-full bg-white px-7 py-3 text-black transition hover:scale-105"
                >
                  Explore
                </button>
              </div>
            </div>

            {/* BOTTOM */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DECANT */}

              <div
                className="rounded-3xl bg-[#f8f8f8] p-8 flex flex-col justify-between cursor-pointer"
                onClick={() => handleCardClick(bottomLeft)}
              >
                <div>
                  <p className="text-xs tracking-[0.35em] text-neutral-400">
                    {bottomLeft.subtitle}
                  </p>

                  <h3 className="mt-4 text-3xl leading-tight max-w-xs">
                    {bottomLeft.title}
                  </h3>

                  <p className="mt-5 text-neutral-500 line-clamp-3">
                    {bottomLeft.product?.description ||
                      "Experience luxury fragrances in 5ml, 10ml and 30ml sizes."}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      handleCardClick(bottomLeft);
                    }}
                    className="underline underline-offset-4"
                  >
                    Browse
                  </button>

                  {bottomLeft.image ? (
                    <img
                      src={bottomLeft.image}
                      alt={bottomLeft.title}
                      className="
                        w-32
                        md:w-40
                        object-contain
                        transition-all
                        duration-500
                        hover:scale-110
                      "
                    />
                  ) : null}
                </div>
              </div>

              {/* PROMO */}

              <div
                className="
                  rounded-3xl
                  bg-gradient-to-br
                  from-black
                  to-neutral-800
                  text-white
                  flex
                  flex-col
                  justify-center
                  items-center
                  py-14
                "
              >
                <p className="uppercase tracking-[0.3em] text-sm text-neutral-300">
                  Limited Offer
                </p>

                <h1 className="text-6xl font-bold my-4">30%</h1>

                <p className="text-neutral-300 mb-8">
                  Discount For Selected Perfumes
                </p>

                <button
                  onClick={() => handleCardClick(topRight)}
                  className="rounded-full bg-white text-black px-8 py-3 transition hover:scale-105"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
