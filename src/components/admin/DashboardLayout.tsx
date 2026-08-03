"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

import { LogOut, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { menus } from "./nav";
import { api } from "@/lib/api";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // tetap redirect meski gagal
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: "9999px" } }} />

      <div className="flex min-h-screen">
        {/* Sidebar (Desktop) */}
        <Sidebar />

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="px-6 pt-8 lg:px-12">
            <Header onOpenMenu={() => setMobileOpen(true)} />
          </div>

          <main className="flex-1 px-6 pb-12 lg:px-12">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute left-0 top-0 flex h-full w-72 flex-col justify-between border-r border-neutral-200 bg-white shadow-2xl">
            <div>
              <div className="flex items-center justify-between px-6 pb-8 pt-6">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow">
                    🌸
                  </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-black">
                      OCIL
                    </h1>

                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                      Fragrance Admin
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition hover:bg-neutral-100"
                  aria-label="Tutup menu"
                >
                  <X size={19} />
                </button>
              </div>

              <nav className="space-y-1 px-5">
                {menus.map((menu) => {
                  const Icon = menu.icon;

                  const active = pathname === menu.href;

                  return (
                    <Link
                      key={menu.title}
                      href={menu.href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex
                        items-center
                        gap-4
                        rounded-full
                        px-5
                        py-3
                        text-sm
                        font-medium
                        transition-all
                        duration-300

                        ${
                          active
                            ? "bg-black text-white shadow"
                            : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
                        }
                      `}
                    >
                      <Icon size={19} />

                      <span>
                        {menu.title}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3 font-medium text-white transition hover:bg-neutral-800"
              >
                <LogOut size={18} />

                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
