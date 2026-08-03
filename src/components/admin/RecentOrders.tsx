"use client";

import { Eye } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  product: string;
  total: string;
  payment: string;
  status: "Selesai" | "Diproses" | "Menunggu";
}

const orders: Order[] = [
  {
    id: "INV-240801",
    customer: "Rahman",
    product: "Bleu de Chanel",
    total: "Rp 2.350.000",
    payment: "Transfer",
    status: "Selesai",
  },
  {
    id: "INV-240802",
    customer: "Budi",
    product: "Dior Sauvage",
    total: "Rp 2.150.000",
    payment: "QRIS",
    status: "Diproses",
  },
  {
    id: "INV-240803",
    customer: "Sinta",
    product: "YSL Y EDP",
    total: "Rp 2.450.000",
    payment: "Transfer",
    status: "Menunggu",
  },
  {
    id: "INV-240804",
    customer: "Andi",
    product: "Versace Eros",
    total: "Rp 1.850.000",
    payment: "COD",
    status: "Selesai",
  },
  {
    id: "INV-240805",
    customer: "Rina",
    product: "Baccarat Rouge 540",
    total: "Rp 4.250.000",
    payment: "QRIS",
    status: "Diproses",
  },
];

function statusColor(status: Order["status"]) {
  switch (status) {
    case "Selesai":
      return { dot: "bg-emerald-500", text: "text-emerald-600" };

    case "Diproses":
      return { dot: "bg-blue-500", text: "text-blue-600" };

    case "Menunggu":
      return { dot: "bg-amber-500", text: "text-amber-600" };

    default:
      return { dot: "bg-neutral-400", text: "text-neutral-600" };
  }
}

export default function RecentOrders() {
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

        <button className="text-sm font-medium text-black underline underline-offset-4 transition hover:text-neutral-500">
          Lihat Semua
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-[0.2em] text-neutral-400">
              <th className="pb-4 font-medium">Invoice</th>
              <th className="pb-4 font-medium">Pelanggan</th>
              <th className="pb-4 font-medium">Produk</th>
              <th className="pb-4 font-medium">Pembayaran</th>
              <th className="pb-4 font-medium">Total</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 text-center font-medium">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-neutral-100 text-sm text-neutral-700 transition hover:bg-[#fafafa]"
              >
                <td className="py-5 font-semibold text-black">
                  {order.id}
                </td>

                <td>{order.customer}</td>

                <td>{order.product}</td>

                <td>{order.payment}</td>

                <td className="font-semibold text-black">
                  {order.total}
                </td>

                <td>
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${statusColor(order.status).dot}`}
                    />

                    <span className={statusColor(order.status).text}>
                      {order.status}
                    </span>
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
          Menampilkan <b className="text-black">5</b> pesanan terbaru.
        </p>

        <button className="text-sm font-medium text-black underline underline-offset-4 hover:text-neutral-500">
          Lihat Riwayat →
        </button>
      </div>
    </div>
  );
}
