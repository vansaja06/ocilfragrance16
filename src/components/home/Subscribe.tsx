"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

import { api, getErrorMessage } from "@/lib/api";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      toast.error("Masukkan alamat email yang valid");

      return;
    }

    try {
      setSubmitting(true);

      await api.post("/subscribers", { email: normalized, source: "home" });

      toast.success("Berhasil berlangganan. Terima kasih!");

      setEmail("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal berlangganan"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="subscribe"
      className="relative overflow-hidden bg-white pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-44 lg:pb-52"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
          Newsletter
        </p>

        {/* Title */}
        <h2 className="mt-5 text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
          Join the Ocilfragrance16 Universe
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
          Be the first to know about exclusive collections,
          runway updates, special promotions,
          and sustainable fashion initiatives.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-12 flex justify-center sm:mt-14">
          <div
            className="
              flex
              w-full
              max-w-xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              sm:flex-row
              sm:rounded-full
            "
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="
                flex-1
                bg-white
                px-5
                py-5
                text-sm
                outline-none
                sm:px-7
              "
            />

            <button
              type="submit"
              disabled={submitting}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                bg-black
                px-8
                py-5
                font-medium
                text-white
                transition
                hover:bg-neutral-800
                disabled:opacity-60
                sm:w-auto
              "
            >
              {submitting ? "Subscribing…" : "Subscribe"}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* Benefit note */}
        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-neutral-400">
          No spam, just good scents. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
