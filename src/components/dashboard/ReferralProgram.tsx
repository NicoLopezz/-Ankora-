"use client";

import { Copy, Gift, Users, DollarSign, CheckCircle2, Clock, Circle, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type ReferralStatus = "registered" | "kyc" | "invested";

interface Referral {
  id: string;
  handle: string;
  status: ReferralStatus;
  joinedAt: string;
  bonusUsd: number;
}

const dummyReferrals: Referral[] = [
  { id: "r1", handle: "martina.ank", status: "invested", joinedAt: "hace 12d", bonusUsd: 50 },
  { id: "r2", handle: "0x4a8b…d23c", status: "invested", joinedAt: "hace 23d", bonusUsd: 50 },
  { id: "r3", handle: "pedro.ank", status: "kyc", joinedAt: "hace 3d", bonusUsd: 0 },
  { id: "r4", handle: "0x19ef…88aa", status: "registered", joinedAt: "hace 1d", bonusUsd: 0 },
];

const statusConfig: Record<
  ReferralStatus,
  { label: string; tone: string; icon: React.ComponentType<{ className?: string }> }
> = {
  registered: { label: "Registrado", tone: "bg-[#ddcfc9]/[0.06] text-[#b8a99e]", icon: Circle },
  kyc: { label: "KYC verificando", tone: "bg-[#D4A45A]/[0.08] text-[#e0b76a]", icon: Clock },
  invested: { label: "Invirtió · bonus acreditado", tone: "bg-[#D4A45A]/10 text-[#D4A45A]", icon: CheckCircle2 },
};

const REFERRAL_CODE = "MP-7F3A";
const BONUS_PER_CONVERT = 50;

export function ReferralProgram() {
  const toast = useToast();
  const link = `ankora.io/r/${REFERRAL_CODE}`;

  const converted = dummyReferrals.filter((r) => r.status === "invested").length;
  const totalBonus = dummyReferrals.reduce((s, r) => s + r.bonusUsd, 0);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link}`);
      toast.show({
        variant: "success",
        title: "Link copiado",
        description: link,
      });
    } catch {
      toast.show({ variant: "error", title: "No se pudo copiar" });
    }
  };

  const share = async () => {
    const text = `Te invito a Ankora · activos reales tokenizados desde USD 500. Usá mi link y ganamos USD ${BONUS_PER_CONVERT} cada uno: https://${link}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Sumate a Ankora", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.show({
          variant: "info",
          title: "Mensaje copiado",
          description: "Listo para compartir en WhatsApp, email, etc.",
        });
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <section className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 animate-fade-in-up animate-delay-400 md:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
          <Gift className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Invitá amigos</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">
            USD {BONUS_PER_CONVERT} para vos y USD {BONUS_PER_CONVERT} para ellos cuando hagan su primera inversión
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatTile icon={Users} label="Invitados" value={dummyReferrals.length.toString()} />
        <StatTile icon={CheckCircle2} label="Convertidos" value={converted.toString()} accent />
        <StatTile
          icon={DollarSign}
          label="Ganado"
          value={`$${totalBonus.toLocaleString("en-US")}`}
          accent
        />
      </div>

      {/* Link */}
      <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-[#D4A45A]/25 bg-[#D4A45A]/[0.04] p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
            Tu link único
          </p>
          <p className="mt-1 truncate font-mono text-sm text-[#ddcfc9]">{link}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ddcfc9]/20 px-3 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
          >
            <Copy className="h-3.5 w-3.5" />
            Copiar
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-3 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a]"
          >
            <Share2 className="h-3.5 w-3.5" />
            Compartir
          </button>
        </div>
      </div>

      {/* History */}
      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
          Historial
        </p>
        <ul className="mt-2 space-y-2">
          {dummyReferrals.map((r) => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            return (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-3 py-2.5"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A]/20 to-[#a87a3a]/20 text-[10px] font-bold text-[#D4A45A]">
                  {r.handle.includes(".") ? r.handle.slice(0, 2).toUpperCase() : "0x"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs text-[#ddcfc9]">{r.handle}</p>
                  <p className="text-[11px] text-[#b8a99e]">{r.joinedAt}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    cfg.tone
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {cfg.label}
                </span>
                {r.bonusUsd > 0 && (
                  <span className="tabular-nums font-semibold text-[#D4A45A]">
                    +${r.bonusUsd}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
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
    <div className="rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-3">
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg",
          accent ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-lg font-semibold tabular-nums",
          accent ? "text-[#D4A45A]" : "text-[#ddcfc9]"
        )}
      >
        {value}
      </p>
    </div>
  );
}
