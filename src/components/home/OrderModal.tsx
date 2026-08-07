"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  X,
  User,
  Phone,
  MapPin,
  QrCode,
  Landmark,
  Banknote,
  Truck,
  Store,
  Send,
  Droplets,
} from "lucide-react";

import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import { Settings } from "@/lib/types";

export interface ShopProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface SettingsResponse {
  settings: Settings;
}

interface OrderModalProps {
  product: ShopProduct | null;
  onClose: () => void;
}

const DECANT_SIZES = ["5 ml", "10 ml", "15 ml"];

const FALLBACK_DESCRIPTION =
  "Fragrance premium dengan karakter yang elegan dan tahan lama. Dikurasi khusus untuk menemani gaya dan kepribadian Anda sehari-hari.";

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const { data } = useFetch<SettingsResponse>("/settings");

  const settings = data?.settings ?? {};

  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [size, setSize] = useState(DECANT_SIZES[1]);

  const [payment, setPayment] = useState<"qris" | "transfer">("qris");
  const [shipping, setShipping] = useState<"cod" | "antar">("cod");

  const [submitting, setSubmitting] = useState(false);

  const isDecant = product?.category?.toLowerCase() === "decant";

  // Reset form each time a product is opened
  useEffect(() => {
    if (product) {
      setName("");
      setPhone("");
      setAddress("");
      setSize(DECANT_SIZES[1]);
      setPayment("qris");
      setShipping("cod");
    }
  }, [product]);

  // Lock body scroll while open
  useEffect(() => {
    if (!product) return;

    const original = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [product]);

  // Mount animation
  useEffect(() => {
    if (!product) return;

    setMounted(false);

    const raf = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(raf);
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Lengkapi nama, nomor telepon, dan alamat terlebih dahulu");

      return;
    }

    setSubmitting(true);

    const summary = [
      `Produk: ${product.name}${isDecant ? ` (${size})` : ""}`,
      `Harga: ${formatRupiah(product.price)}`,
      `Pembayaran: ${payment === "qris" ? "QRIS" : "Transfer Bank"}`,
      `Pengiriman: ${shipping === "cod" ? "COD" : "Di antar di tempat"}`,
      `Nama: ${name}`,
      `No. Telepon: ${phone}`,
      `Alamat: ${address}`,
    ];

    setTimeout(() => {
      setSubmitting(false);

      toast.success("Pesanan Anda telah kami terima");

      console.log("[demo-order]", summary.join("\n"));

      onClose();
    }, 800);
  };

  const inputClass =
    "h-12 w-full rounded-2xl border border-white/60 bg-white/60 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 backdrop-blur-xl transition outline-none focus:border-neutral-400 focus:bg-white/80";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Liquid Glass Panel */}
      <div
        className={`
          relative
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          rounded-[32px]
          border
          border-white/50
          bg-white/55
          backdrop-blur-2xl
          shadow-[0_30px_80px_rgba(0,0,0,0.35)]
          transition-all
          duration-300
          ${mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}
        `}
      >
        {/* Glass gradient blobs */}
        <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-rose-200 via-pink-100 to-transparent opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-200 via-indigo-100 to-transparent opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-40 w-40 rounded-full bg-gradient-to-bl from-amber-100 via-orange-50 to-transparent opacity-50 blur-3xl" />

        {/* Inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/40" />

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/50 bg-white/50">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                  <Droplets size={32} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">
                {product.category}
              </p>

              <h3 className="mt-1.5 text-xl font-bold leading-snug text-neutral-900">
                {product.name}
              </h3>

              <p className="mt-1.5 text-lg font-semibold text-neutral-900">
                {formatRupiah(product.price)}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/50 text-neutral-500 backdrop-blur-xl transition hover:bg-white/80 hover:text-neutral-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              Deskripsi
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {product.description || FALLBACK_DESCRIPTION}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Size (Decant only) */}
            {isDecant && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Droplets size={14} className="text-neutral-500" />

                  <span className="text-sm font-medium text-neutral-800">
                    Ukuran
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {DECANT_SIZES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSize(item)}
                      className={`
                        h-11 rounded-2xl border text-sm font-medium transition-all duration-200
                        ${
                          size === item
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                            : "border-white/60 bg-white/60 text-neutral-600 backdrop-blur-xl hover:bg-white/80"
                        }
                      `}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact fields */}
            <div className="space-y-3">
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="No. Telepon / WhatsApp"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-4 top-4 text-neutral-400"
                />

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat Lengkap"
                  rows={3}
                  className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 pl-11 text-sm text-neutral-900 placeholder:text-neutral-400 backdrop-blur-xl transition outline-none focus:border-neutral-400 focus:bg-white/80"
                />
              </div>
            </div>

            {/* Payment method */}
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-800">
                Metode Pembayaran
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayment("qris")}
                  className={`
                    flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200
                    ${
                      payment === "qris"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-white/60 bg-white/60 text-neutral-600 backdrop-blur-xl hover:bg-white/80"
                    }
                  `}
                >
                  <QrCode size={16} />

                  QRIS
                </button>

                <button
                  type="button"
                  onClick={() => setPayment("transfer")}
                  className={`
                    flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200
                    ${
                      payment === "transfer"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-white/60 bg-white/60 text-neutral-600 backdrop-blur-xl hover:bg-white/80"
                    }
                  `}
                >
                  <Landmark size={16} />

                  Transfer
                </button>
              </div>

              {/* Payment detail */}
              <div className="mt-3 rounded-2xl border border-white/60 bg-white/50 p-4 backdrop-blur-xl">
                {payment === "qris" ? (
                  settings.qrisImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={settings.qrisImage}
                        alt="QRIS"
                        className="h-44 w-44 rounded-xl border border-white/60 bg-white object-cover"
                      />

                      <p className="text-xs text-neutral-500">
                        Scan QRIS di atas untuk melakukan pembayaran
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <QrCode size={36} className="text-neutral-300" />

                      <p className="text-sm text-neutral-500">
                        QRIS belum diatur. Atur lewat{" "}
                        <span className="font-medium text-neutral-700">
                          Admin Panel → Pengaturan → Pembayaran
                        </span>
                        .
                      </p>
                    </div>
                  )
                ) : settings.bankAccount ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-neutral-700">
                      <Banknote size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                        Nomor Rekening
                      </p>

                      <p className="mt-1 text-sm font-semibold text-neutral-800">
                        {settings.bankAccount}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="py-2 text-center text-sm text-neutral-500">
                    Nomor rekening belum diatur. Atur lewat{" "}
                    <span className="font-medium text-neutral-700">
                      Admin Panel → Pengaturan → Pembayaran
                    </span>
                    .
                  </p>
                )}
              </div>
            </div>

            {/* Shipping method */}
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-800">
                Metode Pengiriman
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShipping("cod")}
                  className={`
                    flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200
                    ${
                      shipping === "cod"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-white/60 bg-white/60 text-neutral-600 backdrop-blur-xl hover:bg-white/80"
                    }
                  `}
                >
                  <Truck size={16} />

                  COD
                </button>

                <button
                  type="button"
                  onClick={() => setShipping("antar")}
                  className={`
                    flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200
                    ${
                      shipping === "antar"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-white/60 bg-white/60 text-neutral-600 backdrop-blur-xl hover:bg-white/80"
                    }
                  `}
                >
                  <Store size={16} />

                  Antar di Tempat
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-neutral-800 disabled:opacity-60 disabled:hover:scale-100"
            >
              <Send size={16} />

              {submitting ? "Memproses…" : "Buat Pesanan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
