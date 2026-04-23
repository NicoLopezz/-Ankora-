"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info" | "loading";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  durationMs?: number;
}

interface ToastContextValue {
  show: (t: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
  update: (id: string, t: Partial<Omit<ToastItem, "id">>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const show = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2, 10);
      const duration = t.durationMs ?? (t.variant === "loading" ? 0 : 4000);
      setToasts((prev) => [...prev, { ...t, id }]);
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  const update = useCallback(
    (id: string, t: Partial<Omit<ToastItem, "id">>) => {
      setToasts((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)));
      const duration = t.durationMs ?? (t.variant && t.variant !== "loading" ? 4000 : undefined);
      if (duration && duration > 0) {
        const prevTimer = timersRef.current.get(id);
        if (prevTimer) clearTimeout(prevTimer);
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }
    },
    [dismiss]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss, update }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

const variantConfig: Record<
  ToastVariant,
  { icon: React.ComponentType<{ className?: string }>; tone: string; border: string }
> = {
  success: { icon: CheckCircle2, tone: "text-[#D4A45A]", border: "border-[#D4A45A]/40" },
  error: { icon: XCircle, tone: "text-[#e74c3c]", border: "border-[#e74c3c]/40" },
  info: { icon: Info, tone: "text-[#ddcfc9]", border: "border-[#ddcfc9]/20" },
  loading: { icon: Loader2, tone: "text-[#D4A45A]", border: "border-[#D4A45A]/40" },
};

function Toaster({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => {
        const cfg = variantConfig[t.variant];
        const Icon = cfg.icon;
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl border bg-[#4a1a16]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md",
              "animate-fade-in-up",
              cfg.border
            )}
          >
            <div className={cn("mt-0.5 flex-shrink-0", cfg.tone)}>
              <Icon className={cn("h-5 w-5", t.variant === "loading" && "animate-spin")} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#ddcfc9]">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-[#b8a99e]">{t.description}</p>
              )}
              {t.action && (
                <button
                  onClick={() => {
                    t.action?.onClick();
                    onDismiss(t.id);
                  }}
                  className="mt-2 text-xs font-semibold text-[#D4A45A] transition-colors hover:text-[#e0b76a]"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            {t.variant !== "loading" && (
              <button
                onClick={() => onDismiss(t.id)}
                className="flex-shrink-0 rounded-lg p-1 text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
