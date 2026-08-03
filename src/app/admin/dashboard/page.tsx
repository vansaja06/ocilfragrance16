"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import StatsCard from "@/components/admin/StatsCard";
import RecentOrders from "@/components/admin/RecentOrders";
import TopProducts from "@/components/admin/TopProducts";

import {
  Wallet,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Heading */}

        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
              Ocil Fragrance
            </p>

            <h1 className="mt-2 text-4xl font-light tracking-tight text-black lg:text-5xl">
              Dashboard Admin
            </h1>

            <p className="mt-3 text-neutral-500">
              Ringkasan aktivitas toko Anda hari ini.
            </p>

          </div>

          <div className="rounded-full border border-neutral-200 bg-[#fafafa] px-6 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Hari Ini
            </p>

            <p className="mt-1 text-sm font-medium text-black">
              Senin, 3 Agustus 2026
            </p>
          </div>

        </section>

        {/* Statistik */}

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <StatsCard
            title="Pendapatan"
            value="Rp 24.850.000"
            change={12}
            description="Dibanding bulan lalu"
            icon={
              <Wallet
                size={26}
                className="text-neutral-800"
              />
            }
          />

          <StatsCard
            title="Pesanan"
            value="156"
            change={8}
            description="Pesanan berhasil"
            icon={
              <ShoppingCart
                size={26}
                className="text-neutral-800"
              />
            }
          />

          <StatsCard
            title="Produk"
            value="84"
            change={3}
            description="Produk tersedia"
            icon={
              <Package
                size={26}
                className="text-neutral-800"
              />
            }
          />

          <StatsCard
            title="Pelanggan"
            value="432"
            change={18}
            description="Pelanggan baru"
            icon={
              <Users
                size={26}
                className="text-neutral-800"
              />
            }
          />

        </section>

        {/* Konten */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Pesanan */}

          <div className="xl:col-span-2">

            <RecentOrders />

          </div>

          {/* Produk */}

          <TopProducts />

        </section>

      </div>
    </DashboardLayout>
  );
}
