import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label?: string };
  accent?: "gold" | "cream" | "muted";
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend, accent = "gold" }: KpiCardProps) {
  const trendPositive = trend && trend.value >= 0;
  const iconTone =
    accent === "gold"
      ? "bg-[#D4A45A]/10 text-[#D4A45A]"
      : accent === "cream"
        ? "bg-[#ddcfc9]/10 text-[#ddcfc9]"
        : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:border-[#D4A45A]/30 hover:shadow-[0_12px_40px_rgba(212,164,90,0.08)]">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#D4A45A]/0 blur-2xl transition-all duration-500 ease-in-out group-hover:bg-[#D4A45A]/10" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">{title}</p>
          <p className="text-2xl font-semibold tabular-nums text-[#ddcfc9] md:text-[26px]">{value}</p>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
                    trendPositive
                      ? "bg-[#D4A45A]/10 text-[#D4A45A]"
                      : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
                  )}
                >
                  {trendPositive ? "+" : ""}
                  {trend.value.toFixed(1)}%
                </span>
              )}
              {subtitle && <span className="text-[#b8a99e]">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0", iconTone)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
