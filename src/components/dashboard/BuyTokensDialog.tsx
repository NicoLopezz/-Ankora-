"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck, Wallet, Loader2 } from "lucide-react";
import { Dialog, Stepper } from "./Dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { dummyUser, formatUsd } from "@/lib/dummy-data";
import type { Asset } from "@/types/ankora";

const STEPS = [
  { id: "amount", label: "Monto" },
  { id: "confirm", label: "Confirmar" },
  { id: "result", label: "Resultado" },
];

const FEE_RATE = 0.005; // 0.5%

type Result = null | { status: "pending" | "success" | "error"; hash?: string; message?: string };

interface Props {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuyTokensDialog({ asset, open, onOpenChange }: Props) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [tokens, setTokens] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState<Result>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setTokens(1);
      setAccepted(false);
      setResult(null);
    }
  }, [open]);

  const math = useMemo(() => {
    if (!asset) return null;
    const subtotal = tokens * asset.pricePerToken;
    const fee = subtotal * FEE_RATE;
    const total = subtotal + fee;
    const newTokens = asset.tokensOwned + tokens;
    const currentOwnership = (asset.tokensOwned / asset.tokensTotal) * 100;
    const nextOwnership = (newTokens / asset.tokensTotal) * 100;
    return { subtotal, fee, total, newTokens, currentOwnership, nextOwnership };
  }, [tokens, asset]);

  if (!asset || !math) return null;

  const handleConfirm = () => {
    setStep(2);
    setResult({ status: "pending" });
    const toastId = toast.show({
      variant: "loading",
      title: "Firmando transacción",
      description: "Esperando confirmación on-chain…",
    });

    // Dummy: 1.8s → success
    setTimeout(() => {
      const hash = `0x${Math.random().toString(16).slice(2, 10)}…${Math.random().toString(16).slice(2, 6)}`;
      setResult({ status: "success", hash });
      toast.update(toastId, {
        variant: "success",
        title: "Compra exitosa",
        description: `${tokens} tokens de ${asset.shortName} acreditados`,
        action: { label: "Ver en explorer", onClick: () => window.open("https://polygonscan.com", "_blank") },
      });
    }, 1800);
  };

  const handleClose = () => {
    if (result?.status === "pending") return; // prevent close while pending
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      title={`Comprar ${asset.shortName}`}
      description={`${asset.location} · USD ${asset.pricePerToken} por token`}
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
              disabled={tokens < 1}
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
              disabled={!accepted}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a] disabled:opacity-50 disabled:hover:scale-100"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Firmar transacción
            </button>
          </>
        ) : result?.status === "success" ? (
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-white"
          >
            Volver al activo
          </button>
        ) : null
      }
    >
      {/* Step 1 — Monto */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
              Cantidad de tokens
            </label>
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
                onChange={(e) => setTokens(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-transparent text-center text-2xl font-semibold tabular-nums text-[#ddcfc9] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => setTokens((t) => t + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[1, 5, 10, 25, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setTokens(n)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                    tokens === n
                      ? "border-[#D4A45A] bg-[#D4A45A]/10 text-[#D4A45A]"
                      : "border-[#ddcfc9]/10 text-[#b8a99e] hover:border-[#ddcfc9]/30 hover:text-[#ddcfc9]"
                  )}
                >
                  {n} tokens
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <Row label="Subtotal" value={formatUsd(math.subtotal)} />
            <Row label="Fee (0.5%)" value={formatUsd(math.fee, { decimals: 2 })} muted />
            <div className="my-1 border-t border-[#ddcfc9]/[0.06]" />
            <Row label="Total a pagar" value={formatUsd(math.total, { decimals: 2 })} strong />
          </div>

          {/* Ownership preview */}
          <div className="rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
              Tu participación
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm tabular-nums">
              <span className="text-[#b8a99e]">
                {math.currentOwnership.toFixed(3)}%
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#D4A45A]" />
              <span className="font-semibold text-[#D4A45A]">
                {math.nextOwnership.toFixed(3)}%
              </span>
              <span className="ml-auto text-[11px] text-[#b8a99e]">
                {math.newTokens.toLocaleString("es-AR")} tokens
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a] transition-all duration-500"
                style={{ width: `${Math.min(math.nextOwnership * 20, 100)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-[#b8a99e]">
            Al continuar vas a confirmar la compra de tokens de un fideicomiso financiero con
            oferta pública registrado bajo CNV RG 1069/2025. Operado por ALyC fiduciario regulado.
          </p>
        </div>
      )}

      {/* Step 2 — Confirmar */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <Row label="Activo" value={asset.shortName} strong />
            <Row label="Tokens" value={tokens.toString()} />
            <Row label="Precio unitario" value={formatUsd(asset.pricePerToken)} muted />
            <Row label="Subtotal" value={formatUsd(math.subtotal)} muted />
            <Row label="Fee" value={formatUsd(math.fee, { decimals: 2 })} muted />
            <div className="my-1 border-t border-[#ddcfc9]/[0.06]" />
            <Row label="Total" value={formatUsd(math.total, { decimals: 2 })} strong />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A45A]/10 text-[#D4A45A]">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-[#ddcfc9]">{dummyUser.walletShort}</p>
              <p className="text-[11px] text-[#b8a99e]">MetaMask · Polygon · USDC 12.480</p>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4 hover:border-[#D4A45A]/30">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#D4A45A]"
            />
            <span className="text-xs leading-relaxed text-[#b8a99e]">
              Acepto los{" "}
              <span className="text-[#ddcfc9] underline decoration-dotted underline-offset-2">
                términos del fideicomiso
              </span>{" "}
              y el prospecto registrado bajo <span className="text-[#D4A45A]">CNV RG 1069/2025</span>.
              Entiendo que los rendimientos no están garantizados.
            </span>
          </label>
        </div>
      )}

      {/* Step 3 — Resultado */}
      {step === 2 && (
        <div className="py-4">
          {result?.status === "pending" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10">
                <Loader2 className="h-7 w-7 animate-spin text-[#D4A45A]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#ddcfc9]">
                  Esperando confirmación on-chain
                </p>
                <p className="mt-1 text-xs text-[#b8a99e]">
                  No cierres esta ventana. La transacción puede tardar unos segundos.
                </p>
              </div>
            </div>
          )}

          {result?.status === "success" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10 animate-pulse-gold">
                <CheckCircle2 className="h-8 w-8 text-[#D4A45A]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#ddcfc9]">
                  {tokens} tokens acreditados
                </p>
                <p className="mt-1 text-xs text-[#b8a99e]">
                  Tu posición en {asset.shortName} ahora es de{" "}
                  <span className="font-semibold text-[#D4A45A]">
                    {math.newTokens.toLocaleString("es-AR")} tokens
                  </span>
                </p>
              </div>
              {result.hash && (
                <a
                  href="https://polygonscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] px-3 py-1.5 font-mono text-[11px] text-[#b8a99e] transition-colors hover:border-[#D4A45A]/30 hover:text-[#D4A45A]"
                >
                  {result.hash}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
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
