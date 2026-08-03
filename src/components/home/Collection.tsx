"use client";

const collections = [
  {
    id: 1,
    title: "Where Dreams Meet Couture",
    subtitle: "ETHEREAL ELEGANCE",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80",
    button: "Shop Now",
  },
  {
    id: 2,
    title: "Enchanting Styles for Every Woman",
    subtitle: "RADIANT REVERIES",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80",
    button: "Shop Now",
  },
  {
    id: 3,
    title: "Chic Footwear for City Living",
    subtitle: "URBAN STRIDES",
    image:
      "https://freepngimg.com/thumb/shoes/28530-3-nike-shoes-transparent.png",
    button: "Shop Now",
  },
];

export default function Collection() {
  return (
    <section
      id="collection"
      className="bg-white py-16 md:py-20 lg:py-24 mb-20 md:mb-32"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-center mb-12 md:mb-20">
          Collection
        </h2>

        {/* Layout */}
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
              transition-all
              duration-500
              hover:-translate-y-2
            "
          >
            <img
              src={collections[0].image}
              alt={collections[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
              <p className="text-xs tracking-[4px]">
                {collections[0].subtitle}
              </p>

              <h3 className="text-2xl md:text-3xl mt-3 leading-tight max-w-sm">
                {collections[0].title}
              </h3>

              <button className="mt-8 bg-white text-black rounded-full px-6 py-3 font-medium hover:scale-105 transition">
                Shop Now
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
            grid
            gap-6
            lg:col-span-2
            lg:grid-rows-[1.2fr_1fr]
          "
          >
            {/* TOP */}
            <div className="relative rounded-3xl overflow-hidden group h-[350px] md:h-[450px]">
              <img
                src={collections[1].image}
                alt={collections[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute left-6 top-6 md:left-10 md:top-10 text-white">
                <p className="text-xs tracking-[4px]">
                  {collections[1].subtitle}
                </p>

                <h3 className="text-2xl md:text-4xl mt-3 max-w-md leading-tight">
                  {collections[1].title}
                </h3>

                <button className="mt-8 bg-white text-black rounded-full px-6 py-3 font-medium hover:scale-105 transition">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shoes */}
              <div className="rounded-3xl bg-[#f7f7f7] p-6 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-xs tracking-[4px] text-gray-400">
                    {collections[2].subtitle}
                  </p>

                  <h3 className="text-2xl md:text-3xl mt-4 max-w-xs leading-tight">
                    {collections[2].title}
                  </h3>
                </div>

                <div className="flex justify-between items-end mt-10">
                  <button className="underline underline-offset-4">
                    Shop Now
                  </button>

                  <img
                    src={collections[2].image}
                    alt={collections[2].title}
                    className="
                      w-28
                      sm:w-32
                      md:w-40
                      object-contain
                      transition-all
                      duration-500
                      hover:scale-110
                      hover:-rotate-6
                    "
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="rounded-3xl bg-[#f5f5f5] flex flex-col justify-center items-center py-14">
                <p className="text-gray-400 text-center">
                  Trending Bags for Her
                </p>

                <h1 className="text-5xl md:text-7xl font-bold my-3">50%</h1>

                <button className="bg-black text-white rounded-full px-8 py-3 hover:scale-105 transition">
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
