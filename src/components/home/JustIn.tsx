"use client";

import { useMemo, useState } from "react";

const categories = ["All", "Men", "Women", "Unisex", "Decant"];

const products = [
  {
    id: 1,
    category: "Men",
    name: "Dior Sauvage Eau De Parfum",
    price: "Rp 1.950.000",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&q=80",
  },
  {
    id: 2,
    category: "Women",
    name: "YSL Libre",
    price: "Rp 2.150.000",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&q=80",
  },
  {
    id: 3,
    category: "Unisex",
    name: "Maison Francis Baccarat Rouge 540",
    price: "Rp 4.800.000",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1000&q=80",
  },
  {
    id: 4,
    category: "Decant",
    name: "Bleu De Chanel Decant 10ml",
    price: "Rp 95.000",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=80",
  },
  {
    id: 5,
    category: "Men",
    name: "Versace Eros",
    price: "Rp 1.550.000",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1000&q=80",
  },

  {
    id: 6,
    category: "Women",
    name: "Chanel Coco Mademoiselle",
    price: "Rp 2.450.000",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&q=80",
  },

  {
    id: 7,
    category: "Unisex",
    name: "Le Labo Santal 33",
    price: "Rp 3.950.000",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&q=80",
  },
  {
    id: 8,
    category: "Decant",
    name: "Tom Ford Ombre Leather Decant 5ml",
    price: "Rp 75.000",
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=1000&q=80",
  },
];

export default function JustIn() {
  const [active, setActive] = useState("All");

  const filteredProducts = useMemo(() => {
    if (active === "All") return products;

    return products.filter((product) => product.category === active);
  }, [active]);

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
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                  {item.category}
                </p>

                <h3 className="mt-2 text-lg font-medium leading-6">
                  {item.name}
                </h3>

                <p className="mt-2 text-lg font-semibold">{item.price}</p>
              </div>
            </div>
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
