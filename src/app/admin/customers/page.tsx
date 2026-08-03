"use client";

import { Users } from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";

import { useFetch } from "@/lib/useFetch";
import { Customer } from "@/lib/types";

interface CustomersResponse {
  customers: Customer[];
}

export default function CustomersPage() {
  const { data, loading } = useFetch<CustomersResponse>("/customers");

  const customers = data?.customers ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Pelanggan"
          subtitle={`${loading ? "…" : customers.length} total pelanggan.`}
        />

        {loading ? (
          <LoadingBlock rows={5} />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={<Users size={28} />}
            title="Belum ada pelanggan"
            description="Data pelanggan akan muncul setelah ada pembelian."
          />
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f8f8] text-black">
                    <Users size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-black">
                      {customer.name}
                    </h3>

                    <p className="text-sm text-neutral-400">
                      {customer.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-sm text-neutral-500">
                  <p>
                    <span className="text-neutral-400">Telepon:</span>{" "}
                    {customer.phone || "—"}
                  </p>

                  <p>
                    <span className="text-neutral-400">Kota:</span>{" "}
                    {customer.city || "—"}
                  </p>

                  <p>
                    <span className="text-neutral-400">Alamat:</span>{" "}
                    {customer.address || "—"}
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
