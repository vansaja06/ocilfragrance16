"use client";

import { TrendingUp, Package2, Star, PackageOpen } from "lucide-react";

import { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import EmptyState from "./EmptyState";
import LoadingBlock from "./LoadingBlock";

interface TopProductsProps {
  products: Product[];
  loading?: boolean;
}

export default function TopProducts({
  products,
  loading,
}: TopProductsProps) {
  if (loading) {
    return <LoadingBlock rows={4} />;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Favorit
            </p>

            <h2 className="mt-2 text-2xl font-light tracking-tight text-black">
              Produk Terlaris
            </h2>
          </div>
        </div>

        <EmptyState
          icon={<PackageOpen size={28} />}
          title="Belum ada produk terjual"
          description="Produk dengan penjualan terbaik akan muncul di sini."
        />
      </div>
    );
  }

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
        {products.map((product) => {
          const categoryName =
            typeof product.category === "string"
              ? "Produk"
              : product.category?.name || "Produk";

          return (
            <div
              key={product._id}
              className="flex items-center gap-4 border-b border-neutral-100 pb-5 last:border-none last:pb-0"
            >
              {/* Gambar */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f8f8] text-neutral-300">
                  <Package2 size={24} />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium text-black">
                  {product.name}
                </h3>

                <p className="text-sm text-neutral-500">
                  {categoryName}
                </p>

                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {product.rating || 0}
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
                  {formatRupiah(product.price)}
                </h4>

                <p className="mt-1 text-sm text-emerald-600">
                  {product.sold} Terjual
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
