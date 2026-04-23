"use client";

import { Search, ShieldCheck } from "lucide-react";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#D4A45A]/[0.12] bg-[#1f0a08]/90 px-4 backdrop-blur-md md:px-8">
      {/* Left: search + admin badge */}
      <div className="flex flex-1 items-center gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A45A]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Super Admin
        </div>
        <div className="relative hidden w-full max-w-sm md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8a99e]" />
          <input
            type="text"
            placeholder="Buscar clientes, proyectos, operaciones…"
            className="h-9 w-full rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] pl-9 pr-3 text-sm text-[#ddcfc9] placeholder:text-[#b8a99e] focus:border-[#D4A45A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4A45A]/20"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <RoleSwitcher />
        <div className="flex items-center gap-2.5 rounded-full border border-[#D4A45A]/20 bg-[#D4A45A]/[0.05] px-1 py-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A] to-[#a87a3a] text-[11px] font-bold text-[#3a1410]">
            AK
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold text-[#ddcfc9]">Ankora Team</span>
            <span className="font-mono text-[10px] text-[#b8a99e]">admin@ankora.io</span>
          </div>
        </div>
      </div>
    </header>
  );
}
