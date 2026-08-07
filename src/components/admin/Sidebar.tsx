"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { api } from "@/lib/api";
import { menus } from "./nav";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
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
    <aside className="hidden h-screen w-72 flex-col justify-between overflow-y-auto border-r border-neutral-200 bg-white lg:flex">
      {/* Logo */}
      <div>
        <div className="px-8 pb-10 pt-8">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-black">
              OCIL
            </h1>

            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-neutral-400">
              Fragrance Admin
            </p>
          </Link>
        </div>

        {/* Menu */}
        <nav className="space-y-1 px-5">
          {menus.map((menu) => {
            const Icon = menu.icon;

            const active = pathname === menu.href;

            return (
              <Link
                key={menu.title}
                href={menu.href}
                onClick={onNavigate}
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

      {/* Footer */}
      <div className="p-6">
        <div className="rounded-3xl border border-neutral-200 bg-[#fafafa] p-5">
          <p className="font-semibold text-black">
            Admin OCIL
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Selamat bekerja
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            <LogOut size={18} />

            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
