"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Rocket,
  X,
  ShieldCheck,
  Wallet,
  FileText,
  Coins,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  done: boolean;
  cta?: { label: string; href: string };
}

const STORAGE_KEY = "ankora.onboarding.dismissed";

export function OnboardingChecklist() {
  // In prod these come from user state; here they're static dummy.
  const steps: Step[] = [
    {
      id: "kyc",
      icon: ShieldCheck,
      title: "Verificá tu identidad (KYC)",
      description: "DNI + prueba de domicilio + origen de fondos",
      done: true,
    },
    {
      id: "wallet",
      icon: Wallet,
      title: "Conectá tu wallet",
      description: "MetaMask en Polygon para custodia de tus tokens",
      done: true,
    },
    {
      id: "profile",
      icon: FileText,
      title: "Completá tu perfil de inversor",
      description: "Requerido por CNV para sugerirte proyectos acordes",
      done: true,
      cta: { label: "Revisar", href: "/dashboard/perfil" },
    },
    {
      id: "first-investment",
      icon: Coins,
      title: "Primera inversión",
      description: "Sumá tu primer activo al portfolio — desde USD 500",
      done: true,
      cta: { label: "Explorar", href: "/dashboard/marketplace" },
    },
    {
      id: "2fa",
      icon: Lock,
      title: "Activá 2FA",
      description: "Segundo factor para operaciones sensibles",
      done: false,
      cta: { label: "Activar ahora", href: "/dashboard/perfil" },
    },
  ];

  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : "1";
    setDismissed(stored === "1");
  }, []);

  const doneCount = steps.filter((s) => s.done).length;
  const total = steps.length;
  const pct = (doneCount / total) * 100;
  const allDone = doneCount === total;

  const dismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!mounted || dismissed || allDone) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#D4A45A]/25 bg-[#D4A45A]/[0.04] p-5 animate-fade-in-up md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#D4A45A]/15 text-[#D4A45A]">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#ddcfc9]">Terminá de configurar tu cuenta</h3>
            <p className="mt-0.5 text-xs text-[#b8a99e]">
              {doneCount} de {total} pasos completados · te falta poco
            </p>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 rounded-lg p-1 text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
          aria-label="Ocultar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="relative mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[10px] tabular-nums text-[#D4A45A]">
          {pct.toFixed(0)}%
        </p>
      </div>

      {/* Steps */}
      <ul className="relative mt-4 space-y-2">
        {steps.map((s) => (
          <li
            key={s.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-all",
              s.done
                ? "border-[#D4A45A]/20 bg-[#D4A45A]/[0.04]"
                : "border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02]"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                s.done ? "bg-[#D4A45A]/15 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
              )}
            >
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  s.done ? "text-[#ddcfc9]/70 line-through" : "text-[#ddcfc9]"
                )}
              >
                {s.title}
              </p>
              <p className="text-[11px] text-[#b8a99e]">{s.description}</p>
            </div>
            {!s.done && s.cta && (
              <Link
                href={s.cta.href}
                className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#D4A45A] px-3 py-1.5 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a]"
              >
                {s.cta.label} <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
