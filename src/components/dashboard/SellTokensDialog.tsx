"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Clock, Zap, Gauge } from "lucide-react";
import { Dialog, Stepper } from "./Dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { formatUsd } from "@/lib/dummy-data";
import type { Asset } from "@/types/ankora";

const STEPS = [
  { id: "order", label: "Orden" },
  { id: "confirm", label: "Confirmar" },
  { id: "result", label: "Resultado" },
];

const MARKETPLACE_FEE_RATE = 0.01; // 1%

type OrderType = "market" | "limit";
type Result =
  | null
  | { status: "pending" }
  | { status: "filled"; usdReceived: number }
  | { status: "listed"; orderId: string }
  | { status: "error"; message: string };

interface Props {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellTokensDialog({ asset, open, onOpenChange }: Props) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [tokens, setTokens] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [limitPrice, setLimitPrice] = useState(0);
  const [result, setResult] = useState<Result>(null);

  useEffect(() => {
    if (open && asset) {
      setStep(0);
      setTokens(1);
      setOrderType("market");
      setLimitPrice(asset.pricePerToken);
      setResult(null);
    }
  }, [open, asset]);

  const math = useMemo(() => {
    if (!asset) return null;
    const marketPrice = asset.pricePerToken * (1 + asset.ytdReturnPct / 100);
    const unitPrice = orderType === "market" ? marketPrice : limitPrice;
    const gross = tokens * unitPrice;
    const fee = gross * MARKETPLACE_FEE_RATE;
    const net = gross - fee;
    return { marketPrice, unitPrice, gross, fee, net };
  }, [asset, tokens, orderType, limitPrice]);

  if (!asset || !math) return null;

  const maxTokens = asset.tokensOwned;

  const handleConfirm = () => {
    setStep(2);
    setResult({ status: "pending" });
    const toastId = toast.show({
      variant: "loading",
      title: orderType === "market" ? "Ejecutando venta" : "Publicando orden",
      description: "Procesando en el mercado secundario…",
    });

    setTimeout(() => {
      if (orderType === "market") {
        const usdReceived = math.net;
        setResult({ status: "filled", usdReceived });
        toast.update(toastId, {
          variant: "success",
          title: "Venta ejecutada",
          description: `${formatUsd(usdReceived, { decimals: 2 })} transferidos a tu wallet`,
        });
      } else {
        const orderId = `ORD-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
        setResult({ status: "listed", orderId });
        toast.update(toastId, {
          variant: "success",
          title: "Orden publicada",
          description: `Orden #${orderId} en libro de órdenes`,
        });
      }
    }, 1600);
  };

  const handleClose = () => {
    if (result && "status" in result && result.status === "pending") return;
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      title={`Vender ${asset.shortName}`}
      description={`Secundario regulado · Fee ${(MARKETPLACE_FEE_RATE * 100).toFixed(0)}%`}
      stepper={<Stepper steps={STEPS} current={step} />}
      footer={
        step === 0 ? (
          <>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
            >
              Cancelar
            </button>
            <button
              onClick={() => setStep(1)}
              disabled={tokens < 1 || tokens > maxTokens || (orderType === "limit" && limitPrice <= 0)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-white disabled:opacity-50 disabled:hover:scale-100"
            >
              Continuar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        ) : step === 1 ? (
          <>
            <button
              onClick={() => setStep(0)}
              className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a]"
            >
              {orderType === "market" ? "Ejecutar venta" : "Publicar orden"}
            </button>
          </>
        ) : result && "status" in result && (result.status === "filled" || result.status === "listed") ? (
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-white"
          >
            Volver al activo
          </button>
        ) : null
      }
    >
      {/* Step 1 — Orden */}
      {step === 0 && (
        <div className="space-y-5">
          {/* Order type toggle */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
              Tipo de orden
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <OrderTypeButton
                active={orderType === "market"}
                onClick={() => setOrderType("market")}
                icon={Zap}
                title="Venta inmediata"
                desc="Al precio de mercado"
              />
              <OrderTypeButton
                active={orderType === "limit"}
                onClick={() => setOrderType("limit")}
                icon={Gauge}
                title="Orden límite"
                desc="Definís el precio mínimo"
              />
            </div>
          </div>

          {/* Tokens */}
          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                Tokens a vender
              </label>
              <span className="text-[11px] text-[#b8a99e]">
                Disponibles:{" "}
                <span className="font-semibold text-[#ddcfc9] tabular-nums">{maxTokens}</span>
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] p-1 pr-3">
              <button
                onClick={() => setTokens((t) => Math.max(1, t - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              >
                −
              </button>
              <input
                type="number"
                value={tokens}
                min={1}
                max={maxTokens}
                onChange={(e) => setTokens(Math.min(maxTokens, Math.max(1, parseInt(e.target.value) || 1)))}
                className="flex-1 bg-transparent text-center text-2xl font-semibold tabular-nums text-[#ddcfc9] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => setTokens((t) => Math.min(maxTokens, t + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: "25%", v: Math.max(1, Math.floor(maxTokens * 0.25)) },
                { label: "50%", v: Math.max(1, Math.floor(maxTokens * 0.5)) },
                { label: "75%", v: Math.max(1, Math.floor(maxTokens * 0.75)) },
                { label: "Máx", v: maxTokens },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => setTokens(q.v)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                    tokens === q.v
                      ? "border-[#D4A45A] bg-[#D4A45A]/10 text-[#D4A45A]"
                      : "border-[#ddcfc9]/10 text-[#b8a99e] hover:border-[#ddcfc9]/30 hover:text-[#ddcfc9]"
                  )}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Limit price input */}
          {orderType === "limit" && (
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                Precio mínimo por token
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] px-4 py-3">
                <span className="text-base font-semibold text-[#b8a99e]">USD</span>
                <input
                  type="number"
                  value={limitPrice}
                  min={1}
                  step={10}
                  onChange={(e) => setLimitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="flex-1 bg-transparent text-right text-xl font-semibold tabular-nums text-[#ddcfc9] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#b8a99e]">
                Precio estimado de mercado: {formatUsd(math.marketPrice, { decimals: 2 })}
              </p>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <Row label="Precio unitario" value={formatUsd(math.unitPrice, { decimals: 2 })} />
            <Row label="Bruto" value={formatUsd(math.gross, { decimals: 2 })} muted />
            <Row
              label="Fee marketplace (1%)"
              value={`−${formatUsd(math.fee, { decimals: 2 })}`}
              muted
            />
            <div className="my-1 border-t border-[#ddcfc9]/[0.06]" />
            <Row
              label={orderType === "market" ? "Recibís" : "Recibís si se ejecuta"}
              value={formatUsd(math.net, { decimals: 2 })}
              strong
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#ddcfc9]/[0.02] px-3 py-2 text-[11px] text-[#b8a99e]">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {orderType === "market"
              ? "Ejecución estimada: inmediata (matching automático)"
              : "Tiempo estimado de matching: 2-6 horas · podés cancelar mientras esté abierta"}
          </div>
        </div>
      )}

      {/* Step 2 — Confirmar */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <Row label="Activo" value={asset.shortName} strong />
            <Row label="Tipo" value={orderType === "market" ? "Venta inmediata" : "Orden límite"} />
            <Row label="Tokens" value={tokens.toString()} />
            <Row label="Precio unitario" value={formatUsd(math.unitPrice, { decimals: 2 })} muted />
            <Row label="Fee marketplace" value={formatUsd(math.fee, { decimals: 2 })} muted />
            <div className="my-1 border-t border-[#ddcfc9]/[0.06]" />
            <Row label="Recibís" value={formatUsd(math.net, { decimals: 2 })} strong />
          </div>

          <div className="rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4 text-xs leading-relaxed text-[#b8a99e]">
            {orderType === "market"
              ? "Tu orden se ejecuta contra la mejor oferta vigente. Los fondos se acreditan en tu wallet al cierre."
              : "Tu orden se publica en el libro del mercado secundario regulado. Se ejecuta cuando aparezca un comprador al precio indicado. Podés cancelarla en cualquier momento."}
          </div>
        </div>
      )}

      {/* Step 3 — Resultado */}
      {step === 2 && (
        <div className="py-4">
          {result && "status" in result && result.status === "pending" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10">
                <Loader2 className="h-7 w-7 animate-spin text-[#D4A45A]" />
              </div>
              <p className="text-base font-semibold text-[#ddcfc9]">
                {orderType === "market" ? "Ejecutando venta" : "Publicando orden"}
              </p>
              <p className="text-xs text-[#b8a99e]">Procesando en el mercado secundario…</p>
            </div>
          )}

          {result && "status" in result && result.status === "filled" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10 animate-pulse-gold">
                <CheckCircle2 className="h-8 w-8 text-[#D4A45A]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#ddcfc9]">Venta ejecutada</p>
                <p className="mt-1 text-xs text-[#b8a99e]">
                  Recibiste{" "}
                  <span className="font-semibold text-[#D4A45A]">
                    {formatUsd(result.usdReceived, { decimals: 2 })}
                  </span>{" "}
                  en tu wallet
                </p>
              </div>
            </div>
          )}

          {result && "status" in result && result.status === "listed" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10 animate-pulse-gold">
                <CheckCircle2 className="h-8 w-8 text-[#D4A45A]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#ddcfc9]">Orden publicada</p>
                <p className="mt-1 text-xs text-[#b8a99e]">
                  Tu orden <span className="font-mono text-[#ddcfc9]">#{result.orderId}</span> está
                  en el libro. Te avisamos cuando se ejecute.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

function OrderTypeButton({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all duration-200",
        active
          ? "border-[#D4A45A] bg-[#D4A45A]/5"
          : "border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] hover:border-[#ddcfc9]/20"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-colors",
          active ? "text-[#D4A45A]" : "text-[#b8a99e] group-hover:text-[#ddcfc9]"
        )}
      />
      <div>
        <p
          className={cn(
            "text-xs font-semibold transition-colors",
            active ? "text-[#D4A45A]" : "text-[#ddcfc9]"
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[10px] text-[#b8a99e]">{desc}</p>
      </div>
    </button>
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
