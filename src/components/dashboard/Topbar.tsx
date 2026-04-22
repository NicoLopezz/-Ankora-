"use client";

import { Bell, Search, ShieldCheck } from "lucide-react";
import { dummyUser } from "@/lib/dummy-data";

export function Topbar() {
  const initials = dummyUser.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#ddcfc9]/[0.06] bg-[#3a1410]/90 px-4 backdrop-blur-md md:px-8">
      {/* Search */}
      <div className="relative hidden w-full max-w-sm md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8a99e]" />
        <input
          type="text"
          placeholder="Buscar activos, transacciones…"
          className="h-9 w-full rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] pl-9 pr-3 text-sm text-[#ddcfc9] placeholder:text-[#b8a99e] focus:border-[#D4A45A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4A45A]/20"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-full border border-[#D4A45A]/30 bg-[#D4A45A]/5 px-3 py-1 text-xs font-medium text-[#D4A45A] sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Regulado por CNV
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#ddcfc9]/10 text-[#b8a99e] transition-colors hover:border-[#D4A45A]/40 hover:text-[#D4A45A]">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#D4A45A]" />
        </button>
        <div className="flex items-center gap-2.5 rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] px-1 py-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A] to-[#a87a3a] text-[11px] font-bold text-[#3a1410]">
            {initials}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold text-[#ddcfc9]">{dummyUser.name}</span>
            <span className="font-mono text-[10px] text-[#b8a99e]">{dummyUser.walletShort}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
