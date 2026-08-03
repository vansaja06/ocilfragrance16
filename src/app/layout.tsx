import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ocilfragrance",
  description:
    "A fragrance brand that embodies the essence of nature and elegance, offering a unique olfactory experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {children}
      </body>
    </html>
  );
}