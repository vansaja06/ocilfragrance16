"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollToPlugin);

const menus = [
  { title: "Shop", id: "shop" },
  { title: "Just In", id: "just-in" },
  { title: "Collection", id: "collection" },
  { title: "Subscribe", id: "subscribe" },
  { title: "About", id: "footer" },
];

const glass =
  "backdrop-blur-2xl bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]";

export default function Navbar() {
  const router = useRouter();

  const [openSearch, setOpenSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
      setOpenSearch(false);

      gsap.fromTo(
        mobileMenuRef.current,
        { y: -40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          pointerEvents: "auto",
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

  // ================= SCROLL =================
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    gsap.to(window, {
      duration: 1,
      ease: "power3.inOut",
      scrollTo: { y: el, offsetY: 80 },
    });

    setMobileMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white/60 backdrop-blur-lg z-50">
      {/* MOBILE MENU */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden absolute top-20 left-0 w-full backdrop-blur-2xl bg-white/10 opacity-0 pointer-events-none"
      >
        {menus.map((menu) => (
          <button
            key={menu.title}
            onClick={() => handleScroll(menu.id)}
            className="block w-full text-left px-6 py-5 text-black"
          >
            {menu.title}
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
            className="hidden lg:flex items-center gap-8 text-[15px]"
          >
            {menus.map((menu) => (
              <button
                key={menu.title}
                onClick={() => handleScroll(menu.id)}
                className="relative group text-black"
              >
                {menu.title}

                {/* UNDERLINE */}
                <span
                  className="
                    absolute left-0 -bottom-[2px]
                    h-[2px] w-0 bg-black
                    transition-all duration-300 ease-out
                    group-hover:w-full
                  "
                />
              </button>
            ))}
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-8">
          <div
            ref={desktopSearchRef}
            className={`flex items-center h-11 rounded-full px-5 ${glass}`}
            style={{ opacity: 0, transform: "scaleX(0)" }}
          >
            <input
              ref={desktopInputRef}
              placeholder="Search Product..."
              className="w-full bg-transparent outline-none text-sm text-black"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* DESKTOP ICON */}
          <div className="hidden lg:flex items-center gap-6 text-black">
            <button onClick={() => setOpenSearch((v) => !v)}>
              <Search size={20} />
            </button>
            <ShoppingBag size={20} />
            <button onClick={() => router.push("/admin/login")}>
              <User
                size={20}
                className="transition-transform duration-300 hover:scale-110"
              />
            </button>
          </div>

          {/* MOBILE ICON */}
          {!mobileMenu && (
            <div className="flex lg:hidden items-center gap-3 text-black">
              <button onClick={() => setOpenSearch((v) => !v)}>
                <Search size={20} />
              </button>
              <ShoppingBag size={20} />
              <button onClick={() => router.push("/admin/login")}>
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
            className="lg:hidden flex items-center justify-center w-10 h-10 text-black"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {!mobileMenu && (
        <div className="lg:hidden overflow-hidden">
          <div
            ref={mobileSearchRef}
            className={`flex items-center h-12 mx-4 my-3 px-4 rounded-full ${glass}`}
            style={{ opacity: 0, transform: "scaleX(0)" }}
          >
            <input
              ref={mobileInputRef}
              placeholder="Search Product..."
              className="w-full outline-none text-sm bg-transparent text-black"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
