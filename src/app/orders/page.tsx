"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  RefreshCw,
  PackageSearch,
  X,
  Search,
} from "lucide-react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LoadingBlock from "@/components/admin/LoadingBlock";

import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/format";
import {
  clearLocalOrders,
  getLocalOrders,
  LocalOrder,
  removeLocalOrder,
} from "@/lib/orders";
import { notifyCartChanged } from "@/lib/dataEvents";
import { OrderStatus } from "@/lib/types";

interface LiveOrder extends LocalOrder {
  status?: string;
  missing?: boolean;
}

const statusBadge: Record<OrderStatus, string> = {
  Selesai: "bg-emerald-50 text-emerald-700",
  Diproses: "bg-blue-50 text-blue-700",
  Menunggu: "bg-amber-50 text-amber-700",
  Dibatalkan: "bg-red-50 text-red-700",
};

const formatDate = (value?: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.invoice.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    let cancelled = false;

    const local = getLocalOrders();

    Promise.allSettled(
      local.map((order) =>
        api.get<{ order: { status?: string } }>(`/orders/${order._id}`)
      )
    ).then((results) => {
      if (cancelled) return;

      const merged = local.map((order, index) => {
        const result = results[index];

        if (result.status === "fulfilled") {
          return { ...order, status: result.value.data?.order?.status };
        }

        return { ...order, missing: true };
      });

      setOrders(merged);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const refresh = () => {
    setLoading(true);

    setAttempt((prev) => prev + 1);
  };

  const handleRemove = (order: LiveOrder) => {
    removeLocalOrder(order._id);

    setOrders((prev) => prev.filter((item) => item._id !== order._id));

    notifyCartChanged();

    toast.success(`${order.invoice} dihapus dari perangkat ini`);
  };

  const handleClearAll = () => {
    clearLocalOrders();

    setOrders([]);

    notifyCartChanged();

    toast.success("Semua pesanan dihapus dari perangkat ini");
  };

  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />

      <div className="pt-20">
        <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
            >
              <ArrowLeft size={16} />

              Kembali ke Beranda
            </button>

            {orders.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />

                  Perbarui Status
                </button>

                <button
                  onClick={handleClearAll}
                  className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-4 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={14} />

                  Hapus Semua
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
              Ocil Fragrance
            </p>

            <h1 className="mt-3 text-4xl font-light lg:text-5xl">
              Pesanan Saya
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-neutral-500">
              Pesanan tersimpan di perangkat ini. Pantau status pesananmu di sini
              tanpa perlu membuat akun.
            </p>
          </div>

          {loading ? (
            <div className="mt-14">
              <LoadingBlock rows={3} />
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-14 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-400">
                <ShoppingCart size={28} />
              </div>

              <h3 className="mt-6 text-2xl font-light tracking-tight text-black">
                Belum ada pesanan di perangkat ini
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                Pesanan yang kamu buat akan tersimpan dan tampil di sini.
              </p>

              <button
                onClick={() => router.push("/")}
                className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="mt-12 space-y-5">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nomor invoice..."
                  className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />

                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 transition hover:text-neutral-700"
                  >
                    Reset
                  </button>
                )}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-neutral-200 px-6 py-14 text-center">
                  <PackageSearch
                    size={28}
                    className="mx-auto text-neutral-300"
                  />

                  <h3 className="mt-4 text-base font-medium text-black">
                    Tidak ada pesanan yang cocok
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    Tidak ditemukan invoice &quot;{query.trim()}&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-3xl border border-neutral-200 bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-black">
                        {order.invoice || "Pesanan"}
                      </p>

                      {order.status ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            statusBadge[order.status as OrderStatus] ??
                            "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      ) : order.missing ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                          Tidak ditemukan
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                          Menunggu
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-neutral-400">
                        {formatDate(order.createdAt)}
                      </p>

                      <button
                        onClick={() => handleRemove(order)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-black"
                        aria-label={`Hapus ${order.invoice}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8f8f8] text-neutral-400">
                            <PackageSearch size={15} />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-neutral-800">
                              {item.name}
                            </p>

                            <p className="text-xs text-neutral-400">
                              {item.qty} × {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-black">
                        {formatRupiah(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
