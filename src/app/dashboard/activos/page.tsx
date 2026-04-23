import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  dummyAssets,
  formatUsd,
  categoryLabel,
  statusLabel,
} from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  activo: "bg-[#ddcfc9]/[0.06] text-[#b8a99e]",
  en_rendimiento: "bg-[#D4A45A]/10 text-[#D4A45A]",
  proximo_pago: "bg-[#D4A45A]/15 text-[#e0b76a]",
  en_fondeo: "bg-[#ddcfc9]/[0.04] text-[#b8a99e]",
};

export default function ActivosPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Portfolio"
        title="Mis activos"
        description={`${dummyAssets.length} proyectos tokenizados · tokens ERC-20 en Polygon`}
      />

      <div className="grid gap-4 animate-fade-in-up animate-delay-100 md:grid-cols-2">
        {dummyAssets.map((a) => {
          const positive = a.ytdReturnPct >= 0;
          const ownership = (a.tokensOwned / a.tokensTotal) * 100;
          return (
            <Link
              key={a.id}
              href={`/dashboard/activos/${a.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:border-[#D4A45A]/40 hover:shadow-[0_16px_48px_rgba(212,164,90,0.08)]"
            >
              {/* Hero strip with project image */}
              <div
                className="relative h-36 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${a.heroColor}, #3a1410)` }}
              >
                {a.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={a.imageUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-[cubic-bezier(0.6,0.01,0.05,0.95)] group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a1410] via-[#3a1410]/60 to-[#3a1410]/20" />
                <div className="absolute inset-0 bg-grid-pattern opacity-25" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.15),transparent_60%)]" />
                <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-[#ddcfc9] backdrop-blur-sm">
                  {categoryLabel[a.category]}
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm",
                      statusStyles[a.status]
                    )}
                  >
                    {statusLabel[a.status]}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] text-[#ddcfc9]/80">
                  <MapPin className="h-3 w-3" />
                  {a.location}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-[#ddcfc9] group-hover:text-[#D4A45A] transition-colors">
                    {a.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#b8a99e] transition-all group-hover:text-[#D4A45A] group-hover:translate-x-1" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Invertido</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#ddcfc9] tabular-nums">
                      {formatUsd(a.investedUsd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Valor</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#ddcfc9] tabular-nums">
                      {formatUsd(a.currentValueUsd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">YTD</p>
                    <p
                      className={cn(
                        "mt-0.5 text-sm font-semibold tabular-nums",
                        positive ? "text-[#D4A45A]" : "text-[#b8a99e]"
                      )}
                    >
                      {positive ? "+" : ""}
                      {a.ytdReturnPct.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Ownership */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-[#b8a99e]">
                    <span>
                      {a.tokensOwned.toLocaleString("es-AR")} /{" "}
                      {a.tokensTotal.toLocaleString("es-AR")} tokens
                    </span>
                    <span className="tabular-nums">{ownership.toFixed(2)}% del proyecto</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a]"
                      style={{ width: `${Math.min(ownership * 20, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
