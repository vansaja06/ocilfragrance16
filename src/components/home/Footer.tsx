"use client";

import { Mail, Phone, MapPin } from "lucide-react";

import { useHomeData } from "@/context/HomeDataContext";

export default function Footer() {
  const { settings: homeSettings } = useHomeData();

  const settings = homeSettings ?? {};

  const storeName = settings.storeName?.trim() || "Ocil Fragrance 16";
  const tagline = settings.tagline?.trim() || "";

  const socials = [
    { label: "Instagram", href: settings.instagram || "" },
    { label: "Twitter", href: settings.twitter || "" },
    { label: "Facebook", href: settings.facebook || "" },
  ].filter((s) => s.href);

  return (
    <footer id="footer" className="bg-[#fafafa] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {storeName}
            </h2>

            <p className="text-gray-600 leading-7 sm:leading-8 text-sm max-w-xs">
              {tagline || "Progressive fashion for the conscious individual. Crafted with technical precision and ethereal aesthetics."}
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              {settings.address && (
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  {settings.address}
                </p>
              )}

              {settings.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0" />
                  {settings.phone}
                </p>
              )}

              {settings.email && (
                <p className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0" />
                  {settings.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase mb-4 sm:mb-6 font-semibold text-gray-800">
              About
            </h4>

            <ul className="space-y-3 sm:space-y-4 text-gray-600 text-sm list-none p-0">
              <li>Journal</li>
              <li>Sustainability</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase mb-4 sm:mb-6 font-semibold text-gray-800">
              Support
            </h4>

            <ul className="space-y-3 sm:space-y-4 text-gray-600 text-sm list-none p-0">
              <li>Shipping &amp; Returns</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[3px] uppercase mb-4 sm:mb-6 font-semibold text-gray-800">
              Connect
            </h4>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-gray-600 text-sm">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-black"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 sm:mt-20 border-t border-gray-200 pt-6 sm:pt-8">

          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; 2026 {storeName}. All rights reserved.
          </p>

          <div className="flex gap-6 sm:gap-8 text-xs text-gray-500">
            <span>Terms</span>
            <span>Cookie Policy</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
