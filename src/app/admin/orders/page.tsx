"use client";

import { ShoppingCart } from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";

import { useFetch } from "@/lib/useFetch";
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

export default function OrdersPage() {
  const { data, loading } = useFetch<OrdersResponse>("/orders");

  const orders = data?.orders ?? [];

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
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
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

                      <td>
                        <p className="font-medium text-black">
                          {order.customerName}
                        </p>

                        {order.customerEmail && (
                          <p className="text-xs text-neutral-400">
                            {order.customerEmail}
                          </p>
                        )}
                      </td>

                      <td>
                        {order.items.map((item) => item.name).join(", ") ||
                          "—"}
                      </td>

                      <td>{order.payment || "—"}</td>

                      <td className="font-semibold text-black">
                        {formatRupiah(order.total)}
                      </td>

                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
