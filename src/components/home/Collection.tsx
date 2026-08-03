"use client";

const collections = [
  {
    id: 1,
    title: "Discover Our Signature Fragrances",
    subtitle: "SIGNATURE COLLECTION",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
    button: "Shop Now",
  },
  {
    id: 2,
    title: "Luxury Perfumes From World Famous Brands",
    subtitle: "LUXURY COLLECTION",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&q=80",
    button: "Explore",
  },
  {
    id: 3,
    title: "Premium Decant Collection",
    subtitle: "DECANT",
    image: "https://pngimg.com/d/perfume_PNG10216.png",
    button: "Browse",
  },
];

export default function Collection() {
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
            <img
              src={collections[0].image}
              alt={collections[0].title}
              className="
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-110
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs tracking-[0.35em]">
                {collections[0].subtitle}
              </p>

              <h3 className="mt-3 text-3xl max-w-sm leading-tight">
                {collections[0].title}
              </h3>

              <button className="mt-8 rounded-full bg-white px-7 py-3 text-black transition hover:scale-105">
                {collections[0].button}
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div className="grid gap-6 lg:col-span-2 lg:grid-rows-[1.2fr_1fr]">
            {/* TOP */}

            <div className="relative rounded-3xl overflow-hidden group h-[350px] md:h-[450px]">
              <img
                src={collections[1].image}
                alt={collections[1].title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute left-8 top-8 text-white">
                <p className="text-xs tracking-[0.35em]">
                  {collections[1].subtitle}
                </p>

                <h3 className="mt-4 text-4xl max-w-lg leading-tight">
                  {collections[1].title}
                </h3>

                <button className="mt-8 rounded-full bg-white px-7 py-3 text-black transition hover:scale-105">
                  {collections[1].button}
                </button>
              </div>
            </div>

            {/* BOTTOM */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DECANT */}

              <div className="rounded-3xl bg-[#f8f8f8] p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs tracking-[0.35em] text-neutral-400">
                    {collections[2].subtitle}
                  </p>

                  <h3 className="mt-4 text-3xl leading-tight max-w-xs">
                    {collections[2].title}
                  </h3>

                  <p className="mt-5 text-neutral-500">
                    Experience luxury fragrances in 5ml, 10ml and 30ml sizes.
                  </p>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <button className="underline underline-offset-4">
                    {collections[2].button}
                  </button>

                  <img
                    src={collections[2].image}
                    alt={collections[2].title}
                    className="
                      w-32
                      md:w-40
                      object-contain
                      transition-all
                      duration-500
                      hover:scale-110
                    "
                  />
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

                <button className="rounded-full bg-white text-black px-8 py-3 transition hover:scale-105">
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
