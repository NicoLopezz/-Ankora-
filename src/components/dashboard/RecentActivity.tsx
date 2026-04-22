import { ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";
import { dummyTransactions, formatUsd, formatDateAr } from "@/lib/dummy-data";

const typeConfig = {
  compra: { icon: ArrowUpRight, label: "Compra", tone: "text-[#ddcfc9]" },
  dividendo: { icon: Coins, label: "Dividendo", tone: "text-[#D4A45A]" },
  venta: { icon: ArrowDownLeft, label: "Venta", tone: "text-[#b8a99e]" },
} as const;

export function RecentActivity() {
  const recent = dummyTransactions.slice(0, 5);
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 md:p-6">
      <div>
        <h3 className="text-sm font-semibold text-[#ddcfc9]">Actividad reciente</h3>
        <p className="mt-0.5 text-xs text-[#b8a99e]">Últimos movimientos</p>
      </div>

      <ul className="mt-4 space-y-1">
        {recent.map((tx) => {
          const cfg = typeConfig[tx.type];
          const Icon = cfg.icon;
          const sign = tx.type === "dividendo" ? "+" : tx.type === "compra" ? "" : "-";
          return (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#ddcfc9]/[0.02]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04]">
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
                className={`flex-shrink-0 text-sm font-semibold tabular-nums ${
                  tx.type === "dividendo" ? "text-[#D4A45A]" : "text-[#ddcfc9]"
                }`}
              >
                {sign}
                {formatUsd(tx.amountUsd, { decimals: 2 })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
