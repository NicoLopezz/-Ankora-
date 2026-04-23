import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  TrendingUp,
  Wallet,
  CalendarClock,
  Percent,
  FileText,
  Download,
  CheckCircle2,
  Circle,
  ShieldCheck,
} from "lucide-react";
import {
  getAssetBySlug,
  formatUsd,
  formatDateAr,
  categoryLabel,
  statusLabel,
} from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { AssetActions } from "@/components/dashboard/AssetActions";
import { AssetGallery } from "@/components/dashboard/AssetGallery";

const statusStyles: Record<string, string> = {
  activo: "bg-[#ddcfc9]/[0.06] text-[#b8a99e]",
  en_rendimiento: "bg-[#D4A45A]/10 text-[#D4A45A]",
  proximo_pago: "bg-[#D4A45A]/15 text-[#e0b76a]",
  en_fondeo: "bg-[#ddcfc9]/[0.04] text-[#b8a99e]",
};

const docTypeLabel: Record<string, string> = {
  contrato: "Contrato",
  reporte: "Reporte",
  legal: "Legal",
  fiscal: "Fiscal",
};

type RouteParams = Promise<{ slug: string }>;

export default async function AssetDetailPage({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const asset = getAssetBySlug(slug);
  if (!asset) notFound();

  const ownership = (asset.tokensOwned / asset.tokensTotal) * 100;
  const totalDividends = asset.dividendHistory.reduce((s, d) => s + d.amountUsd, 0);
  const positive = asset.ytdReturnPct >= 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <Link
        href="/dashboard/activos"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#b8a99e] transition-colors hover:text-[#D4A45A]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a mis activos
      </Link>

      {/* Hero with project image */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[#ddcfc9]/[0.08] p-6 animate-fade-in-up md:p-10 min-h-[360px]"
        style={{ background: `linear-gradient(135deg, ${asset.heroColor}, #3a1410 80%)` }}
      >
        {asset.imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={asset.imageUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3a1410] via-[#3a1410]/85 to-[#3a1410]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a1410]/80 via-transparent to-[#3a1410]/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.15),transparent_55%)]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[320px] w-[320px] rounded-full bg-[#6d2721] opacity-30 blur-[120px]" />
        <div className="relative flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-[#ddcfc9] backdrop-blur-sm">
            {categoryLabel[asset.category]}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
              statusStyles[asset.status]
            )}
          >
            {statusLabel[asset.status]}
          </span>
          {asset.vintage && (
            <span className="inline-flex items-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/5 px-2.5 py-1 text-xs font-medium text-[#D4A45A]">
              Cosecha {asset.vintage}
            </span>
          )}
        </div>

        <h1 className="relative mt-5 max-w-3xl text-3xl font-bold text-[#ddcfc9] md:text-5xl">
          {asset.name.split(" — ")[0]}
          {asset.name.includes(" — ") && (
            <span className="gradient-text-gold"> — {asset.name.split(" — ")[1]}</span>
          )}
        </h1>
        <div className="relative mt-2 flex items-center gap-1.5 text-sm text-[#ddcfc9]/70">
          <MapPin className="h-4 w-4" />
          {asset.location}
        </div>
        <p className="relative mt-5 max-w-2xl text-sm leading-relaxed text-[#ddcfc9]/80 md:text-base">
          {asset.description}
        </p>

        <div className="relative mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4A45A]/30 bg-[#D4A45A]/5 px-3 py-1.5 text-xs font-medium text-[#D4A45A]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Fiduciario: {asset.fiduciario}
          </span>
          <span className="inline-flex items-center rounded-lg border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] px-3 py-1.5 text-xs text-[#b8a99e]">
            Operador: {asset.operator}
          </span>
          <span className="inline-flex items-center rounded-lg border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.03] px-3 py-1.5 text-xs text-[#b8a99e]">
            Regulado por CNV
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-100 md:grid-cols-4 md:gap-4">
        <StatBlock
          icon={Wallet}
          label="Tu inversión"
          value={formatUsd(asset.investedUsd)}
          sub={`${asset.tokensOwned} tokens`}
        />
        <StatBlock
          icon={TrendingUp}
          label="Valor actual"
          value={formatUsd(asset.currentValueUsd)}
          sub={
            <span className={positive ? "text-[#D4A45A]" : "text-[#b8a99e]"}>
              {positive ? "+" : ""}
              {asset.ytdReturnPct.toFixed(1)}% YTD
            </span>
          }
        />
        <StatBlock
          icon={Percent}
          label="APY objetivo"
          value={`${asset.targetApyPct.toFixed(1)}%`}
          sub="Anual"
        />
        <StatBlock
          icon={CalendarClock}
          label="Próximo pago"
          value={asset.nextDividendDate ? formatDateAr(asset.nextDividendDate) : "—"}
          sub={`${formatUsd(totalDividends, { decimals: 2 })} acum.`}
        />
      </div>

      {/* Ownership card */}
      <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6 animate-fade-in-up animate-delay-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#ddcfc9]">Tu participación</h3>
            <p className="mt-0.5 text-xs text-[#b8a99e]">
              {asset.tokensOwned.toLocaleString("es-AR")} de{" "}
              {asset.tokensTotal.toLocaleString("es-AR")} tokens emitidos
            </p>
          </div>
          <span className="text-2xl font-bold text-[#D4A45A] tabular-nums">
            {ownership.toFixed(3)}%
          </span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a]"
            style={{ width: `${Math.min(ownership * 20, 100)}%` }}
          />
        </div>
        <div className="mt-5">
          <AssetActions asset={asset} />
        </div>
      </div>

      {/* Two-column: dividends + milestones */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-300 lg:grid-cols-2 lg:gap-6">
        {/* Dividend history */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Historial de dividendos</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">
            Total recibido: {formatUsd(totalDividends, { decimals: 2 })}
          </p>
          <ul className="mt-5 space-y-2">
            {asset.dividendHistory.map((d, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#ddcfc9]">{d.periodLabel}</p>
                  <p className="text-[11px] text-[#b8a99e]">{formatDateAr(d.date)}</p>
                </div>
                <span className="text-sm font-semibold text-[#D4A45A] tabular-nums">
                  +{formatUsd(d.amountUsd, { decimals: 2 })}
                </span>
              </li>
            ))}
            {asset.dividendHistory.length === 0 && (
              <p className="text-xs text-[#b8a99e]">Sin dividendos todavía.</p>
            )}
          </ul>
        </div>

        {/* Milestones */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Hitos del proyecto</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">Cronología operativa</p>
          <ol className="mt-5 space-y-4">
            {asset.milestones.map((m, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {m.completed ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#D4A45A]" />
                  ) : (
                    <Circle className="h-5 w-5 flex-shrink-0 text-[#b8a99e]" />
                  )}
                  {i < asset.milestones.length - 1 && (
                    <span
                      className={cn(
                        "mt-1 w-px flex-1",
                        m.completed ? "bg-[#D4A45A]/40" : "bg-[#ddcfc9]/10"
                      )}
                    />
                  )}
                </div>
                <div className="pb-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      m.completed ? "text-[#ddcfc9]" : "text-[#b8a99e]"
                    )}
                  >
                    {m.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#b8a99e]">{m.description}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#b8a99e]/70">
                    {formatDateAr(m.date)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Gallery */}
      {asset.gallery && asset.gallery.length > 0 && <AssetGallery items={asset.gallery} />}

      {/* Documents */}
      <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6 animate-fade-in-up animate-delay-400">
        <h3 className="text-sm font-semibold text-[#ddcfc9]">Documentos</h3>
        <p className="mt-0.5 text-xs text-[#b8a99e]">Contratos, reportes y certificados</p>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {asset.documents.map((doc) => (
            <button
              key={doc.id}
              className="group flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-3 text-left transition-colors hover:border-[#D4A45A]/30 cursor-pointer"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#ddcfc9]">{doc.name}</p>
                <p className="text-[11px] text-[#b8a99e]">
                  {docTypeLabel[doc.type]} · {formatDateAr(doc.date)} ·{" "}
                  {(doc.sizeKb / 1024).toFixed(1)} MB
                </p>
              </div>
              <Download className="h-4 w-4 flex-shrink-0 text-[#b8a99e] transition-colors group-hover:text-[#D4A45A]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#ddcfc9] tabular-nums md:text-xl">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-[#b8a99e]">{sub}</p>}
    </div>
  );
}
