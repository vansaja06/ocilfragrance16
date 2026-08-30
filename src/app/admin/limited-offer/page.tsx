"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Zap, X } from "lucide-react";

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
import { Input } from "@/components/ui/input";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { LimitedOffer, Product } from "@/lib/types";

interface LimitedOfferResponse {
  limitedOffer: LimitedOffer;
}

interface ProductsResponse {
  products: Product[];
}

export default function LimitedOfferPage() {
  const { data, loading, refetch } =
    useFetch<LimitedOfferResponse>("/limited-offers");

  const { data: productData } = useFetch<ProductsResponse>("/products");

  const products = productData?.products ?? [];

  const [product, setProduct] = useState("");
  const [label, setLabel] = useState("Limited Offer");
  const [discountText, setDiscountText] = useState("30%");
  const [description, setDescription] = useState(
    "Discount For Selected Perfumes"
  );
  const [buttonText, setButtonText] = useState("Shop Now");
  const [active, setActive] = useState(true);

  const [syncedData, setSyncedData] = useState<LimitedOffer | null>(null);
  const [saving, setSaving] = useState(false);

  if (
    data?.limitedOffer &&
    data.limitedOffer._id !== syncedData?._id
  ) {
    const offer = data.limitedOffer;

    setSyncedData(offer);

    setProduct(
      typeof offer.product === "object" && offer.product
        ? offer.product._id
        : ""
    );
    setLabel(offer.label || "Limited Offer");
    setDiscountText(offer.discountText || "30%");
    setDescription(offer.description || "Discount For Selected Perfumes");
    setButtonText(offer.buttonText || "Shop Now");
    setActive(offer.active !== false);
  }

  const selectedProduct = products.find((item) => item._id === product);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put("/limited-offers", {
        product: product || null,
        label,
        discountText,
        description,
        buttonText,
        active,
      });

      toast.success("Limited offer berhasil disimpan");

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan limited offer"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Limited Offer"
          subtitle="Atur promo limited offer yang hanya tampil untuk subscriber."
        />

        {loading ? (
          <LoadingBlock rows={4} />
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-700">
                  <Zap size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-light tracking-tight text-black">
                    Konten Promo
                  </h2>

                  <p className="text-sm text-neutral-500">
                    Pilih produk yang ingin ditampilkan pada kartu limited
                    offer di halaman utama.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* PRODUK */}

                <div className="rounded-2xl border border-neutral-100 bg-[#f8f8f8] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-black">Produk</p>

                      <p className="mt-0.5 text-sm text-neutral-500">
                        Tombol &ldquo;{buttonText || "Shop Now"}&rdquo;
                        mengarah ke halaman produk ini.
                      </p>
                    </div>

                    {product && (
                      <button
                        type="button"
                        onClick={() => setProduct("")}
                        className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500 transition hover:text-red-500"
                      >
                        <X size={13} />

                        Kosongkan
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <Select
                      value={product || undefined}
                      onValueChange={setProduct}
                    >
                      <SelectTrigger className="h-12 w-full rounded-2xl px-4">
                        <SelectValue placeholder="Pilih produk untuk limited offer" />
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

                  {selectedProduct && (
                    <div className="mt-4 flex items-center gap-3">
                      {selectedProduct.image ? (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-200 text-neutral-400">
                          <Zap size={18} />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-black">
                          {selectedProduct.name}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {typeof selectedProduct.category === "object" &&
                          selectedProduct.category
                            ? selectedProduct.category.name
                            : "Tanpa kategori"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* LABEL & DISKON */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Label</label>

                    <Input
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Limited Offer"
                      className="h-12 rounded-2xl px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Teks Diskon
                    </label>

                    <Input
                      value={discountText}
                      onChange={(e) => setDiscountText(e.target.value)}
                      placeholder="30%"
                      className="h-12 rounded-2xl px-4"
                    />
                  </div>
                </div>

                {/* DESKRIPSI & TOMBOL */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deskripsi</label>

                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Discount For Selected Perfumes"
                      className="h-12 rounded-2xl px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Teks Tombol
                    </label>

                    <Input
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Shop Now"
                      className="h-12 rounded-2xl px-4"
                    />
                  </div>
                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-[#f8f8f8] p-5">
                  <div>
                    <p className="font-medium text-black">Status</p>

                    <p className="mt-0.5 text-sm text-neutral-500">
                      {active
                        ? "Promo tampil di halaman utama untuk subscriber aktif."
                        : "Promo disembunyikan dari semua pengunjung."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActive(!active)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      active ? "bg-emerald-500" : "bg-neutral-300"
                    }`}
                    aria-label="Ubah status limited offer"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                        active ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {!products.length && (
                  <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    Belum ada produk. Tambahkan produk terlebih dahulu di
                    menu Produk.
                  </p>
                )}
              </div>
            </section>

            {/* PREVIEW */}

            <section className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
              <h2 className="mb-4 text-lg font-light tracking-tight text-black">
                Preview
              </h2>

              <div className="mx-auto max-w-md rounded-3xl bg-gradient-to-br from-black to-neutral-800 py-14 text-center text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-300">
                  {label || "Limited Offer"}
                </p>

                <h3 className="my-4 text-6xl font-bold">
                  {discountText || "30%"}
                </h3>

                <p className="mb-8 text-neutral-300">
                  {description || "Discount For Selected Perfumes"}
                </p>

                <span className="inline-block rounded-full bg-white px-8 py-3 text-black">
                  {buttonText || "Shop Now"}
                </span>
              </div>

              <p className="mt-4 text-center text-xs text-neutral-400">
                Kartu ini hanya terlihat oleh subscriber dengan status
                Disetujui.
              </p>
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="h-12 rounded-full bg-black px-8 text-white hover:bg-neutral-800"
              >
                {saving ? "Menyimpan…" : "Simpan Limited Offer"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
