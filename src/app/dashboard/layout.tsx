"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#3a1410] text-[#ddcfc9]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 ambient-gold" aria-hidden />
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-30" aria-hidden />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={cn(
          "relative transition-[padding] duration-300 ease-in-out",
          collapsed ? "md:pl-[56px]" : "md:pl-60"
        )}
      >
        <Topbar />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
