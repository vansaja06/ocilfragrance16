"use client";

import { ArrowRight } from "lucide-react";

export default function Subscribe() {
  return (
    <section id="subscribe" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
          Join the Ocilfragrance16 Universe
        </h2>

        {/* Description */}
        <p className="mt-4 sm:mt-6 text-gray-500 leading-7 sm:leading-8 max-w-xl mx-auto text-sm sm:text-base">
          Be the first to know about exclusive collections,
          runway updates, special promotions,
          and sustainable fashion initiatives.
        </p>

        {/* Form */}
        <form className="mt-10 sm:mt-12 flex justify-center">
          <div
            className="
              flex flex-col sm:flex-row
              w-full
              max-w-xl
              rounded-2xl sm:rounded-full
              border border-gray-200
              overflow-hidden
              shadow-sm
            "
          >
            <input
              type="email"
              placeholder="Your email address"
              className="
                flex-1
                px-5 sm:px-7
                py-4 sm:py-5
                outline-none
                text-sm
                bg-white
              "
            />

            <button
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6 sm:px-8
                py-4 sm:py-5
                bg-black
                text-white
                font-medium
                hover:bg-neutral-800
                transition
                w-full sm:w-auto
              "
            >
              Subscribe
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}