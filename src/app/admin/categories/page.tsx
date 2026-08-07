"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Plus, Trash2, Tags } from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { Category } from "@/lib/types";

interface CategoriesResponse {
  categories: Category[];
}

export default function CategoriesPage() {
  const { data, loading, refetch } = useFetch<CategoriesResponse>("/categories");

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const categories = data?.categories ?? [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Nama kategori wajib diisi");

      return;
    }

    try {
      setSubmitting(true);

      await api.post("/categories", { name, description });

      toast.success("Kategori berhasil ditambahkan");

      setName("");
      setDescription("");
      setOpen(false);

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambah kategori"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await api.delete(`/categories/${deleteId}`);

      toast.success("Kategori dihapus");

      setDeleteId(null);

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus kategori"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Kategori"
          subtitle={`${loading ? "…" : categories.length} kategori tersedia.`}
          action={
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={18} />

              Tambah Kategori
            </button>
          }
        />

        {loading ? (
          <LoadingBlock rows={3} />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={<Tags size={28} />}
            title="Belum ada kategori"
            description="Buat kategori seperti Men, Women, Unisex atau Decant agar produk lebih rapi."
            actionLabel="Tambah Kategori"
            onAction={() => setOpen(true)}
          />
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group flex items-center justify-between rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              >
                <div>
                  <h3 className="text-xl font-medium text-black">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-400">
                    /{category.slug}
                  </p>

                  {category.description && (
                    <p className="mt-3 text-sm text-neutral-500">
                      {category.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setDeleteId(category._id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Hapus kategori"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Dialog Tambah Kategori */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[28px] p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>

            <DialogDescription>
              Buat kategori baru untuk mengelompokkan produk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Kategori</label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Men"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>

              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                disabled={submitting}
                className="h-12 rounded-full bg-black px-6 text-white hover:bg-neutral-800"
              >
                {submitting ? "Menyimpan…" : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Kategori"
        description="Yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
