"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { LayoutGrid, X } from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import LoadingBlock from "@/components/admin/LoadingBlock";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { Collection, Product } from "@/lib/types";

interface CollectionResponse {
  collection: Collection;
}

interface ProductsResponse {
  products: Product[];
}

const SLOTS = [
  {
    key: "leftProduct",
    label: "Kartu Kiri (Utama)",
    description: "Kartu besar di sisi kiri halaman koleksi.",
  },
  {
    key: "topRightProduct",
    label: "Kartu Kanan Atas",
    description: "Kartu bergambar di kanan atas.",
  },
  {
    key: "bottomLeftProduct",
    label: "Kartu Kiri Bawah",
    description: "Kartu decant di kiri bawah.",
  },
] as const;

type SlotKey = (typeof SLOTS)[number]["key"];

const emptyForm: Record<SlotKey, string> = {
  leftProduct: "",
  topRightProduct: "",
  bottomLeftProduct: "",
};

export default function CollectionPage() {
  const { data, loading, refetch } = useFetch<CollectionResponse>(
    "/collections"
  );
  const { data: productData } = useFetch<ProductsResponse>("/products");

  const products = productData?.products ?? [];

  const [form, setForm] = useState<Record<SlotKey, string>>(emptyForm);

  const [syncedData, setSyncedData] = useState<Collection | null>(null);

  const [saving, setSaving] = useState(false);

  if (data?.collection && data.collection !== syncedData) {
    setSyncedData(data.collection);

    setForm({
      leftProduct:
        typeof data.collection.leftProduct === "object" &&
        data.collection.leftProduct
          ? data.collection.leftProduct._id
          : "",
      topRightProduct:
        typeof data.collection.topRightProduct === "object" &&
        data.collection.topRightProduct
          ? data.collection.topRightProduct._id
          : "",
      bottomLeftProduct:
        typeof data.collection.bottomLeftProduct === "object" &&
        data.collection.bottomLeftProduct
          ? data.collection.bottomLeftProduct._id
          : "",
    });
  }

  const update = (key: SlotKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedProduct = (id: string) =>
    products.find((product) => product._id === id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put("/collections", {
        leftProduct: form.leftProduct || null,
        topRightProduct: form.topRightProduct || null,
        bottomLeftProduct: form.bottomLeftProduct || null,
      });

      toast.success("Koleksi berhasil disimpan");

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan koleksi"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Collection"
          subtitle="Pilih produk untuk ditampilkan pada section koleksi di halaman utama."
        />

        {loading ? (
          <LoadingBlock rows={4} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-6"
          >
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-700">
                  <LayoutGrid size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-light tracking-tight text-black">
                    Kartu Koleksi
                  </h2>

                  <p className="text-sm text-neutral-500">
                    Pilih produk untuk tiap posisi kartu koleksi.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {SLOTS.map((slot) => {
                  const selected = selectedProduct(form[slot.key]);

                  return (
                    <div
                      key={slot.key}
                      className="rounded-2xl border border-neutral-100 bg-[#f8f8f8] p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-black">{slot.label}</p>

                          <p className="mt-0.5 text-sm text-neutral-500">
                            {slot.description}
                          </p>
                        </div>

                        {form[slot.key] && (
                          <button
                            type="button"
                            onClick={() => update(slot.key, "")}
                            className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500 transition hover:text-red-500"
                          >
                            <X size={13} />

                            Kosongkan
                          </button>
                        )}
                      </div>

                      <div className="mt-4">
                        <Select
                          value={form[slot.key] || undefined}
                          onValueChange={(value) => update(slot.key, value)}
                        >
                          <SelectTrigger className="h-12 w-full rounded-2xl px-4">
                            <SelectValue placeholder="Pilih produk untuk kartu ini" />
                          </SelectTrigger>

                          <SelectContent>
                            {products.map((item) => (
                              <SelectItem key={item._id} value={item._id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selected && (
                        <div className="mt-4 flex items-center gap-3">
                          {selected.image ? (
                            <img
                              src={selected.image}
                              alt={selected.name}
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-200 text-neutral-400">
                              <LayoutGrid size={18} />
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-black">
                              {selected.name}
                            </p>

                            <p className="text-sm text-neutral-500">
                              {typeof selected.category === "object" &&
                              selected.category
                                ? selected.category.name
                                : "Tanpa kategori"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="h-12 rounded-full bg-black px-8 text-white hover:bg-neutral-800"
              >
                {saving ? "Menyimpan…" : "Simpan Koleksi"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
