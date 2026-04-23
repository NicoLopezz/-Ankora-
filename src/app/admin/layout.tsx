"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { GrainientBackground } from "@/components/effects/GrainientBackground";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Hide document scrollbar while inside admin (same class as dashboard)
  useEffect(() => {
    document.documentElement.classList.add("dashboard-no-scrollbar");
    return () => {
      document.documentElement.classList.remove("dashboard-no-scrollbar");
    };
  }, []);

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#1f0a08] text-[#ddcfc9]">
        {/* Ambient */}
        <GrainientBackground />
        <div className="pointer-events-none fixed inset-0 z-[1] bg-grid-pattern opacity-15" aria-hidden />
        {/* Admin stripe — thin gold top border cue */}
        <div className="pointer-events-none fixed top-0 left-0 right-0 z-[70] h-0.5 bg-gradient-to-r from-transparent via-[#D4A45A] to-transparent opacity-60" aria-hidden />

        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div
          className={cn(
            "relative z-[2] transition-[padding] duration-300 ease-in-out",
            collapsed ? "md:pl-[56px]" : "md:pl-60"
          )}
        >
          <AdminTopbar />
          <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
