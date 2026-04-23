import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Ban,
  Flag,
  TrendingUp,
  Activity,
  Coins,
  Copy,
} from "lucide-react";
import { getClientById } from "@/lib/admin-data";
import { formatUsd, formatDateAr } from "@/lib/dummy-data";
import type { ClientKycStatus } from "@/types/ankora";
import { cn } from "@/lib/utils";

const kycConfig: Record<
  ClientKycStatus,
  { label: string; tone: string; icon: React.ComponentType<{ className?: string }> }
> = {
  verified: { label: "Verificado", tone: "border-[#D4A45A]/40 bg-[#D4A45A]/[0.08] text-[#D4A45A]", icon: ShieldCheck },
  pending: { label: "Pendiente", tone: "border-[#ddcfc9]/15 bg-[#ddcfc9]/[0.04] text-[#b8a99e]", icon: Clock },
  rejected: { label: "Rechazado", tone: "border-red-400/30 bg-red-400/[0.08] text-red-300", icon: Ban },
  expired: { label: "Vencido", tone: "border-red-400/30 bg-red-400/[0.08] text-red-300", icon: ShieldAlert },
};

type Params = Promise<{ id: string }>;

export default async function AdminClientDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const k = kycConfig[client.kycStatus];
  const KIcon = k.icon;
  const profit = client.portfolioValueUsd - client.totalInvestedUsd;
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6 md:space-y-8">
      <Link
        href="/admin/usuarios"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#b8a99e] transition-colors hover:text-[#D4A45A]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a clientes
      </Link>

      {/* Identity */}
      <div className="relative overflow-hidden rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4A45A] to-[#a87a3a] text-xl font-bold text-[#3a1410] shadow-lg md:h-20 md:w-20 md:text-2xl">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-[#ddcfc9] md:text-2xl">{client.name}</h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  k.tone
                )}
              >
                <KIcon className="h-3 w-3" />
                {k.label}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#ddcfc9]/[0.06] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[#ddcfc9]">
                {client.tier}
              </span>
              {client.pep && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#D4A45A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#D4A45A]">
                  PEP
                </span>
              )}
              {client.flagged && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                  <Flag className="h-2.5 w-2.5" />
                  UIF
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[#b8a99e]">
              ID{" "}
              <span className="font-mono text-[#ddcfc9]">{client.id}</span> · Cliente desde{" "}
              {formatDateAr(client.joinedAt)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 flex-wrap gap-2">
            {client.kycStatus === "pending" && (
              <>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-4 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Aprobar KYC
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-4 py-2 text-xs font-medium text-red-300 transition-colors hover:bg-red-400/[0.08]">
                  <Ban className="h-3.5 w-3.5" />
                  Rechazar
                </button>
              </>
            )}
            {client.kycStatus === "verified" && (
              <button className="inline-flex items-center gap-1.5 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]">
                <Flag className="h-3.5 w-3.5" />
                Flag UIF
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-5 grid gap-2.5 md:mt-6 md:grid-cols-4">
          <InfoRow icon={Mail} label="Email" value={client.email} />
          <InfoRow icon={Phone} label="Wallet" value={client.walletShort} mono />
          <InfoRow icon={Globe} label="País" value={client.country} />
          <InfoRow
            icon={CalendarDays}
            label="Última actividad"
            value={formatDateAr(client.lastActivityAt)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Stat icon={Wallet} label="Portfolio actual" value={formatUsd(client.portfolioValueUsd)} accent />
        <Stat icon={Coins} label="Invertido" value={formatUsd(client.totalInvestedUsd)} />
        <Stat
          icon={TrendingUp}
          label="Ganancia"
          value={formatUsd(profit)}
          sub={`${client.ytdReturnPct >= 0 ? "+" : ""}${client.ytdReturnPct.toFixed(1)}% YTD`}
        />
        <Stat icon={Activity} label="Transacciones" value={client.txCount.toString()} />
      </div>

      {/* Placeholder: breakdown */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Composición del portfolio</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">
            Detalle por activo disponible en próxima iteración
          </p>
          <div className="mt-5 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#ddcfc9]/10 text-xs text-[#b8a99e]">
            (Breakdown por activo — mock)
          </div>
        </div>

        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Actividad reciente</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">Últimas operaciones del cliente</p>
          <div className="mt-5 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#ddcfc9]/10 text-xs text-[#b8a99e]">
            (Feed de transacciones — mock)
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-4 py-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04] text-[#b8a99e]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">{label}</p>
        <p className={cn("truncate text-sm text-[#ddcfc9]", mono && "font-mono")}>{value}</p>
      </div>
      {mono && <Copy className="h-3.5 w-3.5 flex-shrink-0 text-[#b8a99e]" />}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          accent ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums text-[#ddcfc9]">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-[#b8a99e]">{sub}</p>}
    </div>
  );
}
