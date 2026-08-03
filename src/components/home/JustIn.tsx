"use client";

import { useState } from "react";

const categories = ["Women", "Men", "Shoes", "Bags", "Accessories"];

const products = [
  {
    id: 1,
    category: "Women",
    name: "Oversized Hoodie",
    price: "$69.99",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  },
  {
    id: 2,
    category: "Men",
    name: "Classic Bomber Jacket",
    price: "$120.00",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
  },
  {
    id: 3,
    category: "Shoes",
    name: "Minimal Sneakers",
    price: "$95.00",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
  {
    id: 4,
    category: "Accessories",
    name: "Leather Shoulder Bag",
    price: "$85.00",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  },
];

export default function JustIn() {
  const [active, setActive] = useState("Women");

  return (
    <section
      id="just-in"
      className="bg-white py-16 md:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Title */}

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center">
          Just In
        </h2>

        {/* Categories */}

        <div
          className="
            flex
            flex-wrap
            justify-center
            gap-4
            sm:gap-6
            lg:gap-8
            mt-8
            lg:mt-10
            text-xs
            sm:text-sm
            uppercase
            tracking-widest
          "
        >
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`
                relative
                pb-2
                uppercase
                tracking-widest
                transition-colors
                duration-300

                ${
                  active === item
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                }

                after:absolute
                after:left-0
                after:bottom-0
                after:h-[2px]
                after:bg-black
                after:transition-all
                after:duration-300

                ${
                  active === item
                    ? "after:w-full"
                    : "after:w-0 hover:after:w-full"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Products */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            lg:gap-10
            mt-12
            lg:mt-16
          "
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="
                group
                cursor-pointer
                transition-all
                duration-300
                hover:-translate-y-2
              "
            >
              {/* Image */}

              <div
                className="
                  bg-[#f8f8f8]
                  rounded-xl
                  overflow-hidden
                  aspect-[3/4]
                  shadow-sm
                "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Content */}

              <div className="mt-5">
                <p className="uppercase text-xs text-gray-400 tracking-widest">
                  {item.category}
                </p>

                <h3 className="mt-2 text-base sm:text-lg font-medium">
                  {item.name}
                </h3>

                <p className="mt-2 text-base font-semibold">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}