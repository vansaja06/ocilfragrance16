"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  Landmark,
  Banknote,
  Send,
  Crown,
  XCircle,
} from "lucide-react";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { formatRupiah } from "@/lib/format";
import {
  clearSubscriberEmail,
  getSubscriberEmail,
  setSubscriberEmail,
} from "@/lib/subscription";
import ImageUpload from "@/components/admin/ImageUpload";
import { Settings } from "@/lib/types";

interface SettingsResponse {
  settings: Settings;
}

const inputClass =
  "h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400";

export default function Subscribe() {
  const { data } = useFetch<SettingsResponse>("/settings");
  const settings = data?.settings ?? {};

  const [step, setStep] = useState<"email" | "payment" | "pending" | "active">(
    "email"
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<"qris" | "transfer">("qris");
  const [paymentProof, setPaymentProof] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const SUBSCRIPTION_FEE = 25000;

  useEffect(() => {
    const stored = getSubscriberEmail();

    if (!stored) return;

    let cancelled = false;

    api
      .get<{
        subscribed: boolean;
        subscriber?: { expiresAt?: string | null };
      }>(`/subscribers/status?email=${encodeURIComponent(stored)}`)
      .then((res) => {
        if (cancelled) return;

        if (res.data.subscribed) {
          setEmail(stored);
          setExpiresAt(res.data.subscriber?.expiresAt ?? null);
          setStep("active");
        }
      })
      .catch(() => {
        // ignore
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setPhone("");
    setPaymentProof("");
    setConfirmCancel(false);
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      toast.error("Masukkan alamat email yang valid");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.get<{
        subscribed: boolean;
        subscriber?: { expiresAt?: string | null };
      }>(`/subscribers/status?email=${encodeURIComponent(normalized)}`);

      if (res.data.subscribed) {
        setEmail(normalized);
        setSubscriberEmail(normalized);
        setExpiresAt(res.data.subscriber?.expiresAt ?? null);
        setStep("active");
        return;
      }

      setStep("payment");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memeriksa email"));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }

    if (!paymentProof) {
      toast.error("Upload bukti pembayaran terlebih dahulu");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/subscribers", {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone.trim(),
        payment,
        paymentProof,
      });

      setSubscriberEmail(email.trim().toLowerCase());
      setStep("pending");
      toast.success("Pembayaran subscribe berhasil dikirim! Menunggu persetujuan admin.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengirim pembayaran"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);

      await api.patch("/subscribers/cancel", { email });

      clearSubscriberEmail();
      resetForm();
      setExpiresAt(null);
      setStep("email");
      toast.success("Langganan berhasil dihentikan");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghentikan langganan"));
    } finally {
      setCancelling(false);
    }
  };

  if (step === "pending") {
    return (
      <section
        id="subscribe"
        className="relative overflow-hidden bg-white pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-44 lg:pb-52"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 size={40} />
          </div>

          <h2 className="mt-8 text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
            Terima Kasih!
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
            Pembayaran subscription Anda sedang diverifikasi oleh admin. Anda
            akan mendapatkan akses diskon eksklusif setelah disetujui.
          </p>
        </div>
      </section>
    );
  }

  if (step === "active") {
    return (
      <section
        id="subscribe"
        className="relative overflow-hidden bg-white pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-44 lg:pb-52"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Crown size={36} />
            </div>

            <h2 className="mt-8 text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
              Langganan Aktif
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
              Anda sudah terdaftar sebagai subscriber. Nikmati diskon eksklusif
              di setiap pembelian!
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-neutral-200 bg-[#f8f8f8] p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
              Detail Langganan
            </p>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-neutral-500">Email</dt>
                <dd className="text-right font-medium text-neutral-900">
                  {email}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
                <dt className="text-neutral-500">Berlaku hingga</dt>
                <dd className="text-right font-medium text-neutral-900">
                  {formatDate(expiresAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 rounded-3xl border border-red-100 bg-red-50/50 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-red-300">
              Kelola Langganan
            </p>

            <h3 className="mt-3 text-lg font-medium text-neutral-900">
              Hentikan Langganan
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Jika Anda menghentikan langganan, diskon eksklusif akan berakhir
              dan Anda perlu berlangganan kembali untuk mendapatkannya.
            </p>

            {!confirmCancel ? (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                disabled={cancelling}
                className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-6 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
              >
                <XCircle size={16} />
                Berhenti Berlangganan
              </button>
            ) : (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <XCircle size={16} />
                  {cancelling ? "Memproses…" : "Ya, Hentikan Langganan"}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  disabled={cancelling}
                  className="flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-60"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="subscribe"
      className="relative overflow-hidden bg-white pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-44 lg:pb-52"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f8f8] text-black">
          <Crown size={28} />
        </div>

        <h2 className="mt-6 text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
          Subscribe & Get Exclusive Discounts
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
          Berlangganan untuk mendapatkan diskon eksklusif di setiap pembelian.
          Harga subscribe hanya {formatRupiah(SUBSCRIPTION_FEE)}/bulan.
        </p>

        {step === "email" ? (
          <form
            onSubmit={handleEmailSubmit}
            className="mt-12 flex justify-center sm:mt-14"
          >
            <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm sm:flex-row sm:rounded-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="flex-1 bg-white px-5 py-5 text-sm outline-none sm:px-7"
              />

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 bg-black px-8 py-5 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Memeriksa…" : "Lanjutkan"}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="mt-12 space-y-5 text-left sm:mt-14">
            <div className="mx-auto max-w-xl space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-800">
                  Email
                </p>
                <input
                  type="email"
                  value={email}
                  disabled
                  className={`${inputClass} bg-neutral-50 text-neutral-500`}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-neutral-800">
                  Nama Lengkap
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className={inputClass}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-neutral-800">
                  No. Telepon / WhatsApp
                </p>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Opsional"
                  className={inputClass}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-neutral-800">
                  Metode Pembayaran
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayment("qris")}
                    className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200 ${
                      payment === "qris"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <QrCode size={16} />
                    QRIS
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayment("transfer")}
                    className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all duration-200 ${
                      payment === "transfer"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Landmark size={16} />
                    Transfer
                  </button>
                </div>

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
                          Scan QRIS di atas untuk membayar {formatRupiah(SUBSCRIPTION_FEE)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <QrCode size={36} className="text-neutral-300" />
                        <p className="text-sm text-neutral-500">
                          QRIS belum diatur. Hubungi admin.
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
                          Transfer sebesar
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-800">
                          {formatRupiah(SUBSCRIPTION_FEE)}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          ke {settings.bankAccount}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="py-2 text-center text-sm text-neutral-500">
                      Info rekening belum diatur. Hubungi admin.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-neutral-800">
                  Upload Bukti Pembayaran
                </p>
                <ImageUpload value={paymentProof} onChange={setPaymentProof} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-neutral-800 disabled:opacity-60 disabled:hover:scale-100"
              >
                <Send size={16} />
                {submitting
                  ? "Mengirim…"
                  : `Bayar Subscribe · ${formatRupiah(SUBSCRIPTION_FEE)}`}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-center text-sm text-neutral-500 transition hover:text-black"
              >
                ← Kembali
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-neutral-400">
          No spam, just good scents. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
