"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";

import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import { Product } from "@/lib/types";

import OrderModal, { ShopProduct } from "./OrderModal";

const fallbackProducts: ShopProduct[] = [
  {
    _id: "fallback-1",
    category: "Men",
    name: "Dior Sauvage Eau De Parfum",
    price: 1950000,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&q=80",
    description:
      "Parfum maskulin dengan sentuhan fresh dan aromatik. Karakter tegas untuk pria yang percaya diri.",
  },
  {
    _id: "fallback-2",
    category: "Women",
    name: "YSL Libre",
    price: 2150000,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&q=80",
    description:
      "Perpaduan lavender dan floral yang mewah. Wewangian feminin untuk momen istimewa.",
  },
  {
    _id: "fallback-3",
    category: "Unisex",
    name: "Maison Francis Baccarat Rouge 540",
    price: 4800000,
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1000&q=80",
    description:
      "Aromatic yang manis, woody, dan elegan. Wewangian ikonik yang timeless.",
  },
  {
    _id: "fallback-4",
    category: "Decant",
    name: "Bleu De Chanel Decant 10ml",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=80",
    description:
      "Kemasan praktis 10ml dari Bleu De Chanel. Cocok untuk dicoba sebelum membeli botol penuh.",
  },
  {
    _id: "fallback-5",
    category: "Men",
    name: "Versace Eros",
    price: 1550000,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1000&q=80",
    description:
      "Fresh, sweet, dan sensual. Aroma maskulin yang memikat di setiap suasana.",
  },
  {
    _id: "fallback-6",
    category: "Women",
    name: "Chanel Coco Mademoiselle",
    price: 2450000,
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&q=80",
    description:
      "Floral oriental yang elegan dan hangat. Simbol kemewahan dari Chanel.",
  },
  {
    _id: "fallback-7",
    category: "Unisex",
    name: "Le Labo Santal 33",
    price: 3950000,
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&q=80",
    description:
      "Woody santal yang hangat dan sedikit creamy. Wewangian modern favorit banyak orang.",
  },
  {
    _id: "fallback-8",
    category: "Decant",
    name: "Tom Ford Ombre Leather Decant 5ml",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=1000&q=80",
    description:
      "Kulit dan woody yang bold. Kemasan 5ml untuk merasakan kesan mewah Tom Ford.",
  },
];

interface ProductsResponse {
  products: Product[];
}

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
});

export default function JustIn() {
  const { data } = useFetch<ProductsResponse>("/products");

  const products: ShopProduct[] = useMemo(() => {
    const fetched = data?.products ?? [];

    return fetched.length > 0 ? fetched.map(mapProduct) : fallbackProducts;
  }, [data]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const [active, setActive] = useState("All");

  const [selected, setSelected] = useState<ShopProduct | null>(null);

  const filteredProducts = useMemo(() => {
    if (active === "All") return products;

    return products.filter((product) => product.category === active);
  }, [active, products]);

  return (
    <section id="just-in" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}

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

        {/* CATEGORY */}

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
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

        {/* PRODUCT */}

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelected(item)}
              className="group cursor-pointer text-left"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
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
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
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

      <OrderModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
