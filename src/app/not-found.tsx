import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-neutral-900">404</h1>
      <p className="mt-4 max-w-md text-neutral-500">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
