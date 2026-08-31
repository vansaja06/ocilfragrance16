"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Search, ShoppingBag, User, Menu, X, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";

import { formatRupiah } from "@/lib/format";
import { getLocalOrders } from "@/lib/orders";
import { onCartChanged } from "@/lib/dataEvents";
import { Product } from "@/lib/types";
import { useHomeData } from "@/context/HomeDataContext";

gsap.registerPlugin(ScrollToPlugin);

const menus = [
  { title: "ocilfragrance16", id: "shop", brand: true },
  { title: "Shop", id: "just-in" },
  { title: "Collection", id: "collection" },
  { title: "Subscribe", id: "subscribe" },
  { title: "About", id: "footer" },
];

const glass =
  "backdrop-blur-2xl bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]";

export default function Navbar() {
  const router = useRouter();

  const { settings: homeSettings, products: homeProducts } = useHomeData();

  const storeName =
    homeSettings?.storeName?.trim() || "ocilfragrance16";
  const products = useMemo(() => homeProducts ?? [], [homeProducts]);

  const [openSearch, setOpenSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const sync = () => setOrderCount(getLocalOrders().length);

    sync();

    const unsubscribe = onCartChanged(sync);

    window.addEventListener("storage", sync);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", sync);
    };
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // ================= SEARCH =================
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;

    const targetMenu = isDesktop
      ? desktopMenuRef.current
      : mobileMenuRef.current;

    const currentSearch = isDesktop
      ? desktopSearchRef.current
      : mobileSearchRef.current;

    const currentInput = isDesktop
      ? desktopInputRef.current
      : mobileInputRef.current;

    if (!targetMenu || !currentSearch) return;

    if (openSearch) {
      if (isDesktop) {
        gsap.to(targetMenu, {
          opacity: 0,
          x: -20,
          duration: 0.25,
          pointerEvents: "none",
        });
      }

      gsap.fromTo(
        currentSearch,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          pointerEvents: "auto",
          onComplete: () => currentInput?.focus(),
        },
      );
    } else {
      gsap.to(currentSearch, {
        scaleX: 0,
        opacity: 0,
        duration: 0.25,
        pointerEvents: "none",
      });

      if (isDesktop) {
        gsap.to(targetMenu, {
          opacity: 1,
          x: 0,
          duration: 0.25,
          delay: 0.1,
          pointerEvents: "auto",
        });
      }
    }
  }, [openSearch]);

  // ================= MOBILE MENU =================
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileMenu) {
      gsap.fromTo(
        mobileMenuRef.current,
        { y: -40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          pointerEvents: "auto",
          onComplete: () => setOpenSearch(false),
        },
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  }, [mobileMenu]);

  // ================= ACTIVE SECTION =================
  useEffect(() => {
    const onScroll = () => {
      const offset = window.innerHeight * 0.35;
      let currentId = menus[0].id;

      for (const menu of menus) {
        const el = document.getElementById(menu.id);
        if (!el) continue;

        if (el.getBoundingClientRect().top <= offset) {
          currentId = menu.id;
        }
      }

      const last = menus[menus.length - 1];
      const lastEl = document.getElementById(last.id);

      if (
        lastEl &&
        lastEl.getBoundingClientRect().bottom <= window.innerHeight + 4
      ) {
        currentId = last.id;
      }

      setActive(currentId);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // ================= SCROLL =================
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActive(id);

    gsap.to(window, {
      duration: 1,
      ease: "power3.inOut",
      scrollTo: { y: el, offsetY: 80 },
    });

    setMobileMenu(false);
  };

  // ================= SEARCH RESULTS =================
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return products
      .filter((product) => product.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, products]);

  const goToProduct = (product: Product) => {
    router.push(`/product/${product.slug || product._id}`);

    setQuery("");
    setOpenSearch(false);
  };

  const submitSearch = () => {
    const value = query.trim();

    if (!value) return;

    router.push(`/search?q=${encodeURIComponent(value)}`);

    setQuery("");
    setOpenSearch(false);
    setMobileMenu(false);
  };

  const toggleSearch = () => {
    setOpenSearch((v) => {
      if (v) setQuery("");
      return !v;
    });
  };

  const searchResultsPanel = (mobile: boolean) =>
    results.length > 0 ? (
      <div
        className={`overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100 ${
          mobile ? "absolute left-4 right-4 top-[72px] z-50" : "absolute left-8 right-8 top-14 z-50"
        }`}
      >
        {results.map((product) => (
          <button
            key={product._id}
            onClick={() => goToProduct(product)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-neutral-50"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-10 w-10 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                <PackageSearch size={16} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black">
                {product.name}
              </p>

              <p className="text-xs text-neutral-500">
                {formatRupiah(product.price)}
              </p>
            </div>
          </button>
        ))}

        <button
          onClick={submitSearch}
          className="flex w-full items-center justify-center gap-2 border-t border-neutral-100 px-4 py-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-black"
        >
          <Search size={14} />

          Lihat semua hasil untuk &quot;{query.trim()}&quot;
        </button>
      </div>
    ) : null;

  const cartButton = (
    <button
      onClick={() => router.push("/orders")}
      className="relative flex items-center justify-center"
      aria-label="Lihat pesanan saya"
    >
      <span className="relative flex items-center justify-center">
        {orderCount > 0 && (
          <span
            className="absolute inset-0 rounded-full animate-[ocilPing_1.2s_ease-out_infinite]"
            style={{
              border: "2px solid rgba(0,0,0,0.35)",
            }}
          />
        )}

        <ShoppingBag
          size={20}
          className="transition-transform duration-300 hover:scale-110"
        />
      </span>

      {orderCount > 0 && (
        <span
          key={orderCount}
          className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white animate-[ocilPop_0.4s_ease-out]"
        >
          {orderCount > 99 ? "99+" : orderCount}
        </span>
      )}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white/60 backdrop-blur-lg z-50">
      {/* MOBILE MENU */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden absolute top-20 left-0 w-full backdrop-blur-2xl bg-white/60 opacity-0 pointer-events-none"
      >
        {menus.map((menu) => (
          <button
            key={menu.title}
            onClick={() => handleScroll(menu.id)}
            className={`block w-full text-left px-6 py-5 text-black ${
              menu.brand ? "text-xl font-bold tracking-tight" : ""
            }`}
          >
            {menu.brand ? storeName : menu.title}
          </button>
        ))}
      </div>

      {/* NAV */}
      <div className="w-full h-full flex items-center justify-between px-5 lg:px-10">
        {/* LEFT */}
        <div className="flex items-center gap-10 lg:gap-6">
          {/* LOGO */}
          <div
            id="nav-logo"
            style={{ opacity: 0, visibility: "hidden" }}
            className="flex items-center"
          ></div>

          {/* DESKTOP MENU */}
          <div
            ref={desktopMenuRef}
            className="hidden lg:flex items-stretch gap-5 lg:gap-6 xl:gap-8 text-base"
          >
            {menus.map((menu) => (
              <button
                key={menu.title}
                onClick={() => handleScroll(menu.id)}
                className={`relative group flex items-center whitespace-nowrap text-black ${
                  menu.brand
                    ? "text-2xl lg:text-[26px] font-bold tracking-tight"
                    : ""
                }`}
              >
                {menu.brand ? storeName : menu.title}

                {/* UNDERLINE */}
                <span
                  className={`
                    absolute left-0 bottom-0
                    h-[2px] bg-black
                    transition-all duration-300 ease-out
                    group-hover:w-full
                    ${
                      active === menu.id
                        ? "w-full"
                        : "w-0"
                    }
                  `}
                />
              </button>
            ))}
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-8 pointer-events-none">
          <div
            ref={desktopSearchRef}
            className={`relative flex items-center h-11 rounded-full px-5 ${glass}`}
            style={{ opacity: 0, transform: "scaleX(0)" }}
          >
            <input
              ref={desktopInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search Product..."
              aria-label="Cari produk"
              className="w-full bg-transparent outline-none text-sm text-black"
            />

            {searchResultsPanel(false)}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* DESKTOP ICON */}
          <div className="hidden lg:flex items-center gap-6 text-black">
            <button onClick={toggleSearch} aria-label="Cari produk" aria-expanded={openSearch}>
              <Search size={20} />
            </button>

            {cartButton}

            <button onClick={() => router.push("/admin/login")} aria-label="Masuk admin">
              <User
                size={20}
                className="transition-transform duration-300 hover:scale-110"
              />
            </button>
          </div>

          {/* MOBILE ICON */}
          {!mobileMenu && (
            <div className="flex lg:hidden items-center gap-3 text-black">
              <button onClick={toggleSearch} aria-label="Cari produk" aria-expanded={openSearch}>
                <Search size={20} />
              </button>

              {cartButton}

              <button onClick={() => router.push("/admin/login")} aria-label="Masuk admin">
                <User
                  size={20}
                  className="transition-transform duration-300 hover:scale-110"
                />
              </button>
            </div>
          )}

          {/* MENU / X */}
          <button
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label={mobileMenu ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-black"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {!mobileMenu && (
        <div className="lg:hidden overflow-visible pointer-events-none">
          <div
            ref={mobileSearchRef}
            className={`relative flex items-center h-12 mx-4 my-3 px-4 rounded-full bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]`}
            style={{ opacity: 0, transform: "scaleX(0)" }}
          >
            <input
              ref={mobileInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search Product..."
              aria-label="Cari produk"
              className="w-full outline-none text-sm bg-transparent text-black"
            />

            {searchResultsPanel(true)}
          </div>
        </div>
      )}
    </nav>
  );
}
