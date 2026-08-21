"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Star, Package, Crown } from "lucide-react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LoadingBlock from "@/components/admin/LoadingBlock";
import OrderForm, { ShopProduct } from "@/components/home/OrderForm";

import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import { getSubscriberEmail } from "@/lib/subscription";
import { Product, Discount } from "@/lib/types";

interface ProductResponse {
  product: Product;
}

interface DiscountsResponse {
  discounts: Discount[];
}

interface SubscribedResponse {
  subscribed: boolean;
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

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    const email = getSubscriberEmail();

    if (!email) return;

    api
      .get<SubscribedResponse>(
        `/subscribers/status?email=${encodeURIComponent(email)}`
      )
      .then((res) => {
        if (res.data.subscribed) {
          setIsSubscribed(true);

          return api.get<DiscountsResponse>("/discounts/active");
        }
      })
      .then((res) => {
        if (res?.data?.discounts) {
          setDiscounts(res.data.discounts);
        }
      })
      .catch(() => {});
  }, []);

  const applicableDiscount = useMemo(() => {
    if (!product || !isSubscribed || discounts.length === 0) return null;

    const productDiscount = discounts.find(
      (d) =>
        d.productId &&
        typeof d.productId === "string" &&
        d.productId === product._id
    );

    if (productDiscount) return productDiscount;

    const globalDiscount = discounts.find(
      (d) => !d.productId || d.productId === null
    );

    return globalDiscount || null;
  }, [product, isSubscribed, discounts]);

  const discountedPrice = useMemo(() => {
    if (!product || !applicableDiscount) return null;

    return Math.round(product.price * (1 - applicableDiscount.percentage / 100));
  }, [product, applicableDiscount]);

  const shopProduct: ShopProduct | null = useMemo(() => {
    if (!product) return null;

    return {
      _id: product._id,
      name: product.name,
      category:
        typeof product.category === "object" && product.category
          ? product.category.name || "Lainnya"
          : product.category || "Lainnya",
      price: discountedPrice ?? product.price,
      image: product.image ?? "",
      description: product.description,
      slug: product.slug,
      hasDecant: product.hasDecant,
      decants: product.decants,
    };
  }, [product, discountedPrice]);

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

                <div className="mt-6 flex items-center gap-3">
                  {discountedPrice ? (
                    <>
                      <p className="text-3xl font-semibold text-black">
                        {formatRupiah(discountedPrice)}
                      </p>
                      <p className="text-lg text-neutral-400 line-through">
                        {formatRupiah(product.price)}
                      </p>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        -{applicableDiscount!.percentage}%
                      </span>
                    </>
                  ) : (
                    <p className="text-3xl font-semibold text-black">
                      {formatRupiah(product.price)}
                    </p>
                  )}
                </div>

                {isSubscribed && applicableDiscount && (
                  <div className="mt-3 flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
                    <Crown size={14} />
                    Harga subscriber: diskon {applicableDiscount.percentage}%
                  </div>
                )}

                {!isSubscribed && (
                  <div className="mt-3 flex items-center gap-2 rounded-full bg-neutral-50 px-4 py-2 text-xs text-neutral-500">
                    <Crown size={14} />
                    Subscribe untuk mendapatkan diskon eksklusif
                  </div>
                )}

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
