"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  ShieldCheck,
  Wallet,
  Bell,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PlanetDecor } from "@/components/dashboard/PlanetDecor";
import { dummyUser, formatDateAr } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const [notif, setNotif] = useState({
    dividendos: true,
    nuevasOportunidades: true,
    reportes: false,
    marketing: false,
  });

  const initials = dummyUser.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Cuenta"
        title="Perfil"
        description="Datos personales, verificación y preferencias"
      />

      {/* Identity card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] animate-fade-in-up animate-delay-100">
        <div
          className="relative h-28 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #6d2721, #3a1410 70%), radial-gradient(circle at top right, rgba(212,164,90,0.2), transparent 60%)",
          }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-50" />
          <PlanetDecor size={90} className="-right-2 -top-2" opacity={0.3} />
        </div>
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#4a1a16] bg-gradient-to-br from-[#D4A45A] to-[#a87a3a] text-2xl font-bold text-[#3a1410] shadow-lg">
            {initials}
          </div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#ddcfc9]">{dummyUser.name}</h2>
              <p className="mt-0.5 text-sm text-[#b8a99e]">
                Inversor desde {formatDateAr(dummyUser.memberSince)}
              </p>
            </div>
            {dummyUser.kycVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A45A]/30 bg-[#D4A45A]/5 px-3 py-1.5 text-xs font-medium text-[#D4A45A]">
                <ShieldCheck className="h-3.5 w-3.5" />
                KYC verificado
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={dummyUser.email} />
            <InfoRow icon={Phone} label="Teléfono" value={dummyUser.phone} />
            <InfoRow icon={Globe} label="País" value={dummyUser.country} />
            <InfoRow
              icon={CalendarDays}
              label="Miembro desde"
              value={formatDateAr(dummyUser.memberSince)}
            />
          </div>
        </div>
      </div>

      {/* Wallet + KYC */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-200 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
              <Wallet className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#ddcfc9]">Wallet conectada</h3>
          </div>
          <p className="mt-3 text-xs text-[#b8a99e]">Custodia tus tokens ERC-20 en Polygon</p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-4 py-3">
            <div>
              <p className="font-mono text-sm text-[#ddcfc9]">{dummyUser.walletShort}</p>
              <p className="text-[11px] text-[#b8a99e]">MetaMask · Polygon</p>
            </div>
            <button className="rounded-lg p-1.5 text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#D4A45A]">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]">
              Cambiar wallet
            </button>
            <button className="flex-1 rounded-full bg-[#ddcfc9] px-4 py-2 text-xs font-semibold text-[#3a1410] transition-opacity hover:opacity-90">
              Ver en explorer
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#ddcfc9]">Verificación y cumplimiento</h3>
          </div>
          <p className="mt-3 text-xs text-[#b8a99e]">Estado regulatorio de tu cuenta</p>
          <ul className="mt-4 space-y-2">
            {[
              { label: "Identidad (DNI)", ok: true },
              { label: "Prueba de domicilio", ok: true },
              { label: "Origen de fondos", ok: true },
              { label: "Perfil de inversor CNV", ok: true },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-4 py-3"
              >
                <span className="text-sm text-[#ddcfc9]">{item.label}</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#D4A45A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Aprobado
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6 animate-fade-in-up animate-delay-300">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
            <Bell className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Notificaciones</h3>
        </div>
        <p className="mt-3 text-xs text-[#b8a99e]">Elegí qué eventos querés recibir por email</p>

        <div className="mt-5 space-y-2">
          {(
            [
              { key: "dividendos", label: "Pagos de dividendos", desc: "Te avisamos cada vez que recibís un pago." },
              { key: "nuevasOportunidades", label: "Nuevas oportunidades", desc: "Proyectos recién lanzados en el marketplace." },
              { key: "reportes", label: "Reportes trimestrales", desc: "Informes operativos de tus activos." },
              { key: "marketing", label: "Novedades y newsletter", desc: "Contenido de la comunidad Ankora." },
            ] as const
          ).map((opt) => {
            const on = notif[opt.key];
            return (
              <label
                key={opt.key}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-4 py-3 transition-colors hover:border-[#D4A45A]/30"
              >
                <div>
                  <p className="text-sm font-medium text-[#ddcfc9]">{opt.label}</p>
                  <p className="mt-0.5 text-[11px] text-[#b8a99e]">{opt.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotif((s) => ({ ...s, [opt.key]: !s[opt.key] }))}
                  className={cn(
                    "relative h-5 w-9 flex-shrink-0 rounded-full transition-colors",
                    on ? "bg-[#D4A45A]" : "bg-[#ddcfc9]/10"
                  )}
                  aria-pressed={on}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-[#3a1410] shadow-sm transition-all",
                      on ? "left-4" : "left-0.5"
                    )}
                  />
                </button>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-4 py-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04] text-[#b8a99e]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">{label}</p>
        <p className="truncate text-sm text-[#ddcfc9]">{value}</p>
      </div>
    </div>
  );
}
