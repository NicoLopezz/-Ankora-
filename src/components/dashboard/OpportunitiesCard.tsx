import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { dummyOpportunities, categoryLabel, formatUsd, formatDateAr } from "@/lib/dummy-data";

export function OpportunitiesCard() {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A]/10 px-2.5 py-1 text-[11px] font-medium text-[#D4A45A]">
            <Sparkles className="h-3 w-3" />
            Oportunidades abiertas
          </div>
          <h3 className="mt-3 text-sm font-semibold text-[#ddcfc9]">
            Sumá nuevos activos a tu portfolio
          </h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">Desde USD 500 · regulado por CNV</p>
        </div>
        <Link
          href="/dashboard/marketplace"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#D4A45A] transition-colors hover:text-[#e0b76a]"
        >
          Marketplace <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {dummyOpportunities.map((op) => (
          <div
            key={op.id}
            className="group rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4 transition-all duration-300 ease-in-out hover:-translate-y-[1px] hover:border-[#D4A45A]/40 hover:bg-[#ddcfc9]/[0.04]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#ddcfc9]">{op.name}</p>
                <p className="text-xs text-[#b8a99e]">
                  {categoryLabel[op.category]} · {op.location}
                </p>
                {op.highlight && (
                  <p className="mt-1.5 text-[11px] font-medium text-[#D4A45A]">{op.highlight}</p>
                )}
              </div>
              <div className="flex flex-shrink-0 flex-col items-end leading-tight">
                <span className="text-base font-semibold text-[#ddcfc9] tabular-nums">
                  {op.targetApyPct.toFixed(1)}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#b8a99e]">APY objetivo</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-3">
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

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-[#b8a99e]">
                Mín. {formatUsd(op.minInvestmentUsd)}
              </span>
              <button className="inline-flex items-center gap-1 rounded-full bg-[#ddcfc9] px-3.5 py-1.5 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-105 hover:bg-white">
                Invertir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
