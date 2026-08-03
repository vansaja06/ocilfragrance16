"use client";

import { Eye, ShoppingBag } from "lucide-react";

import { Order, OrderStatus } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import EmptyState from "./EmptyState";
import LoadingBlock from "./LoadingBlock";

const statusColor: Record<
  OrderStatus,
  { dot: string; text: string; badge: string }
> = {
  Selesai: {
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },

  Diproses: {
    dot: "bg-blue-500",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
  },

  Menunggu: {
    dot: "bg-amber-500",
    text: "text-amber-600",
    badge: "bg-amber-50 text-amber-700",
  },

  Dibatalkan: {
    dot: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-50 text-red-700",
  },
};

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
}

export default function RecentOrders({ orders, loading }: RecentOrdersProps) {
  if (loading) {
    return <LoadingBlock rows={4} />;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Ringkasan
            </p>

            <h2 className="mt-2 text-2xl font-light tracking-tight text-black">
              Pesanan Terbaru
            </h2>
          </div>
        </div>

        <EmptyState
          icon={<ShoppingBag size={28} />}
          title="Belum ada pesanan"
          description="Pesanan yang masuk akan muncul di sini."
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
            Ringkasan
          </p>

          <h2 className="mt-2 text-2xl font-light tracking-tight text-black">
            Pesanan Terbaru
          </h2>
        </div>

        <span className="rounded-full bg-[#f8f8f8] px-4 py-1.5 text-xs text-neutral-500">
          {orders.length} pesanan
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-[0.2em] text-neutral-400">
              <th className="pb-4 font-medium">Invoice</th>
              <th className="pb-4 font-medium">Pelanggan</th>
              <th className="pb-4 font-medium">Item</th>
              <th className="pb-4 font-medium">Pembayaran</th>
              <th className="pb-4 font-medium">Total</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 text-center font-medium">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-neutral-100 text-sm text-neutral-700 transition hover:bg-[#fafafa]"
              >
                <td className="py-5 font-semibold text-black">
                  {order.invoice}
                </td>

                <td>{order.customerName}</td>

                <td>
                  {order.items.length} item
                </td>

                <td>{order.payment || "—"}</td>

                <td className="font-semibold text-black">
                  {formatRupiah(order.total)}
                </td>

                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[order.status].badge}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <div className="flex justify-center">
                    <button className="rounded-full border border-neutral-200 bg-white p-2 transition hover:bg-black hover:text-white">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
        <p className="text-sm text-neutral-500">
          Menampilkan{" "}
          <b className="text-black">{orders.length}</b> pesanan terbaru.
        </p>
      </div>
    </div>
  );
}
