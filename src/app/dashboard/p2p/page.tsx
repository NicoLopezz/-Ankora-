"use client";

import { useState } from "react";
import {
  ArrowDownUp,
  Clock,
  ShieldCheck,
  TrendingUp,
  Users,
  Activity,
  Loader2,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Dialog } from "@/components/dashboard/Dialog";
import { P2PTakeOrderDialog } from "@/components/dashboard/P2PTakeOrderDialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useToast } from "@/components/ui/toast";
import {
  dummyP2POrders,
  dummyAssets,
  formatUsd,
  formatTimeAgo,
  getP2PStats,
} from "@/lib/dummy-data";
import type { P2POrder } from "@/types/ankora";
import { cn } from "@/lib/utils";

type SideFilter = "sell" | "buy";
type AssetFilter = "all" | string;

export default function P2PPage() {
  const toast = useToast();
  const [side, setSide] = useState<SideFilter>("sell");
  const [assetFilter, setAssetFilter] = useState<AssetFilter>("all");
  const [takeOrder, setTakeOrder] = useState<P2POrder | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);

  const stats = getP2PStats();

  // React Compiler (Next 16) memoizes derivations automatically — no useMemo needed.
  const visible = dummyP2POrders
    .filter((o) => !o.isOwn)
    .filter((o) => o.side === side)
    .filter((o) => o.status === "open" || o.status === "partial")
    .filter((o) => assetFilter === "all" || o.assetSlug === assetFilter)
    .sort((a, b) =>
      side === "sell" ? a.pricePerToken - b.pricePerToken : b.pricePerToken - a.pricePerToken
    );

  const myOrders = dummyP2POrders.filter(
    (o) => o.isOwn && (o.status === "open" || o.status === "partial")
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Mercado P2P"
        title="Secundario entre inversores"
        description="Comprá y vendé tokens directo con otros inversores KYC-verificados · liquidación en Polygon"
        action={
          <button
            onClick={() => setPublishOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-4 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a]"
          >
            <Plus className="h-3.5 w-3.5" />
            Publicar orden
          </button>
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-100 md:grid-cols-4 md:gap-4">
        <StatTile icon={Activity} label="Órdenes activas" value={stats.openOrders.toString()} />
        <StatTile
          icon={TrendingUp}
          label="Volumen 24h"
          value={formatUsd(stats.volume24hUsd)}
          accent
        />
        <StatTile
          icon={Users}
          label="Operadores online"
          value={stats.operatorsOnline.toString()}
        />
        <StatTile icon={ArrowDownUp} label="Spread medio" value={`${stats.spreadPct.toFixed(1)}%`} />
      </div>

      {/* Mis órdenes activas */}
      {myOrders.length > 0 && (
        <div className="animate-fade-in-up animate-delay-200 rounded-2xl border border-[#D4A45A]/30 bg-[#D4A45A]/[0.04] p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#ddcfc9]">Tus órdenes activas</h3>
              <p className="mt-0.5 text-xs text-[#b8a99e]">
                {myOrders.length} {myOrders.length === 1 ? "orden publicada" : "órdenes publicadas"}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {myOrders.map((o) => (
              <OwnOrderRow
                key={o.id}
                order={o}
                onCancel={() => {
                  toast.show({
                    variant: "success",
                    title: `Orden ${o.id} cancelada`,
                    description: `${o.tokens - o.tokensFilled} tokens devueltos a tu wallet`,
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="animate-fade-in-up animate-delay-300 space-y-3">
        {/* Side toggle */}
        <div className="inline-flex rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] p-1">
          <button
            onClick={() => setSide("sell")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              side === "sell"
                ? "bg-[#D4A45A] text-[#3a1410]"
                : "text-[#b8a99e] hover:text-[#ddcfc9]"
            )}
          >
            Ofertas de venta
          </button>
          <button
            onClick={() => setSide("buy")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              side === "buy"
                ? "bg-[#D4A45A] text-[#3a1410]"
                : "text-[#b8a99e] hover:text-[#ddcfc9]"
            )}
          >
            Ofertas de compra
          </button>
        </div>

        {/* Asset filter */}
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={assetFilter === "all"}
            onClick={() => setAssetFilter("all")}
            label="Todos los activos"
          />
          {dummyAssets.map((a) => (
            <FilterChip
              key={a.slug}
              active={assetFilter === a.slug}
              onClick={() => setAssetFilter(a.slug)}
              label={a.shortName}
            />
          ))}
        </div>
      </div>

      {/* Orderbook */}
      <div className="animate-fade-in-up animate-delay-400 rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16]">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ddcfc9]/[0.06] text-left">
                <th className="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  {side === "sell" ? "Vendedor" : "Comprador"}
                </th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Activo
                </th>
                <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Tokens
                </th>
                <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Precio/token
                </th>
                <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  vs mercado
                </th>
                <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Total
                </th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Publicado
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => {
                const available = o.tokens - o.tokensFilled;
                const total = available * o.pricePerToken;
                const deltaPct = ((o.pricePerToken - o.marketPricePerToken) / o.marketPricePerToken) * 100;
                const deltaPositive = deltaPct >= 0;
                return (
                  <tr
                    key={o.id}
                    className="border-b border-[#ddcfc9]/[0.04] last:border-0 transition-colors hover:bg-[#ddcfc9]/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A]/20 to-[#a87a3a]/20 text-[10px] font-bold text-[#D4A45A]">
                          {o.userHandle.includes(".")
                            ? o.userHandle.slice(0, 2).toUpperCase()
                            : "0x"}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 font-mono text-xs text-[#ddcfc9]">
                            {o.userHandle}
                            {o.userVerified && (
                              <ShieldCheck
                                className="h-3 w-3 text-[#D4A45A]"
                              />
                            )}
                          </p>
                          <p className="text-[10px] text-[#b8a99e]">{o.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[#ddcfc9]">{o.assetName}</td>
                    <td className="px-3 py-4 text-right font-mono text-xs text-[#ddcfc9]">
                      {available.toLocaleString("es-AR")}
                      {o.status === "partial" && (
                        <span className="ml-1 text-[#b8a99e]">
                          /{o.tokens.toLocaleString("es-AR")}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-right font-semibold tabular-nums text-[#ddcfc9]">
                      {formatUsd(o.pricePerToken, { decimals: 2 })}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                          deltaPositive
                            ? "bg-[#D4A45A]/10 text-[#D4A45A]"
                            : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
                        )}
                      >
                        {deltaPositive ? "+" : ""}
                        {deltaPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right tabular-nums text-[#ddcfc9]">
                      {formatUsd(total, { decimals: 2 })}
                    </td>
                    <td className="px-3 py-4 text-xs text-[#b8a99e]">
                      {formatTimeAgo(o.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setTakeOrder(o)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ease-in-out hover:scale-105",
                          side === "sell"
                            ? "bg-[#ddcfc9] text-[#3a1410] hover:bg-white"
                            : "bg-[#D4A45A] text-[#3a1410] hover:bg-[#e0b76a]"
                        )}
                      >
                        {side === "sell" ? "Comprar" : "Vender"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-2 p-3 md:hidden">
          {visible.map((o) => {
            const available = o.tokens - o.tokensFilled;
            const total = available * o.pricePerToken;
            const deltaPct = ((o.pricePerToken - o.marketPricePerToken) / o.marketPricePerToken) * 100;
            const deltaPositive = deltaPct >= 0;
            return (
              <div
                key={o.id}
                className="rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-mono text-xs text-[#ddcfc9]">
                      {o.userHandle}
                      {o.userVerified && <ShieldCheck className="h-3 w-3 text-[#D4A45A]" />}
                    </p>
                    <p className="truncate text-sm text-[#ddcfc9]">{o.assetName}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums flex-shrink-0",
                      deltaPositive
                        ? "bg-[#D4A45A]/10 text-[#D4A45A]"
                        : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
                    )}
                  >
                    {deltaPositive ? "+" : ""}
                    {deltaPct.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Tokens</p>
                    <p className="font-mono text-[#ddcfc9]">{available}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Precio</p>
                    <p className="tabular-nums text-[#ddcfc9]">
                      {formatUsd(o.pricePerToken, { decimals: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Total</p>
                    <p className="tabular-nums font-semibold text-[#ddcfc9]">
                      {formatUsd(total, { decimals: 2 })}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#b8a99e]">{formatTimeAgo(o.createdAt)}</span>
                  <button
                    onClick={() => setTakeOrder(o)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      side === "sell"
                        ? "bg-[#ddcfc9] text-[#3a1410]"
                        : "bg-[#D4A45A] text-[#3a1410]"
                    )}
                  >
                    {side === "sell" ? "Comprar" : "Vender"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <EmptyState
            icon={Clock}
            title="Sin órdenes disponibles"
            description="No hay operaciones abiertas para este filtro. Publicá tu propia orden y se matchea en cuanto aparezca una contraparte."
            className="border-0 bg-transparent"
          />
        )}
      </div>

      {/* Regulatory footer */}
      <div className="flex items-center gap-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-5 py-3 text-xs text-[#b8a99e]">
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-[#D4A45A]" />
        <span>
          Operaciones liquidadas vía <span className="text-[#ddcfc9]">ALyC fiduciario</span> regulado por CNV.
          Solo inversores con KYC vigente pueden operar. Fee marketplace: 1% por operación.
        </span>
      </div>

      {/* Take order dialog (realistic 6-step regulated P2P flow) */}
      <P2PTakeOrderDialog
        order={takeOrder}
        onOpenChange={(open) => {
          if (!open) setTakeOrder(null);
        }}
      />

      {/* Publish order dialog */}
      <PublishOrderDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-4">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          accent ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-[#ddcfc9] md:text-xl">{value}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-[#D4A45A] bg-[#D4A45A]/10 text-[#D4A45A]"
          : "border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] text-[#b8a99e] hover:border-[#ddcfc9]/30 hover:text-[#ddcfc9]"
      )}
    >
      {label}
    </button>
  );
}

function OwnOrderRow({ order, onCancel }: { order: P2POrder; onCancel: () => void }) {
  const available = order.tokens - order.tokensFilled;
  const total = available * order.pricePerToken;
  const fillPct = (order.tokensFilled / order.tokens) * 100;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-3">
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
          order.side === "sell"
            ? "bg-[#D4A45A]/10 text-[#D4A45A]"
            : "bg-[#ddcfc9]/10 text-[#ddcfc9]"
        )}
      >
        {order.side === "sell" ? "VENTA" : "COMPRA"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-[#ddcfc9]">
          {order.assetName} · <span className="font-mono text-xs">{order.id}</span>
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#b8a99e]">
          <span>{available} tokens × {formatUsd(order.pricePerToken, { decimals: 2 })}</span>
          <span className="tabular-nums">= {formatUsd(total, { decimals: 2 })}</span>
          {order.status === "partial" && (
            <span className="text-[#D4A45A]">{fillPct.toFixed(0)}% ejecutado</span>
          )}
        </div>
        {order.status === "partial" && (
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a]"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        )}
      </div>
      <button
        onClick={onCancel}
        className="flex-shrink-0 rounded-full border border-[#ddcfc9]/20 px-3 py-1.5 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
      >
        <X className="inline h-3 w-3" /> Cancelar
      </button>
    </div>
  );
}


// ====== Publish Order Dialog ======
function PublishOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const toast = useToast();
  const [side, setSide] = useState<"sell" | "buy">("sell");
  const [slug, setSlug] = useState(dummyAssets[0].slug);
  const [tokens, setTokens] = useState(1);
  const [price, setPrice] = useState(500);
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");

  const reset = () => {
    setSide("sell");
    setSlug(dummyAssets[0].slug);
    setTokens(1);
    setPrice(500);
    setStatus("idle");
  };

  const handleConfirm = () => {
    setStatus("pending");
    const toastId = toast.show({
      variant: "loading",
      title: "Publicando orden",
      description: "En el libro del mercado secundario…",
    });
    setTimeout(() => {
      const orderId = `P2P-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
      setStatus("done");
      toast.update(toastId, {
        variant: "success",
        title: "Orden publicada",
        description: `#${orderId} · ${tokens} tokens a ${formatUsd(price, { decimals: 2 })} c/u`,
      });
    }, 1400);
  };

  const handleOpen = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const total = tokens * price;
  const asset = dummyAssets.find((a) => a.slug === slug);

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpen}
      title="Publicar orden P2P"
      description="Se agrega al libro del mercado secundario"
      footer={
        status === "idle" ? (
          <>
            <button
              onClick={() => handleOpen(false)}
              className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={tokens < 1 || price <= 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a] disabled:opacity-50 disabled:hover:scale-100"
            >
              Publicar
            </button>
          </>
        ) : status === "done" ? (
          <button
            onClick={() => handleOpen(false)}
            className="rounded-full bg-[#ddcfc9] px-5 py-2 text-xs font-semibold text-[#3a1410] hover:bg-white"
          >
            Listo
          </button>
        ) : null
      }
    >
      {status === "idle" && (
        <div className="space-y-5">
          {/* Side */}
          <div className="inline-flex rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] p-1">
            <button
              onClick={() => setSide("sell")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                side === "sell" ? "bg-[#D4A45A] text-[#3a1410]" : "text-[#b8a99e]"
              )}
            >
              Vender
            </button>
            <button
              onClick={() => setSide("buy")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                side === "buy" ? "bg-[#D4A45A] text-[#3a1410]" : "text-[#b8a99e]"
              )}
            >
              Comprar
            </button>
          </div>

          {/* Asset */}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
              Activo
            </label>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] px-4 py-3 text-sm text-[#ddcfc9] focus:border-[#D4A45A]/40 focus:outline-none"
            >
              {dummyAssets.map((a) => (
                <option key={a.slug} value={a.slug} className="bg-[#4a1a16]">
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                Tokens
              </label>
              <input
                type="number"
                value={tokens}
                min={1}
                onChange={(e) => setTokens(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-2 w-full rounded-2xl border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] px-4 py-3 text-right text-lg font-semibold tabular-nums text-[#ddcfc9] focus:border-[#D4A45A]/40 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                Precio / token (USD)
              </label>
              <input
                type="number"
                value={price}
                min={1}
                onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="mt-2 w-full rounded-2xl border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] px-4 py-3 text-right text-lg font-semibold tabular-nums text-[#ddcfc9] focus:border-[#D4A45A]/40 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          {asset && (
            <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
              <Row label="Activo" value={asset.shortName} strong />
              <Row label="Tipo" value={side === "sell" ? "Orden de venta" : "Orden de compra"} />
              <Row label="Total orden" value={formatUsd(total, { decimals: 2 })} />
            </div>
          )}
        </div>
      )}

      {status === "pending" && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10">
            <Loader2 className="h-7 w-7 animate-spin text-[#D4A45A]" />
          </div>
          <p className="text-base font-semibold text-[#ddcfc9]">Publicando orden</p>
        </div>
      )}

      {status === "done" && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10 animate-pulse-gold">
            <CheckCircle2 className="h-8 w-8 text-[#D4A45A]" />
          </div>
          <p className="text-base font-semibold text-[#ddcfc9]">Orden publicada</p>
          <p className="text-xs text-[#b8a99e]">Ya está visible en el libro P2P</p>
        </div>
      )}
    </Dialog>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#b8a99e]">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          strong ? "text-base font-semibold text-[#ddcfc9]" : muted ? "text-[#b8a99e]" : "text-[#ddcfc9]"
        )}
      >
        {value}
      </span>
    </div>
  );
}
