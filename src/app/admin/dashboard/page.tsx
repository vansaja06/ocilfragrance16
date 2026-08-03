"use client";

import { useEffect } from "react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import StatsCard from "@/components/admin/StatsCard";
import RecentOrders from "@/components/admin/RecentOrders";
import TopProducts from "@/components/admin/TopProducts";
import PageHeader from "@/components/admin/PageHeader";

import { Wallet, ShoppingCart, Package, Users } from "lucide-react";

import { useFetch } from "@/lib/useFetch";
import { onDataChanged } from "@/lib/dataEvents";
import { formatRupiah } from "@/lib/format";
import { Order, Product, Stats } from "@/lib/types";

interface DashboardResponse {
  stats: Stats;
  recentOrders: Order[];
  topProducts: Product[];
}

export default function DashboardPage() {
  const { data, loading, refetch } = useFetch<DashboardResponse>("/stats");

  const stats = data?.stats;

  useEffect(() => {
    const unsubscribe = onDataChanged(() => refetch({ silent: true }));

    const handleFocus = () => refetch({ silent: true });

    window.addEventListener("focus", handleFocus);

    return () => {
      unsubscribe();

      window.removeEventListener("focus", handleFocus);
    };
  }, [refetch]);

  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Dashboard Admin"
          subtitle="Ringkasan aktivitas toko Anda."
          action={
            <div className="rounded-full border border-neutral-200 bg-[#fafafa] px-6 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                Hari Ini
              </p>

              <p className="mt-1 text-sm font-medium text-black">
                {date}
              </p>
            </div>
          }
        />

        {/* Statistik */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Pendapatan"
            value={loading ? "Rp 0" : formatRupiah(stats?.revenue ?? 0)}
            description="Total seluruh pesanan"
            icon={<Wallet size={26} className="text-neutral-800" />}
            loading={loading}
          />

          <StatsCard
            title="Pesanan"
            value={loading ? "0" : String(stats?.totalOrders ?? 0)}
            description="Total pesanan masuk"
            icon={<ShoppingCart size={26} className="text-neutral-800" />}
            loading={loading}
          />

          <StatsCard
            title="Produk"
            value={loading ? "0" : String(stats?.totalProducts ?? 0)}
            description="Produk tersedia"
            icon={<Package size={26} className="text-neutral-800" />}
            loading={loading}
          />

          <StatsCard
            title="Pelanggan"
            value={loading ? "0" : String(stats?.totalCustomers ?? 0)}
            description="Total pelanggan"
            icon={<Users size={26} className="text-neutral-800" />}
            loading={loading}
          />
        </section>

        {/* Konten */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentOrders
              orders={data?.recentOrders ?? []}
              loading={loading}
            />
          </div>

          <TopProducts
            products={data?.topProducts ?? []}
            loading={loading}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
