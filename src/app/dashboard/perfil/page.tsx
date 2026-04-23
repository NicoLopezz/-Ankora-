"use client";

import {
  CheckCircle2,
  Copy,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  ShieldCheck,
  Wallet,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReferralProgram } from "@/components/dashboard/ReferralProgram";
import { NotificationPreferences } from "@/components/dashboard/NotificationPreferences";
import { dummyUser, formatDateAr } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
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

      {/* Identity card — dense horizontal layout */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 animate-fade-in-up animate-delay-100 md:p-6"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(212,164,90,0.08), transparent 55%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          {/* Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4A45A] to-[#a87a3a] text-xl font-bold text-[#3a1410] shadow-lg md:h-20 md:w-20 md:text-2xl">
            {initials}
          </div>

          {/* Name + member */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-[#ddcfc9] md:text-2xl">
                {dummyUser.name}
              </h2>
              {dummyUser.kycVerified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D4A45A]/30 bg-[#D4A45A]/5 px-2.5 py-0.5 text-[11px] font-medium text-[#D4A45A]">
                  <ShieldCheck className="h-3 w-3" />
                  KYC verificado
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[#b8a99e]">
              Inversor desde {formatDateAr(dummyUser.memberSince)} ·{" "}
              <span className="font-mono text-[#ddcfc9]">{dummyUser.walletShort}</span>
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="relative mt-5 grid gap-2.5 md:mt-6 md:grid-cols-4">
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

      {/* Referral program */}
      <ReferralProgram />

      {/* Notifications preferences — matrix email/push/in-app */}
      <NotificationPreferences />
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
