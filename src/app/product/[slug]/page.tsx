"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Star, Package } from "lucide-react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LoadingBlock from "@/components/admin/LoadingBlock";
import OrderForm, { ShopProduct } from "@/components/home/OrderForm";

import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import { Product } from "@/lib/types";

interface ProductResponse {
  product: Product;
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = useMemo(() => params?.slug ?? "", [params]);

  const { data, loading, error } = useFetch<ProductResponse>(
    slug ? `/products/slug/${slug}` : null
  );

  const product = data?.product;

  const detailDescription = product?.longDescription || product?.description;

  const [showOrder, setShowOrder] = useState(false);

  const shopProduct: ShopProduct | null = useMemo(() => {
    if (!product) return null;

    return {
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
    };
  }, [product]);

  return (
    <main className="relative w-full min-h-screen bg-white">
      <Navbar />

      <div className="relative z-0 pt-20">
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <button
            onClick={() => router.push("/")}
            className="mb-10 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={16} />

            Kembali ke Beranda
          </button>

          {loading ? (
            <LoadingBlock rows={4} />
          ) : error || !product ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-400">
                <Package size={28} />
              </div>

              <h3 className="mt-6 text-2xl font-light tracking-tight text-black">
                Produk tidak ditemukan
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                Produk yang Anda cari tidak tersedia atau telah dihapus.
              </p>

              <button
                onClick={() => router.push("/")}
                className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-300">
                    <Package size={48} />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                  {typeof product.category === "string"
                    ? "Produk"
                    : product.category?.name || "Produk"}
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-black md:text-5xl">
                  {product.name}
                </h1>

                <div className="mt-5 flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-amber-500">
                    <Star size={15} fill="currentColor" />
                    {product.rating || 0}
                  </span>

                  <span className="text-sm text-neutral-400">
                    {product.sold} Terjual
                  </span>

                  <span className="rounded-full bg-[#f8f8f8] px-3 py-1 text-xs text-neutral-500">
                    Stok {product.stock}
                  </span>
                </div>

                <p className="mt-6 text-3xl font-semibold text-black">
                  {formatRupiah(product.price)}
                </p>

                {detailDescription && (
                  <div className="mt-6 w-full rounded-2xl border border-neutral-200 bg-[#f8f8f8] p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
                      Deskripsi
                    </p>

                    <p className="mt-3 text-neutral-600 leading-7 whitespace-pre-line break-words">
                      {detailDescription}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowOrder((v) => !v)}
                  className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:scale-105 hover:bg-neutral-800"
                >
                  <ShoppingBag size={18} />

                  {showOrder ? "Tutup Formulir Pemesanan" : "Beli Sekarang"}
                </button>

                {showOrder && shopProduct && (
                  <div className="mt-8 rounded-3xl border border-neutral-200 bg-[#f8f8f8] p-6 lg:p-8">
                    <h2 className="text-lg font-semibold text-black">
                      Lengkapi Data Pemesanan
                    </h2>

                    <OrderForm product={shopProduct} />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
