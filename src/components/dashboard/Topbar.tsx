"use client";

import { Search, Copy } from "lucide-react";
import { dummyUser } from "@/lib/dummy-data";
import { useToast } from "@/components/ui/toast";
import { NotificationCenter } from "./NotificationCenter";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";

export function Topbar() {
  const toast = useToast();
  const initials = dummyUser.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText("0x7f3a2b4c1d9e8f6a5b4c3d2e1f0a9b8c7d6e5b21e");
      toast.show({
        variant: "success",
        title: "Wallet copiada",
        description: dummyUser.walletShort,
      });
    } catch {
      toast.show({ variant: "error", title: "No se pudo copiar", description: "Intentá de nuevo" });
    }
  };

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
        <RoleSwitcher />
        <button
          onClick={copyWallet}
          title="Copiar wallet"
          className="group flex items-center gap-2.5 rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] px-1 py-1 pr-3 transition-colors hover:border-[#D4A45A]/30"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A] to-[#a87a3a] text-[11px] font-bold text-[#3a1410]">
            {initials}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold text-[#ddcfc9]">{dummyUser.name}</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#b8a99e] group-hover:text-[#D4A45A]">
              {dummyUser.walletShort}
              <Copy className="h-2.5 w-2.5" />
            </span>
          </div>
        </button>
        <NotificationCenter />
      </div>
    </header>
  );
}
