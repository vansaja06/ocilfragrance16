"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Check,
  X,
  ExternalLink,
  Mail,
  Phone,
  CreditCard,
  Crown,
  Search,
  PackageSearch,
} from "lucide-react";

import DashboardLayout from "@/components/admin/DashboardLayout";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import LoadingBlock from "@/components/admin/LoadingBlock";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import { api, getErrorMessage } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { notifyDataChanged } from "@/lib/dataEvents";
import { Subscriber, SubscriberStatus } from "@/lib/types";

interface SubscribersResponse {
  subscribers: Subscriber[];
}

const statusBadge: Record<SubscriberStatus, string> = {
  Disetujui: "bg-emerald-50 text-emerald-700",
  Menunggu: "bg-amber-50 text-amber-700",
  Ditolak: "bg-red-50 text-red-700",
  Berhenti: "bg-neutral-100 text-neutral-500",
};

const statusLabel: Record<SubscriberStatus, string> = {
  Disetujui: "Disetujui",
  Menunggu: "Menunggu",
  Ditolak: "Ditolak",
  Berhenti: "Berhenti",
};

const formatDate = (value?: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SubscribersPage() {
  const { data, loading, refetch } = useFetch<SubscribersResponse>("/subscribers");

  const subscribers = data?.subscribers ?? [];

  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    action: "approve" | "reject";
  } | null>(null);

  const filtered = subscribers.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.email.toLowerCase().includes(q) ||
      (s.name && s.name.toLowerCase().includes(q))
    );
  });

  const handleApprove = async (id: string) => {
    setUpdating(id);

    try {
      await api.patch(`/subscribers/${id}/approve`);
      toast.success("Subscriber disetujui");
      setConfirmAction(null);
      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyetujui"));
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (id: string) => {
    setUpdating(id);

    try {
      await api.patch(`/subscribers/${id}/reject`);
      toast.success("Subscriber ditolak");
      setConfirmAction(null);
      refetch();
      notifyDataChanged();
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menolak"));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          label="Ocil Fragrance"
          title="Subscriber"
          subtitle={`${loading ? "…" : subscribers.length} total subscriber.`}
        />

        {loading ? (
          <LoadingBlock rows={5} />
        ) : subscribers.length === 0 ? (
          <EmptyState
            icon={<Crown size={28} />}
            title="Belum ada subscriber"
            description="Subscriber akan muncul setelah ada yang berlangganan."
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
                placeholder="Cari email atau nama..."
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
                  Tidak ada subscriber yang cocok
                </h3>
              </div>
            ) : (
              <section className="space-y-5">
                {filtered.map((subscriber) => {
                  const busy = updating === subscriber._id;

                  return (
                    <div
                      key={subscriber._id}
                      className="rounded-3xl border border-neutral-200 bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-black">
                            {subscriber.email}
                          </p>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[subscriber.status]}`}
                          >
                            {statusLabel[subscriber.status]}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400">
                          {formatDate(subscriber.createdAt)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3">
                        <div className="space-y-3">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                            Data Diri
                          </p>

                          <p className="font-semibold text-black">
                            {subscriber.name || "—"}
                          </p>

                          <p className="flex items-center gap-2 text-sm text-neutral-600">
                            <Mail size={14} className="text-neutral-400" />
                            {subscriber.email}
                          </p>

                          {subscriber.phone && (
                            <p className="flex items-center gap-2 text-sm text-neutral-600">
                              <Phone size={14} className="text-neutral-400" />
                              {subscriber.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                            Pembayaran
                          </p>

                          <p className="flex items-center gap-2 text-sm text-neutral-700">
                            <CreditCard size={14} className="text-neutral-400" />
                            {subscriber.payment === "transfer"
                              ? "Transfer Bank"
                              : subscriber.payment === "qris"
                                ? "QRIS"
                                : subscriber.payment || "—"}
                          </p>

                          {subscriber.expiresAt && (
                            <p className="text-sm text-neutral-600">
                              Berlaku hingga:{" "}
                              <span className="font-medium">
                                {formatDate(subscriber.expiresAt)}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                            Bukti Pembayaran
                          </p>

                          {subscriber.paymentProof ? (
                            <a
                              href={subscriber.paymentProof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative block aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-neutral-200"
                            >
                              <img
                                src={subscriber.paymentProof}
                                alt="Bukti pembayaran"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                              <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition group-hover:text-black">
                                <ExternalLink size={14} />
                              </span>
                            </a>
                          ) : (
                            <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-neutral-200 text-xs text-neutral-400">
                              Tidak ada bukti pembayaran
                            </div>
                          )}
                        </div>
                      </div>

                      {subscriber.status === "Menunggu" && (
                        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: subscriber._id,
                                action: "reject",
                              })
                            }
                            disabled={busy}
                            className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <X size={14} />
                            Tolak
                          </button>

                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: subscriber._id,
                                action: "approve",
                              })
                            }
                            disabled={busy}
                            className="flex h-10 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                          >
                            <Check size={14} />
                            Setujui
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction?.action === "approve"
            ? "Setujui Subscriber"
            : "Tolak Subscriber"
        }
        description={
          confirmAction?.action === "approve"
            ? "Subscriber akan mendapatkan akses diskon eksklusif."
            : "Subscriber ini akan ditolak dan tidak mendapatkan akses diskon."
        }
        confirmLabel={
          confirmAction?.action === "approve" ? "Setujui" : "Tolak"
        }
        loading={updating === confirmAction?.id}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.action === "approve") {
            handleApprove(confirmAction.id);
          } else {
            handleReject(confirmAction.id);
          }
        }}
      />
    </DashboardLayout>
  );
}
