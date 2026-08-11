"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  User,
  Menu,
  ShoppingCart,
  Check,
} from "lucide-react";

import { api } from "@/lib/api";
import { onDataChanged } from "@/lib/dataEvents";
import { Order, OrderStatus } from "@/lib/types";

interface HeaderProps {
  onOpenMenu?: () => void;
}

const SEEN_KEY = "ocil-notif-seen";

const statusBadge: Record<OrderStatus, string> = {
  Selesai: "bg-emerald-50 text-emerald-700",
  Diproses: "bg-blue-50 text-blue-700",
  Menunggu: "bg-amber-50 text-amber-700",
  Dibatalkan: "bg-red-50 text-red-700",
};

const timeAgo = (value?: string) => {
  if (!value) return "";

  const diff = Date.now() - new Date(value).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);

  return days === 1 ? "1 hari lalu" : `${days} hari lalu`;
};

const getSeen = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const setSeen = (invoices: string[]) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(invoices));
  } catch {
    // abaikan
  }
};

export default function Header({ onOpenMenu }: HeaderProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<Order[]>([]);
  const [unseen, setUnseen] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const pending = (orders: Order[]) =>
    orders.filter((order) => order.status === "Menunggu");

  const syncUnseen = useCallback((orders: Order[]) => {
    const seen = getSeen();

    setUnseen(
      pending(orders).filter((order) => !seen.includes(order.invoice)).length
    );
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get<{ orders: Order[] }>("/orders?limit=8");

      const orders = res.data?.orders ?? [];

      setRecent(orders);
      setLoading(false);

      syncUnseen(orders);
    } catch {
      setLoading(false);
    }
  }, [syncUnseen]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 20000);

    const offData = onDataChanged(fetchNotifications);

    return () => {
      clearInterval(interval);
      offData();
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleToggle = () => {
    setOpen((value) => {
      const next = !value;

      if (next) {
        const seen = getSeen();

        pending(recent).forEach((order) => {
          if (!seen.includes(order.invoice)) seen.push(order.invoice);
        });

        setSeen(seen);
        setUnseen(0);
      }

      return next;
    });
  };

  const goToOrders = () => {
    setOpen(false);

    router.push("/admin/orders");
  };

  return (
    <header className="flex items-center justify-between gap-4">
      {/* Kiri */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMenu}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white transition hover:bg-neutral-100 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={19} />
        </button>

        <div>
          <p className="hidden text-xs uppercase tracking-[0.4em] text-neutral-500 sm:block">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight text-black lg:text-4xl">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <div ref={containerRef} className="relative">
          <button
            onClick={handleToggle}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white transition hover:bg-neutral-100"
            aria-label="Notifikasi"
          >
            <Bell
              size={19}
              className="text-neutral-700"
            />

            {unseen > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unseen > 9 ? "9+" : unseen}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:w-96">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-black">
                    Notifikasi
                  </p>

                  <p className="text-xs text-neutral-400">
                    Pesanan masuk terbaru
                  </p>
                </div>

                <button
                  onClick={goToOrders}
                  className="text-xs font-medium text-neutral-500 transition hover:text-black"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="max-h-[22rem] overflow-y-auto">
                {loading ? (
                  <div className="space-y-3 px-5 py-6">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-14 animate-pulse rounded-2xl bg-neutral-100"
                      />
                    ))}
                  </div>
                ) : recent.length === 0 ? (
                  <div className="flex flex-col items-center px-5 py-12 text-center">
                    <ShoppingCart
                      size={24}
                      className="text-neutral-300"
                    />

                    <p className="mt-3 text-sm font-medium text-neutral-700">
                      Belum ada pesanan
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Pesanan baru dari pelanggan akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {recent.map((order) => {
                      const isPending = order.status === "Menunggu";

                      return (
                        <button
                          key={order._id}
                          onClick={goToOrders}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-neutral-50"
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              isPending
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {isPending ? (
                              <Bell size={16} />
                            ) : (
                              <Check size={16} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-black">
                              {order.invoice}
                            </p>

                            <p className="truncate text-xs text-neutral-500">
                              {order.customerName}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                statusBadge[order.status] ??
                                "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              {order.status}
                            </span>

                            <span className="text-[10px] text-neutral-400">
                              {timeAgo(order.createdAt)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={goToOrders}
                className="flex w-full items-center justify-center gap-2 border-t border-neutral-100 py-3.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Kelola Pesanan
              </button>
            </div>
          )}
        </div>

        {/* Profil */}
        <button className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-4 transition hover:bg-neutral-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black">
            <User
              size={18}
              className="text-white"
            />
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-black">
              Admin
            </p>

            <p className="text-xs text-neutral-500">
              Super Admin
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-neutral-500 md:block"
          />
        </button>
      </div>
    </header>
  );
}
