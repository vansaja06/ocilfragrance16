"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  label,
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
          {label}
        </p>

        <h1 className="mt-2 text-4xl font-light tracking-tight text-black lg:text-5xl">
          {title}
        </h1>

        {subtitle && <p className="mt-3 text-neutral-500">{subtitle}</p>}
      </div>

      {action}
    </section>
  );
}
