"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f8f8] text-neutral-400">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-light tracking-tight text-black">
        {title}
      </h3>

      {description && (
        <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
