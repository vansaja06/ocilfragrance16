"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Plus, Trash2, Image as ImageIcon, Power } from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";
import ImageUpload from "@/components/admin/ImageUpload";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { Banner } from "@/lib/types";

interface BannersResponse {
  banners: Banner[];
}

export default function BannerPage() {
  const { data, loading, refetch } = useFetch<BannersResponse>("/banners");

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [button, setButton] = useState("");
  const [image, setImage] = useState("");

  const banners = data?.banners ?? [];

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setButton("");
    setImage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("Judul banner wajib diisi");

      return;
    }

    try {
      setSubmitting(true);

      await api.post("/banners", {
        title,
        subtitle,
        description,
        button,
        image,
      });

      toast.success("Banner berhasil ditambahkan");

      resetForm();
      setOpen(false);

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambah banner"));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await api.put(`/banners/${banner._id}`, { active: !banner.active });

      toast.success(banner.active ? "Banner dinonaktifkan" : "Banner diaktifkan");

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengubah banner"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus banner ini?")) return;

    try {
      await api.delete(`/banners/${id}`);

      toast.success("Banner dihapus");

      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus banner"));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Banner"
          subtitle={`${loading ? "…" : banners.length} banner tersedia.`}
          action={
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={18} />

              Tambah Banner
            </button>
          }
        />

        {loading ? (
          <LoadingBlock rows={3} />
        ) : banners.length === 0 ? (
          <EmptyState
            icon={<ImageIcon size={28} />}
            title="Belum ada banner"
            description="Banner akan tampil sebagai hero di halaman utama situs."
            actionLabel="Tambah Banner"
            onAction={() => setOpen(true)}
          />
        ) : (
          <section className="space-y-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white"
              >
                <div className="relative h-64 md:h-80">
                  {banner.image ? (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-300">
                      <ImageIcon size={48} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="absolute bottom-6 left-6 max-w-lg text-white md:bottom-10 md:left-10">
                    {banner.subtitle && (
                      <p className="text-xs uppercase tracking-[0.35em]">
                        {banner.subtitle}
                      </p>
                    )}

                    <h3 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                      {banner.title}
                    </h3>

                    {banner.description && (
                      <p className="mt-3 text-sm text-neutral-200">
                        {banner.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        banner.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          banner.active ? "bg-emerald-500" : "bg-neutral-400"
                        }`}
                      />

                      {banner.active ? "Aktif" : "Nonaktif"}
                    </span>

                    {banner.button && (
                      <span className="rounded-full bg-[#f8f8f8] px-3 py-1 text-xs text-neutral-500">
                        Tombol: {banner.button}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(banner)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100"
                      aria-label="Ubah status banner"
                    >
                      <Power size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Hapus banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Dialog Tambah Banner */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Banner</DialogTitle>

            <DialogDescription>
              Banner ini akan tampil di hero halaman utama.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul</label>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Essence of Elegance"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subjudul</label>

              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ocil Fragrance"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>

              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat banner"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Teks Tombol</label>

              <Input
                value={button}
                onChange={(e) => setButton(e.target.value)}
                placeholder="Shop Collection"
                className="h-12 rounded-2xl px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gambar</label>

              <ImageUpload value={image} onChange={setImage} />
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
                {submitting ? "Menyimpan…" : "Simpan Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
