"use client";

import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Plus,
  Trash2,
  Package,
  Package2,
  Star,
  Tags,
  Search,
  PackageSearch,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { formatRupiah } from "@/lib/format";
import { Category, Product } from "@/lib/types";

interface ProductsResponse {
  products: Product[];
}

interface CategoriesResponse {
  categories: Category[];
}

const DECANT_SIZES = ["5 ml", "10 ml", "15 ml"] as const;

const emptyDecantPrices: Record<(typeof DECANT_SIZES)[number], string> = {
  "5 ml": "",
  "10 ml": "",
  "15 ml": "",
};

export default function ProductsPage() {
  const { data, loading, refetch } = useFetch<ProductsResponse>("/products");
  const { data: categoryData, refetch: refetchCategories } =
    useFetch<CategoriesResponse>("/categories");

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [catOpen, setCatOpen] = useState(false);
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");

  const [hasDecant, setHasDecant] = useState(false);
  const [decantPrices, setDecantPrices] = useState<Record<string, string>>(
    emptyDecantPrices
  );

  const products = data?.products ?? [];
  const categories = categoryData?.categories ?? [];

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return products;

    return products.filter((product) => {
      const categoryName =
        typeof product.category === "string"
          ? ""
          : product.category?.name ?? "";

      return (
        product.name.toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q)
      );
    });
  }, [products, query]);

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();

    if (!catName) {
      toast.error("Nama kategori wajib diisi");

      return;
    }

    try {
      setCatSubmitting(true);

      const res = await api.post("/categories", {
        name: catName,
        description: catDescription,
      });

      toast.success("Kategori berhasil ditambahkan");

      setCatName("");
      setCatDescription("");
      setCatOpen(false);

      await refetchCategories();

      notifyDataChanged();

      const created = res.data?.category as Category | undefined;

      if (created?._id) {
        setCategory(created._id);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambah kategori"));
    } finally {
      setCatSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    setImage("");
    setDescription("");
    setLongDescription("");
    setHasDecant(false);
    setDecantPrices(emptyDecantPrices);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error("Nama dan harga wajib diisi");

      return;
    }

    const decants = hasDecant
      ? DECANT_SIZES.filter((size) => decantPrices[size]).map((size) => ({
          size,
          price: Number(decantPrices[size]) || 0,
        }))
      : [];

    try {
      setSubmitting(true);

      await api.post("/products", {
        name,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        category: category || null,
        image,
        description,
        longDescription,
        hasDecant,
        decants,
      });

      toast.success("Produk berhasil ditambahkan");

      resetForm();
      setOpen(false);

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambah produk"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await api.delete(`/products/${deleteId}`);

      toast.success("Produk dihapus");

      setDeleteId(null);

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus produk"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Produk"
          subtitle={`${loading ? "…" : products.length} produk tersedia.`}
          action={
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={18} />

              Tambah Produk
            </button>
          }
        />

        {loading ? (
          <LoadingBlock rows={4} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="Belum ada produk"
            description="Tambahkan produk pertama Anda agar mulai terlihat di sini dan di halaman toko."
            actionLabel="Tambah Produk"
            onAction={() => setOpen(true)}
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
                placeholder="Cari nama produk atau kategori..."
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

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white py-16 text-center">
                <PackageSearch
                  size={32}
                  className="mx-auto text-neutral-300"
                />

                <h3 className="mt-4 text-base font-medium text-black">
                  Tidak ada produk yang cocok
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  Coba kata kunci lain untuk &quot;{query.trim()}&quot;
                </p>
              </div>
            ) : (
              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
              const categoryName =
                typeof product.category === "string"
                  ? "Produk"
                  : product.category?.name || "Produk";

              return (
                <div
                  key={product._id}
                  className="group rounded-3xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-300">
                        <Package2 size={40} />
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                        {categoryName}
                      </p>

                      <span className="flex items-center gap-1 text-sm text-amber-500">
                        <Star size={13} fill="currentColor" />
                        {product.rating || 0}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-medium leading-6 text-black">
                      {product.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-semibold text-black">
                        {formatRupiah(product.price)}
                      </p>

                      <span className="rounded-full bg-[#f8f8f8] px-3 py-1 text-xs text-neutral-500">
                        Stok {product.stock}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                      <span className="text-sm text-emerald-600">
                        {product.sold} Terjual
                      </span>

                      <span className="text-xs text-neutral-400">
                        {product.featured ? "Unggulan" : "Reguler"}
                      </span>
                    </div>

                    <button
                      onClick={() => setDeleteId(product._id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 py-2.5 text-sm text-neutral-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      aria-label="Hapus produk"
                    >
                      <Trash2 size={16} />

                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
              </section>
            )}
          </>
        )}
      </div>

      {/* Dialog Tambah Produk */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Produk</DialogTitle>

            <DialogDescription>
              Isi informasi produk baru untuk toko Anda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Produk</label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dior Sauvage Eau De Parfum"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Harga (Rp)</label>

                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1950000"
                  className="h-12 rounded-2xl px-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stok</label>

                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="h-12 rounded-2xl px-4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>

              <div className="flex items-center gap-2">
                <Select
                  value={category || undefined}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="h-12 w-full flex-1 rounded-2xl px-4">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.length === 0 && (
                      <div className="px-3 py-2 text-sm text-neutral-500">
                        Belum ada kategori
                      </div>
                    )}

                    {categories.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {category && (
                  <button
                    type="button"
                    onClick={() => setCategory("")}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 text-neutral-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    aria-label="Kosongkan kategori"
                    title="Kosongkan kategori"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCatOpen(true)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
                  aria-label="Tambah kategori"
                  title="Tambah kategori"
                >
                  <Tags size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-[#f8f8f8] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-sm font-medium text-black">
                  Tambahkan Decant
                </span>

                <button
                  type="button"
                  onClick={() => setHasDecant((v) => !v)}
                  aria-pressed={hasDecant}
                  className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
                    hasDecant ? "bg-black" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                      hasDecant ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </label>

              <p className="mt-2 text-xs text-neutral-500">
                Tampilkan pilihan full parfum dan decant (beberapa ukuran) saat
                produk ini dibeli.
              </p>

              {hasDecant && (
                <div className="mt-4 space-y-3">
                  {DECANT_SIZES.map((size) => (
                    <div key={size} className="flex items-center gap-3">
                      <span className="w-14 text-sm font-medium text-neutral-700">
                        {size}
                      </span>

                      <Input
                        type="number"
                        value={decantPrices[size]}
                        onChange={(e) =>
                          setDecantPrices((prev) => ({
                            ...prev,
                            [size]: e.target.value,
                          }))
                        }
                        placeholder={`Harga ${size}`}
                        className="h-11 rounded-2xl px-4"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gambar</label>

              <ImageUpload value={image} onChange={setImage} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi Singkat</label>

              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ditampilkan di halaman utama (koleksi)"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi Lengkap</label>

              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Deskripsi lengkap yang ditampilkan saat produk diklik"
                rows={5}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400"
              />
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  Batal
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={submitting}
                className="h-12 rounded-full bg-black px-6 text-white hover:bg-neutral-800"
              >
                {submitting ? "Menyimpan…" : "Simpan Produk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Kategori */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent className="rounded-[28px] p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>

            <DialogDescription>
              Kategori akan langsung tersedia untuk produk ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Kategori</label>

              <Input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Men"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>

              <Input
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="Koleksi parfum pria"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  Batal
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={catSubmitting}
                className="h-12 rounded-full bg-black px-6 text-white hover:bg-neutral-800"
              >
                {catSubmitting ? "Menyimpan…" : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Produk"
        description="Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
