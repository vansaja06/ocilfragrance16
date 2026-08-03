"use client";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#fafafa] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Logo */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              eXfr
            </h2>

            <p className="text-gray-500 leading-7 sm:leading-8 text-sm max-w-xs">
              Progressive fashion for the conscious individual.
              Crafted with technical precision and ethereal aesthetics.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs tracking-[3px] uppercase mb-4 sm:mb-6">
              About
            </h4>

            <ul className="space-y-3 sm:space-y-4 text-gray-500 text-sm">
              <li className="hover:text-black cursor-pointer transition">
                Journal
              </li>

              <li className="hover:text-black cursor-pointer transition">
                Sustainability
              </li>

              <li className="hover:text-black cursor-pointer transition">
                Careers
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs tracking-[3px] uppercase mb-4 sm:mb-6">
              Support
            </h4>

            <ul className="space-y-3 sm:space-y-4 text-gray-500 text-sm">
              <li className="hover:text-black cursor-pointer transition">
                Shipping & Returns
              </li>

              <li className="hover:text-black cursor-pointer transition">
                Contact Us
              </li>

              <li className="hover:text-black cursor-pointer transition">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs tracking-[3px] uppercase mb-4 sm:mb-6">
              Connect
            </h4>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-gray-500 text-sm">
              <a href="#" className="hover:text-black transition">
                Instagram
              </a>

              <a href="#" className="hover:text-black transition">
                Twitter
              </a>

              <a href="#" className="hover:text-black transition">
                Facebook
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 sm:mt-20 border-t border-gray-200 pt-6 sm:pt-8">

          <p className="text-xs text-gray-400 text-center sm:text-left">
            © 2026 ocilfragrance16. All rights reserved.
          </p>

          <div className="flex gap-6 sm:gap-8 text-xs text-gray-400">
            <a href="#" className="hover:text-black transition">
              Terms
            </a>

            <a href="#" className="hover:text-black transition">
              Cookie Policy
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}