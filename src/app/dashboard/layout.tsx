"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { GrainientBackground } from "@/components/effects/GrainientBackground";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Hide document scrollbar while inside dashboard (landing keeps its own)
  useEffect(() => {
    document.documentElement.classList.add("dashboard-no-scrollbar");
    return () => {
      document.documentElement.classList.remove("dashboard-no-scrollbar");
    };
  }, []);

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#3a1410] text-[#ddcfc9]">
      {/* Animated grainient background (shader from landing) */}
      <GrainientBackground />
      {/* Subtle grid pattern on top for depth */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-grid-pattern opacity-20" aria-hidden />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={cn(
          "relative z-[2] transition-[padding] duration-300 ease-in-out",
          collapsed ? "md:pl-[56px]" : "md:pl-60"
        )}
      >
        <Topbar />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
      </div>
    </ToastProvider>
  );
}
