"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useHomeData } from "@/context/HomeDataContext";
import { formatRupiah } from "@/lib/format";
import { Product } from "@/lib/types";

import { ShopProduct } from "./OrderForm";

const mapProduct = (product: Product): ShopProduct => ({
  _id: product._id,
  name: product.name,
  category:
    typeof product.category === "object" && product.category
      ? product.category.name || "Lainnya"
      : product.category || "Lainnya",
  price: product.price,
  image: product.image ?? "",
  description: product.description,
  slug: product.slug,
  hasDecant: product.hasDecant,
  decants: product.decants,
});

export default function JustIn() {
  const router = useRouter();

  const { products: homeProducts } = useHomeData();

  const products: ShopProduct[] = useMemo(
    () => (homeProducts ?? []).map(mapProduct),
    [homeProducts]
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    const tags = unique.filter((c) => c !== "Lainnya");
    const others = unique.includes("Lainnya") ? ["Lainnya"] : [];

    return [...tags, ...others, "All"];
  }, [products]);

  const [active, setActive] = useState("All");

  const filteredProducts = useMemo(() => {
    if (active === "All") return products;

    return products.filter((product) => product.category === active);
  }, [active, products]);

  useEffect(() => {
    const onFilter = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;

      if (name && categories.includes(name)) {
        setActive(name);
      }
    };

    window.addEventListener("ocil-fragrance-filter", onFilter);

    return () => {
      window.removeEventListener("ocil-fragrance-filter", onFilter);
    };
  }, [categories]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="just-in" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
            Ocil Fragrance
          </p>

          <h2 className="mt-3 text-4xl lg:text-5xl font-light">
            Featured Fragrances
          </h2>

          <p className="mt-5 text-neutral-500 max-w-xl mx-auto">
            Discover our premium perfume collection for every personality.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6" role="group" aria-label="Filter kategori">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              aria-pressed={active === item}
              className={`relative pb-2 text-sm uppercase tracking-[0.25em] transition-all duration-300 ${
                active === item
                  ? "text-black"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {item}

              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-black transition-all duration-300 ${
                  active === item ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((item) => (
            <button
              key={item._id}
              onClick={() => router.push(`/product/${item.slug || item._id}`)}
              className="group cursor-pointer text-left"
              aria-label={`Lihat ${item.name}`}
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-300">
                    <ShoppingBag size={40} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />

                <span className="absolute bottom-4 left-4 flex translate-y-2 items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-black opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ShoppingBag size={14} />

                  Pesan Sekarang
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  {item.category}
                </p>

                <h3 className="mt-2 text-lg font-medium leading-6">
                  {item.name}
                </h3>

                <p className="mt-2 text-lg font-semibold">
                  {formatRupiah(item.price)}
                </p>
              </div>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-20 text-center text-neutral-500">
            No fragrances found.
          </div>
        )}
      </div>
    </section>
  );
}
