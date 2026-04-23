"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Inbox, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Channel = "email" | "push" | "inapp";
type EventKey =
  | "dividendos"
  | "oportunidades"
  | "reportes"
  | "cierres"
  | "kyc"
  | "p2p"
  | "marketing";

type PrefMatrix = Record<EventKey, Record<Channel, boolean>>;

const initialPrefs: PrefMatrix = {
  dividendos: { email: true, push: true, inapp: true },
  oportunidades: { email: true, push: false, inapp: true },
  reportes: { email: true, push: false, inapp: true },
  cierres: { email: true, push: true, inapp: true },
  kyc: { email: true, push: true, inapp: true },
  p2p: { email: false, push: true, inapp: true },
  marketing: { email: false, push: false, inapp: false },
};

const events: { key: EventKey; label: string; desc: string; critical?: boolean }[] = [
  { key: "dividendos", label: "Pagos de dividendos", desc: "Liquidaciones recibidas en tu wallet", critical: true },
  { key: "cierres", label: "Cierre de cupos", desc: "Cuando un proyecto que seguís está por cerrar" },
  { key: "kyc", label: "KYC y compliance", desc: "Vencimientos de KYC o docs requeridos", critical: true },
  { key: "p2p", label: "Mercado P2P", desc: "Matching de tus órdenes y cambios en el libro" },
  { key: "oportunidades", label: "Nuevas oportunidades", desc: "Proyectos recién lanzados en el marketplace" },
  { key: "reportes", label: "Reportes trimestrales", desc: "Informes operativos de tus activos" },
  { key: "marketing", label: "Novedades y newsletter", desc: "Contenido de la comunidad Ankora" },
];

const channelConfig: Record<Channel, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  email: { label: "Email", icon: Mail },
  push: { label: "Push", icon: Smartphone },
  inapp: { label: "In-app", icon: Inbox },
};

export function NotificationPreferences() {
  const toast = useToast();
  const [prefs, setPrefs] = useState<PrefMatrix>(initialPrefs);
  const [dirty, setDirty] = useState(false);

  const toggle = (event: EventKey, channel: Channel) => {
    setPrefs((p) => ({
      ...p,
      [event]: { ...p[event], [channel]: !p[event][channel] },
    }));
    setDirty(true);
  };

  const save = () => {
    setDirty(false);
    toast.show({
      variant: "success",
      title: "Preferencias guardadas",
      description: "Aplicamos los cambios en todos los canales",
    });
  };

  const simulateNew = () => {
    toast.show({
      variant: "info",
      title: "Notificación de prueba",
      description: "Revisá la campana arriba a la derecha — dispara el drawer",
    });
  };

  return (
    <section className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 animate-fade-in-up md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#ddcfc9]">Notificaciones</h3>
            <p className="mt-0.5 text-xs text-[#b8a99e]">
              Elegí por qué canal querés recibir cada tipo de evento
            </p>
          </div>
        </div>
        <button
          onClick={simulateNew}
          className="hidden rounded-full border border-[#ddcfc9]/15 px-3 py-1.5 text-[11px] font-medium text-[#b8a99e] transition-colors hover:border-[#D4A45A]/40 hover:text-[#D4A45A] sm:inline-flex"
        >
          Probar notif (demo)
        </button>
      </div>

      {/* Matrix — desktop */}
      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
                Evento
              </th>
              {(Object.keys(channelConfig) as Channel[]).map((c) => {
                const cfg = channelConfig[c];
                const Icon = cfg.icon;
                return (
                  <th
                    key={c}
                    className="w-24 pb-3 text-center text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]"
                  >
                    <span className="inline-flex flex-col items-center gap-1">
                      <Icon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.key} className="border-t border-[#ddcfc9]/[0.04]">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#ddcfc9]">{e.label}</p>
                    {e.critical && (
                      <span className="rounded-full bg-[#D4A45A]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#D4A45A]">
                        Crítico
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#b8a99e]">{e.desc}</p>
                </td>
                {(Object.keys(channelConfig) as Channel[]).map((c) => (
                  <td key={c} className="py-3 text-center">
                    <Toggle
                      on={prefs[e.key][c]}
                      onChange={() => toggle(e.key, c)}
                      disabled={e.critical && c === "inapp"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked */}
      <div className="mt-5 space-y-3 md:hidden">
        {events.map((e) => (
          <div
            key={e.key}
            className="rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-3"
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[#ddcfc9]">{e.label}</p>
              {e.critical && (
                <span className="rounded-full bg-[#D4A45A]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#D4A45A]">
                  Crítico
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-[#b8a99e]">{e.desc}</p>
            <div className="mt-3 flex items-center gap-3">
              {(Object.keys(channelConfig) as Channel[]).map((c) => {
                const cfg = channelConfig[c];
                const Icon = cfg.icon;
                return (
                  <div key={c} className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3 text-[#b8a99e]" />
                    <span className="text-[11px] text-[#b8a99e]">{cfg.label}</span>
                    <Toggle
                      on={prefs[e.key][c]}
                      onChange={() => toggle(e.key, c)}
                      disabled={e.critical && c === "inapp"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#ddcfc9]/[0.06] pt-4">
        <p className="text-[11px] text-[#b8a99e]">
          Los eventos <span className="text-[#D4A45A]">críticos</span> no pueden desactivarse in-app
          por requisito regulatorio
        </p>
        <button
          onClick={save}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A45A] px-4 py-2 text-xs font-semibold text-[#3a1410] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#e0b76a] disabled:opacity-40 disabled:hover:scale-100"
        >
          <Save className="h-3.5 w-3.5" />
          Guardar
        </button>
      </div>
    </section>
  );
}

function Toggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative h-5 w-9 flex-shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
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
  );
}
