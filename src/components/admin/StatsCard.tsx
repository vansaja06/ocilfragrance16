"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: number;
  description?: string;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  change,
  description,
  loading,
}: StatsCardProps) {
  const hasTrend = change !== undefined;

  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="flex min-h-[180px] flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            {title}
          </p>

          {loading ? (
            <div className="mt-4 h-9 w-28 animate-pulse rounded-full bg-neutral-100" />
          ) : (
            <h2 className="mt-3 text-4xl font-light tracking-tight text-black">
              {value}
            </h2>
          )}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f8f8]">
          {icon}
        </div>
      </div>

      {/* Footer */}
      {!loading && hasTrend && (
        <div className="mt-6 flex items-center gap-2 text-sm">
          {isPositive ? (
            <TrendingUp size={16} className="text-emerald-600" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}

          <span
            className={
              isPositive
                ? "font-medium text-emerald-600"
                : "font-medium text-red-500"
            }
          >
            {Math.abs(change ?? 0)}%
          </span>

          <span className="text-neutral-500">{description}</span>
        </div>
      )}

      {!loading && !hasTrend && description && (
        <div className="mt-6 text-sm text-neutral-500">{description}</div>
      )}
    </div>
  );
}
