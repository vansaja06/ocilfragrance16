"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { ImagePlus, Loader2, RefreshCw, X } from "lucide-react";

import { api, getErrorMessage } from "@/lib/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File yang dipilih bukan gambar");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB");

      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });

    try {
      setUploading(true);

      const res = await api.post("/upload", { image: dataUrl });

      onChange(res.data?.url);

      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengunggah gambar"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200">
          <img
            src={value}
            alt="Pratinjau gambar"
            className="h-48 w-full object-cover"
          />

          <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}

              {uploading ? "Mengunggah…" : "Ganti Gambar"}
            </button>

            <button
              type="button"
              onClick={() => onChange("")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-600 transition hover:bg-red-500 hover:text-white"
              aria-label="Hapus gambar"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 text-neutral-400 transition hover:border-black hover:bg-neutral-50 hover:text-black disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <ImagePlus size={24} />
          )}

          <span className="text-sm font-medium">
            {uploading ? "Mengunggah…" : "Pilih Gambar dari Galeri"}
          </span>

          <span className="text-xs">JPG, PNG, WEBP · maks 5MB</span>
        </button>
      )}
    </div>
  );
}
