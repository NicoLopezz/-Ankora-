"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Shield, User, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "cliente" | "admin";

/**
 * Demo-only role switcher. In prod this is a JWT claim; here we pivot on
 * the current route to show which "view" the user is in.
 */
export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentRole: Role = pathname?.startsWith("/admin") ? "admin" : "cliente";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const switchTo = (role: Role) => {
    setOpen(false);
    router.push(role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
          currentRole === "admin"
            ? "border-[#D4A45A]/40 bg-[#D4A45A]/[0.08] text-[#D4A45A] hover:bg-[#D4A45A]/[0.12]"
            : "border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] text-[#ddcfc9] hover:border-[#ddcfc9]/20"
        )}
      >
        {currentRole === "admin" ? (
          <>
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </>
        ) : (
          <>
            <User className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cliente</span>
          </>
        )}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fade-in-up">
          <div className="border-b border-[#ddcfc9]/[0.06] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
              Cambiar vista (demo)
            </p>
            <p className="mt-0.5 text-[11px] text-[#b8a99e]">
              En prod, esto se define por permisos
            </p>
          </div>
          <button
            onClick={() => switchTo("cliente")}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#ddcfc9]/[0.04]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.06] text-[#ddcfc9]">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#ddcfc9]">Panel Cliente</p>
              <p className="text-[11px] text-[#b8a99e]">Vista del inversor final</p>
            </div>
            {currentRole === "cliente" && <Check className="h-4 w-4 flex-shrink-0 text-[#D4A45A]" />}
          </button>
          <button
            onClick={() => switchTo("admin")}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#ddcfc9]/[0.04]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#ddcfc9]">Panel Admin</p>
              <p className="text-[11px] text-[#b8a99e]">Super-admin Ankora</p>
            </div>
            {currentRole === "admin" && <Check className="h-4 w-4 flex-shrink-0 text-[#D4A45A]" />}
          </button>
        </div>
      )}
    </div>
  );
}
