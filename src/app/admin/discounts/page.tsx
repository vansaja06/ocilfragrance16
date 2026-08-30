"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  Percent,
  Plus,
  Trash2,
  Package,
  ToggleLeft,
  ToggleRight,
  Search,
  PackageSearch,
  X,
} from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { Discount, Product } from "@/lib/types";

interface DiscountsResponse {
  discounts: Discount[];
}

interface ProductsResponse {
  products: Product[];
}

const formatDate = (value?: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function DiscountsPage() {
  const { data, loading, refetch } = useFetch<DiscountsResponse>("/discounts");
  const { data: productData } = useFetch<ProductsResponse>("/products");

  const discounts = data?.discounts ?? [];
  const products = productData?.products ?? [];

  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [productId, setProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = discounts.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return d.name.toLowerCase().includes(q);
  });

  const getProductName = (productId?: string | Product | null) => {
    if (!productId) return "Semua Produk";
    if (typeof productId === "object" && productId?.name) return productId.name;

    const found = products.find((p) => p._id === productId);

    return found?.name || "Produk tidak ditemukan";
  };

  const selectedProduct = productId
    ? products.find((p) => p._id === productId)
    : undefined;

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !percentage) {
      toast.error("Nama dan persentase wajib diisi");
      return;
    }

    const pct = Number(percentage);

    if (pct < 1 || pct > 100) {
      toast.error("Persentase harus antara 1-100");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/discounts", {
        name: name.trim(),
        percentage: pct,
        productId: productId || null,
      });

      toast.success("Diskon berhasil ditambahkan");
      setName("");
      setPercentage("");
      setProductId("");
      setShowAdd(false);
      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan diskon"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (discount: Discount) => {
    try {
      await api.put(`/discounts/${discount._id}`, {
        active: !discount.active,
      });

      toast.success(discount.active ? "Diskon dinonaktifkan" : "Diskon diaktifkan");
      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengubah diskon"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    try {
      await api.delete(`/discounts/${deleteId}`);
      toast.success("Diskon berhasil dihapus");
      setDeleteId(null);
      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus diskon"));
    } finally {
      setDeleting(false);
    }
  };

  const deleteTarget = discounts.find((d) => d._id === deleteId);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Diskon"
          subtitle={`${loading ? "…" : discounts.length} total diskon.`}
          action={
            <button
              onClick={() => setShowAdd((v) => !v)}
              className="flex h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={18} />
              {showAdd ? "Tutup" : "Tambah Diskon"}
            </button>
          }
        />

        {showAdd && (
          <form
            onSubmit={handleAdd}
            className="rounded-3xl border border-neutral-200 bg-white p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-black">
              Tambah Diskon Baru
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Nama Diskon
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="contoh: Diskon Member"
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Persentase (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="10"
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Produk (opsional)
                  </label>

                  {productId && (
                    <button
                      type="button"
                      onClick={() => setProductId("")}
                      className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500 transition hover:text-red-500"
                    >
                      <X size={13} />
                      Kosongkan
                    </button>
                  )}
                </div>

                <Select
                  value={productId || undefined}
                  onValueChange={setProductId}
                >
                  <SelectTrigger className="h-12 w-full rounded-2xl px-4">
                    <SelectValue placeholder="Semua Produk" />
                  </SelectTrigger>

                  <SelectContent>
                    {products.length === 0 && (
                      <div className="px-3 py-2 text-sm text-neutral-500">
                        Belum ada produk
                      </div>
                    )}

                    {products.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProduct && (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-neutral-100 bg-[#f8f8f8] p-3">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 text-neutral-400">
                        <Package size={18} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-black">
                        {selectedProduct.name}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {typeof selectedProduct.category === "object" &&
                        selectedProduct.category
                          ? selectedProduct.category.name
                          : "Tanpa kategori"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
                >
                  <Plus size={16} />
                  {submitting ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <LoadingBlock rows={5} />
        ) : discounts.length === 0 ? (
          <EmptyState
            icon={<Percent size={28} />}
            title="Belum ada diskon"
            description="Tambahkan diskon untuk subscriber."
            actionLabel="Tambah Diskon"
            onAction={() => setShowAdd(true)}
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
                placeholder="Cari nama diskon..."
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

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white py-16 text-center">
                <PackageSearch size={32} className="mx-auto text-neutral-300" />
                <h3 className="mt-4 text-base font-medium text-black">
                  Tidak ada diskon yang cocok
                </h3>
              </div>
            ) : (
              <section className="space-y-4">
                {filtered.map((discount) => (
                  <div
                    key={discount._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-neutral-200 bg-white px-6 py-5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f8f8] text-black">
                        <Percent size={22} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-black">
                            {discount.name}
                          </h3>

                          <span className="rounded-full bg-black px-3 py-0.5 text-xs font-semibold text-white">
                            {discount.percentage}%
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                          <Package size={14} className="text-neutral-400" />
                          {getProductName(discount.productId)}
                        </div>

                        <p className="mt-0.5 text-xs text-neutral-400">
                          Dibuat: {formatDate(discount.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(discount)}
                        className="flex items-center gap-1 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
                      >
                        {discount.active ? (
                          <>
                            <ToggleRight size={18} className="text-emerald-500" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={18} className="text-neutral-300" />
                            Nonaktif
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteId(discount._id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Diskon"
        description={
          deleteTarget
            ? `Yakin ingin menghapus diskon "${deleteTarget.name}"?`
            : "Yakin ingin menghapus diskon ini?"
        }
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
