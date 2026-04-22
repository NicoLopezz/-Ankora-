"use client";

import { useState } from "react";
import { MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  dummyOpportunities,
  formatUsd,
  formatDateAr,
  categoryLabel,
  categoryEmoji,
} from "@/lib/dummy-data";
import type { AssetCategory } from "@/types/ankora";
import { cn } from "@/lib/utils";

const filters: { key: "todos" | AssetCategory; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "viñedo", label: "Viñedos" },
  { key: "inmueble", label: "Inmuebles" },
  { key: "tierra", label: "Tierras" },
  { key: "energia", label: "Energía" },
  { key: "marina", label: "Marina" },
];

export default function MarketplacePage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("todos");

  const filtered =
    filter === "todos"
      ? dummyOpportunities
      : dummyOpportunities.filter((o) => o.category === filter);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Marketplace"
        title="Oportunidades abiertas"
        description="Activos reales tokenizados · desde USD 500 · regulados por CNV"
        action={
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A45A]/30 bg-[#D4A45A]/5 px-3 py-1.5 text-xs font-medium text-[#D4A45A]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Fiduciario: Allaria SA
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up animate-delay-100">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
                active
                  ? "border-[#D4A45A] bg-[#D4A45A]/10 text-[#D4A45A]"
                  : "border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] text-[#b8a99e] hover:border-[#ddcfc9]/30 hover:text-[#ddcfc9]"
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-200 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((op) => (
          <article
            key={op.id}
            className="group flex flex-col rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:border-[#D4A45A]/40 hover:shadow-[0_16px_48px_rgba(212,164,90,0.08)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9]/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#b8a99e]">
                <span>{categoryEmoji[op.category]}</span>
                {categoryLabel[op.category]}
              </span>
              {op.highlight && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D4A45A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#D4A45A]">
                  <Sparkles className="h-2.5 w-2.5" />
                  {op.highlight}
                </span>
              )}
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#ddcfc9] transition-colors group-hover:text-[#D4A45A]">
              {op.name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#b8a99e]">
              <MapPin className="h-3 w-3" />
              {op.location}
            </p>

            {/* APY */}
            <div className="mt-5 flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-[#D4A45A] tabular-nums">
                  {op.targetApyPct.toFixed(1)}%
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">APY objetivo</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#ddcfc9] tabular-nums">
                  {formatUsd(op.minInvestmentUsd)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Mínimo</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-[#b8a99e]">
                <span>Fondeo {op.fundedPct}%</span>
                <span>Cierra {formatDateAr(op.closingDate)}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a]"
                  style={{ width: `${op.fundedPct}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-full bg-[#ddcfc9] py-2 text-xs font-semibold text-[#3a1410] transition-opacity hover:opacity-90">
                Invertir
              </button>
              <button className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]">
                Detalle
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-[#b8a99e]">
          No hay oportunidades en esta categoría por ahora.
        </p>
      )}
    </div>
  );
}
