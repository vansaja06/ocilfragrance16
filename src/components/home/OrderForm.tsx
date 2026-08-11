"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
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
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import { notifyCartChanged } from "@/lib/dataEvents";
import { addLocalOrder } from "@/lib/orders";
import ImageUpload from "@/components/admin/ImageUpload";
import { DecantOption, Settings } from "@/lib/types";

export interface ShopProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  slug?: string;
  hasDecant?: boolean;
  decants?: DecantOption[];
}

interface SettingsResponse {
  settings: Settings;
}

interface OrderFormProps {
  product: ShopProduct;
  onSuccess?: () => void;
}

const inputClass =
  "h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400";

export default function OrderForm({ product, onSuccess }: OrderFormProps) {
  const router = useRouter();

  const { data } = useFetch<SettingsResponse>("/settings");

  const settings = data?.settings ?? {};

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const decants = product.decants ?? [];
  const canDecant = Boolean(product.hasDecant) && decants.length > 0;

  const [variant, setVariant] = useState<"full" | "decant">("full");
  const [size, setSize] = useState(decants[0]?.size ?? "");

  const [payment, setPayment] = useState<"qris" | "transfer">("qris");
  const [shipping, setShipping] = useState<"cod" | "antar">("cod");
  const [paymentProof, setPaymentProof] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);

  const selectedDecant = decants.find((item) => item.size === size);

  const isDecant = variant === "decant";

  const orderPrice =
    isDecant && selectedDecant ? selectedDecant.price : product.price;

  const orderName = isDecant ? `${product.name} (${size})` : product.name;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Lengkapi nama, nomor telepon, dan alamat terlebih dahulu");

      return;
    }

    if (shipping !== "cod" && !paymentProof) {
      toast.error("Upload bukti pembayaran terlebih dahulu");

      return;
    }

    const isRealId = /^[0-9a-fA-F]{24}$/.test(product._id);

    try {
      setSubmitting(true);

      const res = await api.post<{
        success: boolean;
        order?: { _id?: string; invoice?: string };
      }>("/orders", {
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        payment,
        paymentProof,
        shipping,
        items: [
          {
            product: isRealId ? product._id : null,
            name: orderName,
            qty: 1,
            price: orderPrice,
          },
        ],
      });

      const invoice = res.data?.order?.invoice;

      addLocalOrder({
        _id: res.data?.order?._id ?? "",
        invoice: invoice ?? "",
        total: orderPrice,
        createdAt: new Date().toISOString(),
        items: [{ name: orderName, qty: 1, price: orderPrice }],
        payment,
        shipping,
      });

      notifyCartChanged();

      setInvoice(invoice ?? "Pesanan diterima");

      toast.success(
        invoice
          ? `Pesanan berhasil dibuat. Invoice: ${invoice}`
          : "Pesanan Anda telah kami terima"
      );

      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal membuat pesanan"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mt-6">
      {invoice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 size={28} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-black">
            Pesanan Berhasil Dibuat!
          </h3>

          <p className="mt-1 text-sm text-neutral-600">
            Invoice: <span className="font-semibold">{invoice}</span>
          </p>

          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Pesanan tersimpan di perangkat ini. Klik ikon keranjang di navbar
            untuk melihat status pesanan.
          </p>

          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-neutral-800"
          >
            <ShoppingBag size={16} />

            Lihat Pesanan Saya
          </button>
        </div>
      )}

      <div
        className={`transition-all duration-500 ease-out ${
          invoice ? "pointer-events-none max-h-0 overflow-hidden opacity-0" : "max-h-[2000px] opacity-100"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product variant (Full / Decant) */}
      {canDecant && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-800">
            Pilihan Produk
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVariant("full")}
              className={`
                flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200
                ${
                  variant === "full"
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                }
              `}
            >
              <Droplets size={16} />

              Full Parfum
            </button>

            <button
              type="button"
              onClick={() => setVariant("decant")}
              className={`
                flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200
                ${
                  variant === "decant"
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                }
              `}
            >
              <Droplets size={16} />

              Decant
            </button>
          </div>

          {isDecant && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-neutral-800">Ukuran</p>

              {decants.map((item) => {
                const active = size === item.size;

                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setSize(item.size)}
                    className={`
                      flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200
                      ${
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }
                    `}
                  >
                    <span>{item.size}</span>

                    <span>{formatRupiah(item.price)}</span>
                  </button>
                );
              })}
            </div>
          )}
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
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pl-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400"
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
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
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
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }
            `}
          >
            <Landmark size={16} />

            Transfer
          </button>
        </div>

        {/* Payment detail */}
        <div className="mt-3 rounded-2xl border border-neutral-200 bg-[#f8f8f8] p-4">
          {payment === "qris" ? (
            settings.qrisImage ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={settings.qrisImage}
                  alt="QRIS"
                  className="h-44 w-44 rounded-xl border border-neutral-200 bg-white object-cover"
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-700">
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
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
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
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }
            `}
          >
            <Store size={16} />

            Antar di Tempat
          </button>
        </div>
      </div>

      {/* Payment proof */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-800">
            Upload Bukti Pembayaran
          </p>

          {shipping === "cod" && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
              Opsional untuk COD
            </span>
          )}
        </div>

        <ImageUpload value={paymentProof} onChange={setPaymentProof} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-neutral-800 disabled:opacity-60 disabled:hover:scale-100"
      >
        <Send size={16} />

        {submitting
          ? "Memproses…"
          : `Buat Pesanan · ${formatRupiah(orderPrice)}`}
      </button>
        </form>
      </div>
    </div>
  );
}
