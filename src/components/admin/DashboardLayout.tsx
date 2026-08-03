"use client";

import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}

        <Sidebar />

        {/* Main */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}

          <div className="px-6 pt-8 lg:px-12">
            <Header />
          </div>

          {/* Content */}

          <main className="flex-1 px-6 pb-12 lg:px-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
