"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageSearch, ShoppingBag } from "lucide-react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LoadingBlock from "@/components/admin/LoadingBlock";

import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import { Product } from "@/lib/types";

interface ProductsResponse {
  products: Product[];
}

interface SearchResultsProps {
  query: string;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-20 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-400">
        <PackageSearch size={28} />
      </div>

      <h3 className="mt-6 text-2xl font-light tracking-tight text-black">
        {title}
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
        {description}
      </p>
    </div>
  );
}

export default function SearchResults({ query }: SearchResultsProps) {
  const router = useRouter();

  const q = query.trim();

  const { data, loading } = useFetch<ProductsResponse>("/products");

  const results = useMemo(() => {
    const keyword = q.toLowerCase();

    if (!keyword) return [];

    return (data?.products ?? []).filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        (typeof product.category === "object" && product.category
          ? product.category.name?.toLowerCase().includes(keyword)
          : false)
    );
  }, [data, q]);

  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />

      <div className="pt-20">
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <button
            onClick={() => router.push("/")}
            className="mb-10 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={16} />

            Kembali ke Beranda
          </button>

          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
              Hasil Pencarian
            </p>

            <h1 className="mt-3 text-4xl font-light lg:text-5xl">
              {q ? `"${q}"` : "Cari Parfum"}
            </h1>

            {!loading && q && (
              <p className="mx-auto mt-5 max-w-xl text-neutral-500">
                {results.length} parfum ditemukan untuk &quot;{q}&quot;.
              </p>
            )}
          </div>

          {loading ? (
            <div className="mt-16">
              <LoadingBlock rows={3} />
            </div>
          ) : !q ? (
            <EmptyState
              title="Masukkan kata kunci pencarian"
              description={
                'Ketik nama parfum, misalnya "mykonos", untuk melihat semua produk yang cocok.'
              }
            />
          ) : results.length === 0 ? (
            <EmptyState
              title="Parfum tidak ditemukan"
              description={`Tidak ada produk yang cocok dengan "${q}". Coba kata kunci lain.`}
            />
          ) : (            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((item) => (
                <button
                  key={item._id}
                  onClick={() =>
                    router.push(`/product/${item.slug || item._id}`)
                  }
                  className="group cursor-pointer text-left"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
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
                      {typeof item.category === "object" && item.category
                        ? item.category.name
                        : item.category || "Lainnya"}
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
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
