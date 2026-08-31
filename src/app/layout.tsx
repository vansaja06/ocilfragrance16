import type { Metadata, Viewport } from "next";
import "./globals.css";
import SafePointerCapture from "@/components/SafePointerCapture";
import { HomeDataProvider } from "@/context/HomeDataContext";

export const metadata: Metadata = {
  title: "ocilfragrance",
  description:
    "A fragrance brand that embodies the essence of nature and elegance, offering a unique olfactory experience.",
  metadataBase: new URL("https://ocilfragrance16.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="bg-white antialiased">
        <HomeDataProvider>
          <SafePointerCapture />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2 focus:text-white focus:outline-none"
          >
            Skip to content
          </a>
          <main id="main-content">
            {children}
          </main>
        </HomeDataProvider>
      </body>
    </html>
  );
}
