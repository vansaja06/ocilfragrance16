"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Check,
  X,
  ExternalLink,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Search,
  PackageSearch,
} from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { formatRupiah } from "@/lib/format";
import { Order, OrderStatus } from "@/lib/types";

interface OrdersResponse {
  orders: Order[];
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
  const { data, loading, refetch } = useFetch<OrdersResponse>("/orders");

  const orders = data?.orders ?? [];

  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return orders;

    return orders.filter((order) =>
      order.invoice.toLowerCase().includes(q)
    );
  }, [orders, query]);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setUpdating(order._id);

    try {
      await api.patch(`/orders/${order._id}/status`, { status });

      toast.success(
        status === "Dibatalkan"
          ? "Pesanan ditolak/dibatalkan"
          : status === "Selesai"
            ? "Pesanan ditandai selesai"
            : "Pesanan diterima"
      );

      setRejectId(null);

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui pesanan"));
    } finally {
      setUpdating(null);
    }
  };

  const rejectTarget = orders.find((order) => order._id === rejectId) ?? null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Pesanan"
          subtitle={`${loading ? "…" : orders.length} total pesanan.`}
        />

        {loading ? (
          <LoadingBlock rows={5} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={28} />}
            title="Belum ada pesanan"
            description="Semua pesanan dari pelanggan akan tampil di sini."
          />
        ) : (
          <>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nomor invoice, contoh: INV-20260811..."
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
              <div className="rounded-3xl border border-neutral-200 bg-white py-16 text-center">
                <PackageSearch
                  size={32}
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
              <section className="space-y-5">
                {filteredOrders.map((order) => {
              const busy = updating === order._id;

              return (
                <div
                  key={order._id}
                  className="rounded-3xl border border-neutral-200 bg-white"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-black">
                        {order.invoice}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3">
                    {/* Customer */}
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                        Pelanggan
                      </p>

                      <p className="font-semibold text-black">
                        {order.customerName}
                      </p>

                      {order.phone && (
                        <p className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone size={14} className="text-neutral-400" />

                          {order.phone}
                        </p>
                      )}

                      {order.customerEmail && (
                        <p className="text-sm text-neutral-600">
                          {order.customerEmail}
                        </p>
                      )}

                      {order.address && (
                        <p className="flex items-start gap-2 text-sm leading-6 text-neutral-600">
                          <MapPin
                            size={14}
                            className="mt-1 shrink-0 text-neutral-400"
                          />

                          {order.address}
                        </p>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                        Item
                      </p>

                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-neutral-800">
                              {item.name}
                            </p>

                            <p className="text-xs text-neutral-400">
                              {item.qty} × {formatRupiah(item.price)}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-neutral-800">
                            {formatRupiah(item.qty * item.price)}
                          </p>
                        </div>
                      ))}

                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                        <p className="text-sm font-semibold text-black">
                          Total
                        </p>

                        <p className="text-base font-bold text-black">
                          {formatRupiah(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Payment + Proof */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                          Pembayaran &amp; Pengiriman
                        </p>

                        <p className="flex items-center gap-2 text-sm text-neutral-700">
                          <CreditCard size={14} className="text-neutral-400" />

                          {order.payment === "transfer"
                            ? "Transfer Bank"
                            : order.payment === "qris"
                              ? "QRIS"
                              : order.payment || "—"}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-neutral-700">
                          <Truck size={14} className="text-neutral-400" />

                          {order.shipping === "cod"
                            ? "COD"
                            : order.shipping === "antar"
                              ? "Antar di Tempat"
                              : order.shipping || "—"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                          Bukti Pembayaran
                        </p>

                        {order.paymentProof ? (
                          <a
                            href={order.paymentProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-neutral-200"
                          >
                            <img
                              src={order.paymentProof}
                              alt="Bukti pembayaran"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition group-hover:text-black">
                              <ExternalLink size={14} />
                            </span>
                          </a>
                        ) : (
                          <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-neutral-200 text-xs text-neutral-400">
                            Tidak ada bukti pembayaran
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
                    {order.status === "Menunggu" && (
                      <>
                        <button
                          onClick={() => setRejectId(order._id)}
                          disabled={busy}
                          className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <X size={14} />

                          Tolak
                        </button>

                        <button
                          onClick={() => updateStatus(order, "Diproses")}
                          disabled={busy}
                          className="flex h-10 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                        >
                          <Check size={14} />

                          Terima Pesanan
                        </button>
                      </>
                    )}

                    {order.status === "Diproses" && (
                      <button
                        onClick={() => updateStatus(order, "Selesai")}
                        disabled={busy}
                        className="flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Check size={14} />

                        Tandai Selesai
                      </button>
                    )}

                    {order.status === "Dibatalkan" && (
                      <button
                        onClick={() => updateStatus(order, "Menunggu")}
                        disabled={busy}
                        className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
                      >
                        Ubah ke Menunggu
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
              </section>
            )}
          </>
        )}
      </div>

      {/* Dialog Konfirmasi Tolak */}
      <ConfirmDialog
        open={rejectId !== null}
        onOpenChange={(open) => !open && setRejectId(null)}
        title="Tolak Pesanan"
        description={
          rejectTarget
            ? `Yakin ingin menolak pesanan ${rejectTarget.invoice}?`
            : "Yakin ingin menolak pesanan ini?"
        }
        confirmLabel="Tolak Pesanan"
        loading={updating === rejectId}
        onConfirm={() => {
          if (rejectTarget) updateStatus(rejectTarget, "Dibatalkan");
        }}
      />
    </DashboardLayout>
  );
}
