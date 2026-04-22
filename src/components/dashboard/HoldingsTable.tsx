import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { dummyAssets, formatUsd, categoryLabel, statusLabel, categoryEmoji } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  activo: "bg-[#ddcfc9]/[0.06] text-[#b8a99e]",
  en_rendimiento: "bg-[#D4A45A]/10 text-[#D4A45A]",
  proximo_pago: "bg-[#D4A45A]/15 text-[#e0b76a]",
  en_fondeo: "bg-[#ddcfc9]/[0.04] text-[#b8a99e]",
};

export function HoldingsTable() {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 md:px-6">
        <div>
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Mis activos tokenizados</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">{dummyAssets.length} posiciones activas</p>
        </div>
        <Link
          href="/dashboard/activos"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#D4A45A] transition-colors hover:text-[#e0b76a]"
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-x-auto px-6 pb-5 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ddcfc9]/[0.06] text-left">
              <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Activo</th>
              <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Tokens</th>
              <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Invertido</th>
              <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Valor actual</th>
              <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">YTD</th>
              <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {dummyAssets.map((a) => {
              const positive = a.ytdReturnPct >= 0;
              return (
                <tr
                  key={a.id}
                  className="group border-b border-[#ddcfc9]/[0.04] last:border-0 transition-colors hover:bg-[#ddcfc9]/[0.02]"
                >
                  <td className="py-4 pr-3">
                    <Link
                      href={`/dashboard/activos/${a.slug}`}
                      className="block transition-colors group-hover:text-[#D4A45A]"
                    >
                      <p className="font-medium text-[#ddcfc9] group-hover:text-[#D4A45A]">
                        <span className="mr-1.5">{categoryEmoji[a.category]}</span>
                        {a.name}
                      </p>
                      <p className="text-xs text-[#b8a99e]">
                        {categoryLabel[a.category]} · {a.location}
                      </p>
                    </Link>
                  </td>
                  <td className="py-4 pr-3 font-mono text-xs text-[#ddcfc9]">
                    {a.tokensOwned.toLocaleString("es-AR")}
                    <span className="text-[#b8a99e]"> / {a.tokensTotal.toLocaleString("es-AR")}</span>
                  </td>
                  <td className="py-4 pr-3 tabular-nums text-[#b8a99e]">{formatUsd(a.investedUsd)}</td>
                  <td className="py-4 pr-3 tabular-nums font-semibold text-[#ddcfc9]">
                    {formatUsd(a.currentValueUsd)}
                  </td>
                  <td className="py-4 pr-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                        positive ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
                      )}
                    >
                      {positive ? "+" : ""}
                      {a.ytdReturnPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        statusStyles[a.status]
                      )}
                    >
                      {statusLabel[a.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-2 px-4 pb-4 md:hidden">
        {dummyAssets.map((a) => {
          const positive = a.ytdReturnPct >= 0;
          return (
            <div
              key={a.id}
              className="rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#ddcfc9]">{a.name}</p>
                  <p className="text-[11px] text-[#b8a99e]">
                    {categoryLabel[a.category]} · {a.tokensOwned} tokens
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums flex-shrink-0",
                    positive ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
                  )}
                >
                  {positive ? "+" : ""}
                  {a.ytdReturnPct.toFixed(1)}%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[#b8a99e]">Valor</span>
                <span className="tabular-nums font-semibold text-[#ddcfc9]">
                  {formatUsd(a.currentValueUsd)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
