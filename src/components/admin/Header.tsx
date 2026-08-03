"use client";

import {
  Bell,
  Search,
  ChevronDown,
  User,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      {/* Kiri */}

      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
          Admin Panel
        </p>

        <h1 className="mt-2 text-3xl font-light tracking-tight text-black lg:text-4xl">
          Dashboard
        </h1>
      </div>

      {/* Kanan */}

      <div className="flex items-center gap-4">
        {/* Search */}

        <div className="hidden w-72 items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 md:flex">
          <Search
            size={18}
            className="text-neutral-400"
          />

          <input
            type="text"
            placeholder="Cari produk..."
            className="flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />
        </div>

        {/* Notifikasi */}

        <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white transition hover:bg-neutral-100">
          <Bell
            size={19}
            className="text-neutral-700"
          />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-black" />
        </button>

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
