"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Coins, Download, ExternalLink, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { dummyTransactions, formatUsd, formatDateAr } from "@/lib/dummy-data";
import type { Transaction } from "@/types/ankora";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  Transaction["type"],
  { icon: React.ComponentType<{ className?: string }>; label: string; tone: string }
> = {
  compra: { icon: ArrowUpRight, label: "Compra", tone: "text-[#ddcfc9]" },
  dividendo: { icon: Coins, label: "Dividendo", tone: "text-[#D4A45A]" },
  venta: { icon: ArrowDownLeft, label: "Venta", tone: "text-[#b8a99e]" },
};

const filters: { key: "todos" | Transaction["type"]; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "compra", label: "Compras" },
  { key: "dividendo", label: "Dividendos" },
  { key: "venta", label: "Ventas" },
];

export default function TransaccionesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("todos");

  const filtered =
    filter === "todos"
      ? dummyTransactions
      : dummyTransactions.filter((t) => t.type === filter);

  const totalDividendos = dummyTransactions
    .filter((t) => t.type === "dividendo")
    .reduce((s, t) => s + t.amountUsd, 0);
  const totalCompras = dummyTransactions
    .filter((t) => t.type === "compra")
    .reduce((s, t) => s + t.amountUsd, 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Historial"
        title="Transacciones"
        description="Compras, ventas y dividendos on-chain"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]">
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up animate-delay-100 md:gap-4">
        <SummaryBlock
          label="Total invertido"
          value={formatUsd(totalCompras)}
          sub={`${dummyTransactions.filter((t) => t.type === "compra").length} compras`}
        />
        <SummaryBlock
          label="Dividendos cobrados"
          value={formatUsd(totalDividendos, { decimals: 2 })}
          sub={`${dummyTransactions.filter((t) => t.type === "dividendo").length} pagos`}
          highlight
        />
        <SummaryBlock
          label="Movimientos"
          value={dummyTransactions.length.toString()}
          sub="Total histórico"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
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

      {/* Table */}
      <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] animate-fade-in-up animate-delay-200">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ddcfc9]/[0.06] text-left">
                <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Fecha</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Tipo</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Activo</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Tokens</th>
                <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Monto</th>
                <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">Hash</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const cfg = typeConfig[tx.type];
                const Icon = cfg.icon;
                const sign = tx.type === "dividendo" ? "+" : tx.type === "venta" ? "-" : "";
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-[#ddcfc9]/[0.04] last:border-0 transition-colors hover:bg-[#ddcfc9]/[0.02]"
                  >
                    <td className="px-6 py-4 text-[#b8a99e]">{formatDateAr(tx.date)}</td>
                    <td className="px-3 py-4">
                      <div className="inline-flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04]">
                          <Icon className={`h-3.5 w-3.5 ${cfg.tone}`} />
                        </div>
                        <span className="text-[#ddcfc9]">{cfg.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      {tx.assetSlug ? (
                        <Link
                          href={`/dashboard/activos/${tx.assetSlug}`}
                          className="text-[#ddcfc9] transition-colors hover:text-[#D4A45A]"
                        >
                          {tx.assetName}
                        </Link>
                      ) : (
                        <span className="text-[#ddcfc9]">{tx.assetName}</span>
                      )}
                    </td>
                    <td className="px-3 py-4 font-mono text-xs text-[#b8a99e]">
                      {tx.tokens ? tx.tokens.toLocaleString("es-AR") : "—"}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-4 text-right font-semibold tabular-nums",
                        tx.type === "dividendo" ? "text-[#D4A45A]" : "text-[#ddcfc9]"
                      )}
                    >
                      {sign}
                      {formatUsd(tx.amountUsd, { decimals: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      {tx.txHashShort ? (
                        <button className="inline-flex items-center gap-1 font-mono text-[11px] text-[#b8a99e] transition-colors hover:text-[#D4A45A]">
                          {tx.txHashShort}
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="space-y-1 p-3 md:hidden">
          {filtered.map((tx) => {
            const cfg = typeConfig[tx.type];
            const Icon = cfg.icon;
            const sign = tx.type === "dividendo" ? "+" : tx.type === "venta" ? "-" : "";
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-[#ddcfc9]/[0.02]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04]">
                    <Icon className={`h-4 w-4 ${cfg.tone}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#ddcfc9]">{tx.assetName}</p>
                    <p className="text-[11px] text-[#b8a99e]">
                      {cfg.label} · {formatDateAr(tx.date)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "flex-shrink-0 text-sm font-semibold tabular-nums",
                    tx.type === "dividendo" ? "text-[#D4A45A]" : "text-[#ddcfc9]"
                  )}
                >
                  {sign}
                  {formatUsd(tx.amountUsd, { decimals: 2 })}
                </span>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon={Receipt}
            title="Sin movimientos en esta categoría"
            description="Probá cambiar el filtro o hacé tu primera operación"
            action={{ label: "Explorar marketplace", href: "/dashboard/marketplace" }}
            className="border-0 bg-transparent"
          />
        )}
      </div>
    </div>
  );
}

function SummaryBlock({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-4 md:p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">{label}</p>
      <p
        className={cn(
          "mt-2 text-xl font-semibold tabular-nums md:text-2xl",
          highlight ? "text-[#D4A45A]" : "text-[#ddcfc9]"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-[#b8a99e]">{sub}</p>
    </div>
  );
}
