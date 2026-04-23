"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, ShieldAlert, Clock, Ban, Flag, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { dummyClients } from "@/lib/admin-data";
import { formatUsd, formatDateAr } from "@/lib/dummy-data";
import type { ClientKycStatus } from "@/types/ankora";
import { cn } from "@/lib/utils";

type KycFilter = "all" | ClientKycStatus;

const kycConfig: Record<
  ClientKycStatus,
  { label: string; tone: string; icon: React.ComponentType<{ className?: string }> }
> = {
  verified: { label: "Verificado", tone: "bg-[#D4A45A]/10 text-[#D4A45A]", icon: ShieldCheck },
  pending: { label: "Pendiente", tone: "bg-[#ddcfc9]/[0.06] text-[#b8a99e]", icon: Clock },
  rejected: { label: "Rechazado", tone: "bg-red-400/10 text-red-300", icon: Ban },
  expired: { label: "Vencido", tone: "bg-red-400/10 text-red-300", icon: ShieldAlert },
};

export default function AdminUsuariosPage() {
  const [filter, setFilter] = useState<KycFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = dummyClients
    .filter((c) => filter === "all" || c.kycStatus === filter)
    .filter(
      (c) =>
        query.length === 0 ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => b.portfolioValueUsd - a.portfolioValueUsd);

  const filters: { key: KycFilter; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: dummyClients.length },
    { key: "verified", label: "Verificados", count: dummyClients.filter((c) => c.kycStatus === "verified").length },
    { key: "pending", label: "KYC pendiente", count: dummyClients.filter((c) => c.kycStatus === "pending").length },
    { key: "expired", label: "KYC vencido", count: dummyClients.filter((c) => c.kycStatus === "expired").length },
    { key: "rejected", label: "Rechazados", count: dummyClients.filter((c) => c.kycStatus === "rejected").length },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Clientes"
        description={`${dummyClients.length} inversores registrados en la plataforma`}
      />

      {/* Search */}
      <div className="relative animate-fade-in-up animate-delay-100 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8a99e]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o email…"
          className="h-10 w-full rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] pl-10 pr-3 text-sm text-[#ddcfc9] placeholder:text-[#b8a99e] focus:border-[#D4A45A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4A45A]/20"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up animate-delay-200">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-[#D4A45A] bg-[#D4A45A]/10 text-[#D4A45A]"
                  : "border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] text-[#b8a99e] hover:border-[#ddcfc9]/30 hover:text-[#ddcfc9]"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                  active ? "bg-[#D4A45A]/20 text-[#D4A45A]" : "bg-[#ddcfc9]/10 text-[#b8a99e]"
                )}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] animate-fade-in-up animate-delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ddcfc9]/[0.06] text-left">
                <Th>Cliente</Th>
                <Th>KYC</Th>
                <Th>Tier</Th>
                <Th>País</Th>
                <Th align="right">Portfolio</Th>
                <Th align="right">YTD</Th>
                <Th align="right">Tx</Th>
                <Th>Última actividad</Th>
                <Th>Flags</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const k = kycConfig[c.kycStatus];
                const KIcon = k.icon;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-[#ddcfc9]/[0.04] last:border-0 transition-colors hover:bg-[#ddcfc9]/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/usuarios/${c.id}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A]/20 to-[#a87a3a]/20 text-[10px] font-bold text-[#D4A45A]">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#ddcfc9] group-hover:text-[#D4A45A]">
                            {c.name}
                          </p>
                          <p className="truncate font-mono text-[11px] text-[#b8a99e]">{c.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          k.tone
                        )}
                      >
                        <KIcon className="h-3 w-3" />
                        {k.label}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs capitalize text-[#ddcfc9]">{c.tier}</td>
                    <td className="px-3 py-4 text-xs text-[#b8a99e]">{c.country}</td>
                    <td className="px-3 py-4 text-right font-semibold tabular-nums text-[#ddcfc9]">
                      {c.portfolioValueUsd > 0 ? formatUsd(c.portfolioValueUsd) : "—"}
                    </td>
                    <td className="px-3 py-4 text-right text-xs tabular-nums">
                      {c.portfolioValueUsd > 0 ? (
                        <span className={c.ytdReturnPct >= 0 ? "text-[#D4A45A]" : "text-[#b8a99e]"}>
                          {c.ytdReturnPct >= 0 ? "+" : ""}
                          {c.ytdReturnPct.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[#b8a99e]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-right font-mono text-xs text-[#b8a99e]">
                      {c.txCount}
                    </td>
                    <td className="px-3 py-4 text-xs text-[#b8a99e]">
                      {formatDateAr(c.lastActivityAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {c.pep && (
                          <span
                            title="Persona Expuesta Políticamente"
                            className="inline-flex items-center gap-0.5 rounded-full bg-[#D4A45A]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#D4A45A]"
                          >
                            PEP
                          </span>
                        )}
                        {c.flagged && (
                          <span
                            title="Flagged para revisión UIF"
                            className="inline-flex items-center gap-0.5 rounded-full bg-red-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-300"
                          >
                            <Flag className="h-2.5 w-2.5" />
                            UIF
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState
            icon={Users}
            title="Sin clientes para este filtro"
            description="Ajustá la búsqueda o el estado KYC para ver otros resultados"
            className="border-0 bg-transparent"
          />
        )}
      </div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e] first:pl-6 last:pr-6",
        align === "right" && "text-right"
      )}
    >
      {children}
    </th>
  );
}
