"use client";

export default function LoadingBlock({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8">
      <div className="mb-6 h-6 w-48 animate-pulse rounded-full bg-neutral-100" />

      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-neutral-100 pb-4 last:border-none last:pb-0"
          >
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-neutral-100" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-neutral-100" />

              <div className="h-3 w-1/4 animate-pulse rounded-full bg-neutral-100" />
            </div>

            <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
