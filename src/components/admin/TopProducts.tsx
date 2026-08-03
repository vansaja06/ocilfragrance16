"use client";

import { TrendingUp, Package2, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  sold: number;
  stock: number;
  price: string;
  rating: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Bleu de Chanel",
    category: "Parfum Pria",
    sold: 128,
    stock: 18,
    price: "Rp 2.350.000",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300&q=80",
  },
  {
    id: 2,
    name: "Dior Sauvage",
    category: "Parfum Pria",
    sold: 116,
    stock: 24,
    price: "Rp 2.150.000",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80",
  },
  {
    id: 3,
    name: "YSL Y EDP",
    category: "Parfum Pria",
    sold: 94,
    stock: 15,
    price: "Rp 2.450.000",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=300&q=80",
  },
  {
    id: 4,
    name: "Versace Eros",
    category: "Parfum Pria",
    sold: 88,
    stock: 12,
    price: "Rp 1.850.000",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59b75?w=300&q=80",
  },
];

export default function TopProducts() {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            Favorit
          </p>

          <h2 className="mt-2 text-2xl font-light tracking-tight text-black">
            Produk Terlaris
          </h2>
        </div>

        <TrendingUp size={22} className="text-black" />
      </div>

      {/* List Produk */}

      <div className="space-y-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border-b border-neutral-100 pb-5 last:border-none last:pb-0"
          >
            {/* Gambar */}

            <img
              src={product.image}
              alt={product.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />

            {/* Info */}

            <div className="flex-1">
              <h3 className="font-medium text-black">
                {product.name}
              </h3>

              <p className="text-sm text-neutral-500">
                {product.category}
              </p>

              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  {product.rating}
                </span>

                <span className="flex items-center gap-1 text-neutral-500">
                  <Package2 size={14} />
                  Stok {product.stock}
                </span>
              </div>
            </div>

            {/* Penjualan */}

            <div className="text-right">
              <h4 className="font-semibold text-black">
                {product.price}
              </h4>

              <p className="mt-1 text-sm text-emerald-600">
                {product.sold} Terjual
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="mt-6 border-t border-neutral-200 pt-6">
        <button className="w-full rounded-full bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
          Lihat Semua Produk
        </button>
      </div>
    </div>
  );
}
