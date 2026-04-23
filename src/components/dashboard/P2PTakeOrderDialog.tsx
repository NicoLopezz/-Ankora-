"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Clock,
  Wallet,
  Users,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Dialog, Stepper } from "./Dialog";
import { useToast } from "@/components/ui/toast";
import { formatUsd } from "@/lib/dummy-data";
import type { P2POrder } from "@/types/ankora";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "preflight", label: "Verificación" },
  { id: "review", label: "Orden" },
  { id: "disclosures", label: "Declaraciones" },
  { id: "signing", label: "Firma" },
  { id: "settling", label: "Liquidación" },
  { id: "done", label: "Comprobante" },
];

type StepId = (typeof STEPS)[number]["id"];

// Wallet balance mock
const WALLET_BALANCE_USDC = 12480;
const MONTHLY_OP_USD = 32000;
const MONTHLY_LIMIT_USD = 50000;

// Price lock duration (seconds)
const PRICE_LOCK_SECONDS = 180;

interface Props {
  order: P2POrder | null;
  onOpenChange: (open: boolean) => void;
}

export function P2PTakeOrderDialog({ order, onOpenChange }: Props) {
  const toast = useToast();
  const [step, setStep] = useState<StepId>("preflight");
  const [stepIdx, setStepIdx] = useState(0);

  // Preflight checklist
  const [checks, setChecks] = useState({ kyc: false, limits: false, balance: false, counterparty: false });

  // Amount
  const [tokens, setTokens] = useState(1);

  // Price lock timer
  const [lockSeconds, setLockSeconds] = useState(PRICE_LOCK_SECONDS);

  // Disclosures
  const [disc, setDisc] = useState({ risk: false, pld: false, fiscal: false, suitability: false });

  // Signing stages
  const [signStage, setSignStage] = useState<"idle" | "approve" | "approved" | "execute" | "executed">("idle");

  // Settling stages
  const [settleStage, setSettleStage] = useState(0); // 0..3

  // Result
  const [result, setResult] = useState<null | { txHash: string; receiptId: string; cnvRef: string }>(null);

  // Reset when opening a new order — deferred to microtask to avoid sync setState in effect.
  useEffect(() => {
    if (!order) return;
    const t = setTimeout(() => {
      setStep("preflight");
      setStepIdx(0);
      setChecks({ kyc: false, limits: false, balance: false, counterparty: false });
      setTokens(1);
      setLockSeconds(PRICE_LOCK_SECONDS);
      setDisc({ risk: false, pld: false, fiscal: false, suitability: false });
      setSignStage("idle");
      setSettleStage(0);
      setResult(null);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  // Preflight sequence — spaced so the user can actually read each check.
  useEffect(() => {
    if (step !== "preflight") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setChecks((c) => ({ ...c, kyc: true })), 900));
    timers.push(setTimeout(() => setChecks((c) => ({ ...c, limits: true })), 1900));
    timers.push(setTimeout(() => setChecks((c) => ({ ...c, balance: true })), 2900));
    timers.push(setTimeout(() => setChecks((c) => ({ ...c, counterparty: true })), 3800));
    timers.push(
      setTimeout(() => {
        setStep("review");
        setStepIdx(1);
      }, 4600)
    );
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // Price lock countdown
  useEffect(() => {
    if (step !== "review" && step !== "disclosures") return;
    const iv = setInterval(() => {
      setLockSeconds((s) => {
        if (s <= 1) {
          clearInterval(iv);
          toast.show({
            variant: "error",
            title: "Precio expirado",
            description: "El quote duró 3 minutos. Volvé a iniciar la operación.",
          });
          onOpenChange(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [step, toast, onOpenChange]);

  // Signing sequence — triggered once when entering the "signing" step.
  // Deps is ONLY [step] — including signStage would cancel the sequence
  // the moment we set the first stage (cleanup runs on every dep change).
  useEffect(() => {
    if (step !== "signing") return;
    const t0 = setTimeout(() => setSignStage("approve"), 400);
    const t1 = setTimeout(() => setSignStage("approved"), 2000);
    const t2 = setTimeout(() => setSignStage("execute"), 2800);
    const t3 = setTimeout(() => setSignStage("executed"), 4400);
    const t4 = setTimeout(() => {
      setStep("settling");
      setStepIdx(4);
    }, 4900);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [step]);

  // Settling sequence — only depends on `step` to avoid cleanup re-runs when
  // `order` or `toast` references change during the sequence.
  useEffect(() => {
    if (step !== "settling") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSettleStage(1), 800));
    timers.push(setTimeout(() => setSettleStage(2), 1800));
    timers.push(setTimeout(() => setSettleStage(3), 3000));
    timers.push(
      setTimeout(() => {
        const txHash = `0x${Math.random().toString(16).slice(2, 10)}…${Math.random().toString(16).slice(2, 6)}`;
        const receiptId = `RCP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const cnvRef = `CNV-${Math.floor(Math.random() * 900000 + 100000)}`;
        setResult({ txHash, receiptId, cnvRef });
        setStep("done");
        setStepIdx(5);
        toast.show({
          variant: "success",
          title: order?.side === "sell" ? "Compra liquidada" : "Venta liquidada",
          description: `Comprobante ${receiptId} disponible`,
        });
      }, 3800)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const available = order ? order.tokens - order.tokensFilled : 0;
  const cleanTokens = Math.min(tokens, available);
  const subtotal = order ? cleanTokens * order.pricePerToken : 0;
  const fee = subtotal * 0.01;
  const isBuy = order?.side === "sell"; // taking a sell order = buying
  const total = isBuy ? subtotal + fee : subtotal - fee;

  const allDisclosuresOk = disc.risk && disc.pld && disc.fiscal && disc.suitability;

  const handleClose = (open: boolean) => {
    // Block closing while actively processing
    if (step === "signing" || step === "settling") return;
    if (!open) onOpenChange(false);
  };

  if (!order) return null;

  const preflightItems = [
    { id: "kyc", label: "KYC vigente", done: checks.kyc, icon: ShieldCheck },
    {
      id: "limits",
      label: `Límite mensual · USD ${MONTHLY_OP_USD.toLocaleString("en-US")} de USD ${MONTHLY_LIMIT_USD.toLocaleString("en-US")}`,
      done: checks.limits,
      icon: Clock,
    },
    {
      id: "balance",
      label: `Balance wallet · USDC ${WALLET_BALANCE_USDC.toLocaleString("en-US")}`,
      done: checks.balance,
      icon: Wallet,
    },
    { id: "counterparty", label: `Contraparte verificada · ${order.userHandle}`, done: checks.counterparty, icon: Users },
  ];

  const lockFormatted = `${Math.floor(lockSeconds / 60)}:${String(lockSeconds % 60).padStart(2, "0")}`;

  return (
    <Dialog
      open={!!order}
      onOpenChange={handleClose}
      title={`${isBuy ? "Comprar" : "Vender"} ${order.assetName}`}
      description={`Operación P2P · ${order.id} · liquidada por ALyC fiduciario`}
      stepper={<Stepper steps={STEPS} current={stepIdx} />}
      footer={renderFooter()}
    >
      {step === "preflight" && (
        <div className="space-y-4 py-2">
          <p className="text-sm text-[#b8a99e]">
            Validando requisitos regulatorios antes de bloquear el precio…
          </p>
          <ul className="space-y-2">
            {preflightItems.map((it) => {
              const Icon = it.icon;
              return (
                <li
                  key={it.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition-all duration-300",
                    it.done
                      ? "border-[#D4A45A]/30 bg-[#D4A45A]/[0.04]"
                      : "border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                      it.done ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
                    )}
                  >
                    {it.done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <p
                    className={cn(
                      "flex-1 text-sm",
                      it.done ? "text-[#ddcfc9]" : "text-[#b8a99e]"
                    )}
                  >
                    {it.label}
                  </p>
                  {!it.done && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#b8a99e]" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-5">
          {/* Price lock */}
          <div className="flex items-center justify-between rounded-xl border border-[#D4A45A]/30 bg-[#D4A45A]/[0.06] px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-[#D4A45A]">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">Precio bloqueado por</span>
            </div>
            <span className="font-mono text-sm font-semibold tabular-nums text-[#D4A45A]">
              {lockFormatted}
            </span>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
                Cantidad
              </label>
              <span className="text-[11px] text-[#b8a99e]">
                Disponibles: <span className="text-[#ddcfc9]">{available}</span>
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#ddcfc9]/10 bg-[#ddcfc9]/[0.02] p-1 pr-3">
              <button
                onClick={() => setTokens((t) => Math.max(1, t - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-[#b8a99e] hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              >
                −
              </button>
              <input
                type="number"
                value={tokens}
                min={1}
                max={available}
                onChange={(e) =>
                  setTokens(Math.min(available, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="flex-1 bg-transparent text-center text-2xl font-semibold tabular-nums text-[#ddcfc9] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => setTokens((t) => Math.min(available, t + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-[#b8a99e] hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              >
                +
              </button>
            </div>
          </div>

          {/* Counterparty card */}
          <div className="flex items-center gap-3 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A]/20 to-[#a87a3a]/20 text-[11px] font-bold text-[#D4A45A]">
              {order.userHandle.includes(".") ? order.userHandle.slice(0, 2).toUpperCase() : "0x"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 font-mono text-sm text-[#ddcfc9]">
                {order.userHandle}
                {order.userVerified && <ShieldCheck className="h-3.5 w-3.5 text-[#D4A45A]" />}
              </p>
              <p className="text-[11px] text-[#b8a99e]">Contraparte KYC · 142 operaciones previas</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <Row label="Precio unitario (locked)" value={formatUsd(order.pricePerToken, { decimals: 2 })} />
            <Row label="Tokens" value={cleanTokens.toString()} />
            <Row label="Subtotal" value={formatUsd(subtotal, { decimals: 2 })} muted />
            <Row
              label="Fee marketplace (1%)"
              value={`${isBuy ? "+" : "−"}${formatUsd(fee, { decimals: 2 })}`}
              muted
            />
            <div className="my-1 border-t border-[#ddcfc9]/[0.06]" />
            <Row label={isBuy ? "Total a pagar" : "Recibís"} value={formatUsd(total, { decimals: 2 })} strong />
          </div>
        </div>
      )}

      {step === "disclosures" && (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-[#b8a99e]">
            Antes de firmar, confirmá cada declaración requerida por el marco regulatorio (CNV RG
            1069/2025 · UIF Res. 30/2017):
          </p>
          <div className="space-y-2.5">
            <DisclosureItem
              checked={disc.risk}
              onChange={(v) => setDisc((d) => ({ ...d, risk: v }))}
              title="Riesgo del activo"
              body={
                <>
                  Leí el <span className="text-[#D4A45A]">prospecto de {order.assetName}</span> y
                  entiendo que los rendimientos proyectados no están garantizados. Acepto la
                  iliquidez potencial del activo subyacente.
                </>
              }
            />
            <DisclosureItem
              checked={disc.pld}
              onChange={(v) => setDisc((d) => ({ ...d, pld: v }))}
              title="Origen de fondos (PLD/UIF)"
              body={
                <>
                  Declaro bajo juramento que los fondos utilizados provienen de actividades lícitas
                  y son compatibles con mi perfil fiscal declarado en AFIP.
                </>
              }
            />
            <DisclosureItem
              checked={disc.fiscal}
              onChange={(v) => setDisc((d) => ({ ...d, fiscal: v }))}
              title="Implicancias fiscales"
              body={
                <>
                  Entiendo que esta operación puede generar obligaciones impositivas (ganancias,
                  bienes personales) de mi exclusiva responsabilidad.
                </>
              }
            />
            <DisclosureItem
              checked={disc.suitability}
              onChange={(v) => setDisc((d) => ({ ...d, suitability: v }))}
              title="Perfil de inversor"
              body={
                <>
                  Declaro que esta operación es compatible con mi{" "}
                  <span className="text-[#D4A45A]">perfil de inversor</span> declarado ante la CNV.
                  Entiendo que puedo actualizarlo en mi perfil.
                </>
              }
            />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#D4A45A]/[0.06] px-3 py-2.5 text-[11px] text-[#e0b76a]">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            Un registro de estas declaraciones queda asociado a tu operación y disponible para
            auditoría regulatoria.
          </div>
        </div>
      )}

      {step === "signing" && (
        <div className="space-y-4 py-2">
          <p className="text-sm text-[#b8a99e]">
            Firmas on-chain requeridas. Esta operación dispara 2 transacciones en Polygon.
          </p>
          <SignStep
            label="Aprobar USDC al contrato del marketplace"
            sub="Permiso limitado al monto de la operación"
            state={
              signStage === "idle" || signStage === "approve"
                ? signStage === "approve"
                  ? "pending"
                  : "waiting"
                : "done"
            }
            n={1}
          />
          <SignStep
            label="Ejecutar matching P2P"
            sub="Escrow + transferencia atómica de tokens"
            state={
              signStage === "execute" ? "pending" : signStage === "executed" ? "done" : "waiting"
            }
            n={2}
          />
        </div>
      )}

      {step === "settling" && (
        <div className="space-y-4 py-2">
          <p className="text-sm text-[#b8a99e]">Liquidando on-chain vía escrow regulado…</p>
          <SettleStep done={settleStage >= 1} active={settleStage === 0} label="Fondos depositados en escrow" />
          <SettleStep done={settleStage >= 2} active={settleStage === 1} label="Tokens reservados por la contraparte" />
          <SettleStep done={settleStage >= 3} active={settleStage === 2} label="Transferencia atómica ejecutada" />
        </div>
      )}

      {step === "done" && result && (
        <div className="space-y-5 py-2">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A45A]/40 bg-[#D4A45A]/10 animate-pulse-gold">
              <CheckCircle2 className="h-8 w-8 text-[#D4A45A]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#ddcfc9]">
                {isBuy ? "Compra" : "Venta"} liquidada
              </p>
              <p className="mt-1 text-xs text-[#b8a99e]">
                {cleanTokens} tokens de {order.assetName} ·{" "}
                <span className="font-semibold text-[#D4A45A]">
                  {formatUsd(total, { decimals: 2 })}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-4">
            <ReceiptRow label="Comprobante" value={result.receiptId} mono />
            <ReceiptRow label="Ref. CNV" value={result.cnvRef} mono />
            <ReceiptRow label="Tx hash" value={result.txHash} mono href="https://polygonscan.com" />
            <ReceiptRow label="Fiduciario" value="ALyC regulado por CNV" />
            <ReceiptRow label="Fecha" value={new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]">
              <Download className="h-3.5 w-3.5" />
              Comprobante PDF
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]">
              <FileText className="h-3.5 w-3.5" />
              Certificado CNV
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );

  function renderFooter() {
    if (step === "preflight") {
      return (
        <button
          onClick={() => onOpenChange(false)}
          className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
        >
          Cancelar
        </button>
      );
    }
    if (step === "review") {
      return (
        <>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setStep("disclosures");
              setStepIdx(2);
            }}
            disabled={cleanTokens < 1}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-white disabled:opacity-50 disabled:hover:scale-100"
          >
            Continuar <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </>
      );
    }
    if (step === "disclosures") {
      return (
        <>
          <button
            onClick={() => {
              setStep("review");
              setStepIdx(1);
            }}
            className="rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
          >
            Atrás
          </button>
          <button
            onClick={() => {
              setStep("signing");
              setStepIdx(3);
            }}
            disabled={!allDisclosuresOk}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a] disabled:opacity-50 disabled:hover:scale-100"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Firmar operación
          </button>
        </>
      );
    }
    if (step === "done") {
      return (
        <button
          onClick={() => onOpenChange(false)}
          className="rounded-full bg-[#ddcfc9] px-5 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-white"
        >
          Volver al mercado
        </button>
      );
    }
    return null;
  }
}

function DisclosureItem({
  checked,
  onChange,
  title,
  body,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
        checked
          ? "border-[#D4A45A]/30 bg-[#D4A45A]/[0.04]"
          : "border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] hover:border-[#ddcfc9]/20"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#D4A45A]"
      />
      <div>
        <p className="text-[13px] font-semibold text-[#ddcfc9]">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[#b8a99e]">{body}</p>
      </div>
    </label>
  );
}

function SignStep({
  n,
  label,
  sub,
  state,
}: {
  n: number;
  label: string;
  sub: string;
  state: "waiting" | "pending" | "done";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 transition-all duration-300",
        state === "done"
          ? "border-[#D4A45A]/30 bg-[#D4A45A]/[0.04]"
          : state === "pending"
            ? "border-[#D4A45A]/50 bg-[#D4A45A]/[0.08]"
            : "border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02]"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
          state === "done"
            ? "bg-[#D4A45A] text-[#3a1410]"
            : state === "pending"
              ? "bg-[#D4A45A]/20 text-[#D4A45A]"
              : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        )}
      >
        {state === "done" ? <CheckCircle2 className="h-4 w-4" /> : state === "pending" ? <Loader2 className="h-4 w-4 animate-spin" /> : n}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            state === "waiting" ? "text-[#b8a99e]" : "text-[#ddcfc9]"
          )}
        >
          {label}
        </p>
        <p className="mt-0.5 text-[11px] text-[#b8a99e]">{sub}</p>
      </div>
    </div>
  );
}

function SettleStep({ done, active, label }: { done: boolean; active: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-300",
        done
          ? "border-[#D4A45A]/30 bg-[#D4A45A]/[0.04]"
          : active
            ? "border-[#D4A45A]/50 bg-[#D4A45A]/[0.08]"
            : "border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02]"
      )}
    >
      {done ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#D4A45A]" />
      ) : active ? (
        <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-[#D4A45A]" />
      ) : (
        <div className="h-4 w-4 flex-shrink-0 rounded-full border border-[#ddcfc9]/20" />
      )}
      <p
        className={cn(
          "text-sm",
          done ? "text-[#ddcfc9]" : active ? "text-[#ddcfc9]" : "text-[#b8a99e]"
        )}
      >
        {label}
      </p>
    </div>
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

function ReceiptRow({
  label,
  value,
  mono,
  href,
}: {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-[#b8a99e]">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex items-center gap-1 text-[#ddcfc9] transition-colors hover:text-[#D4A45A]",
            mono && "font-mono"
          )}
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className={cn("text-[#ddcfc9]", mono && "font-mono")}>{value}</span>
      )}
    </div>
  );
}
