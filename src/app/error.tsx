"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-neutral-900">Terjadi Kesalahan</h1>
      <p className="mt-4 max-w-md text-neutral-500">
        Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Coba Lagi
      </button>
    </div>
  );
}
