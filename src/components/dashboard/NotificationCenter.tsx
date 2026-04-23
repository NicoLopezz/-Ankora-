"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Coins, Sparkles, FileText, Clock, CheckCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

type NotifKind = "dividendo" | "oportunidad" | "reporte" | "cierre";

interface Notif {
  id: string;
  kind: NotifKind;
  title: string;
  description: string;
  timeLabel: string;
  href?: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  {
    id: "n1",
    kind: "dividendo",
    title: "Dividendo acreditado",
    description: "USD 312,50 de Cafayate Vineyards I (Q1 2026)",
    timeLabel: "hace 2h",
    href: "/dashboard/transacciones",
    read: false,
  },
  {
    id: "n2",
    kind: "oportunidad",
    title: "Nueva oportunidad",
    description: "Olivar Premium La Rioja · APY 12%",
    timeLabel: "hace 6h",
    href: "/dashboard/marketplace",
    read: false,
  },
  {
    id: "n3",
    kind: "cierre",
    title: "Cierre próximo",
    description: "Marina Puerto Madero cierra en 2 días · 91% fondeado",
    timeLabel: "hace 1d",
    href: "/dashboard/marketplace",
    read: false,
  },
  {
    id: "n4",
    kind: "reporte",
    title: "Reporte Q1 disponible",
    description: "Cafayate Vineyards I — reporte operativo trimestral",
    timeLabel: "hace 2d",
    href: "/dashboard/activos/cafayate",
    read: true,
  },
  {
    id: "n5",
    kind: "dividendo",
    title: "Dividendo acreditado",
    description: "USD 108,33 de Alto Agrelo Estates (Abril 2026)",
    timeLabel: "hace 3d",
    href: "/dashboard/transacciones",
    read: true,
  },
  {
    id: "n6",
    kind: "reporte",
    title: "Nuevo documento fiscal",
    description: "Comprobante fiscal Q1 2026 disponible para descargar",
    timeLabel: "hace 4d",
    href: "/dashboard/activos/cafayate",
    read: true,
  },
];

const kindConfig: Record<NotifKind, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  dividendo: { icon: Coins, tone: "text-[#D4A45A] bg-[#D4A45A]/10" },
  oportunidad: { icon: Sparkles, tone: "text-[#D4A45A] bg-[#D4A45A]/10" },
  reporte: { icon: FileText, tone: "text-[#ddcfc9] bg-[#ddcfc9]/[0.06]" },
  cierre: { icon: Clock, tone: "text-[#e0b76a] bg-[#D4A45A]/5" },
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const toast = useToast();

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Lock body scroll + ESC to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const markAllRead = () => {
    if (unreadCount === 0) return;
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
    toast.show({
      variant: "info",
      title: "Notificaciones marcadas como leídas",
      description: `${unreadCount} notificación${unreadCount > 1 ? "es" : ""} actualizada${unreadCount > 1 ? "s" : ""}`,
    });
  };

  const handleItemClick = (id: string) => {
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          open
            ? "border-[#D4A45A]/40 text-[#D4A45A]"
            : "border-[#ddcfc9]/10 text-[#b8a99e] hover:border-[#D4A45A]/40 hover:text-[#D4A45A]"
        )}
        aria-label="Notificaciones"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A45A] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4A45A]" />
          </span>
        )}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-[91] flex h-screen w-full max-w-[420px] flex-col overflow-hidden border-l border-[#ddcfc9]/[0.08] bg-[#4a1a16] shadow-[0_0_120px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Notificaciones"
      >
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

        {/* Header */}
        <div className="relative flex flex-shrink-0 items-start justify-between gap-3 border-b border-[#ddcfc9]/[0.06] px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#D4A45A]" />
              <h2 className="text-base font-semibold text-[#ddcfc9]">Notificaciones</h2>
            </div>
            <p className="mt-1 text-xs text-[#b8a99e]">
              {unreadCount > 0
                ? `${unreadCount} sin leer · ${notifs.length} en total`
                : `Estás al día · ${notifs.length} en total`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-[#D4A45A] transition-colors hover:bg-[#D4A45A]/10 disabled:cursor-default disabled:text-[#b8a99e] disabled:hover:bg-transparent"
            >
              <CheckCheck className="h-3 w-3" />
              Marcar todas
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div
          data-lenis-prevent
          className="relative flex-1 overflow-y-auto overscroll-contain"
        >
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ddcfc9]/[0.04]">
                <Bell className="h-6 w-6 text-[#b8a99e]" />
              </div>
              <p className="mt-4 text-sm text-[#ddcfc9]">Sin notificaciones</p>
              <p className="mt-1 text-xs text-[#b8a99e]">
                Te vamos a avisar cuando haya novedades en tus activos
              </p>
            </div>
          ) : (
            <ul>
              {notifs.map((n) => {
                const cfg = kindConfig[n.kind];
                const Icon = cfg.icon;
                const inner = (
                  <div
                    className={cn(
                      "group flex items-start gap-3 border-b border-[#ddcfc9]/[0.04] px-6 py-4 transition-colors last:border-0 hover:bg-[#ddcfc9]/[0.02]",
                      !n.read && "bg-[#D4A45A]/[0.04]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
                        cfg.tone
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm",
                            n.read ? "text-[#b8a99e]" : "font-semibold text-[#ddcfc9]"
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4A45A]" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#b8a99e]">
                        {n.description}
                      </p>
                      <p className="mt-1.5 text-[10px] text-[#b8a99e]/70">{n.timeLabel}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => handleItemClick(n.id)} className="block">
                        {inner}
                      </Link>
                    ) : (
                      <button onClick={() => handleItemClick(n.id)} className="block w-full text-left">
                        {inner}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="relative flex-shrink-0 border-t border-[#ddcfc9]/[0.06] bg-[#3a1410]/60 p-3">
          <Link
            href="/dashboard/transacciones"
            onClick={() => setOpen(false)}
            className="block rounded-lg py-2.5 text-center text-xs font-medium text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
          >
            Ver todo el historial →
          </Link>
        </div>
      </aside>
    </>
  );
}
