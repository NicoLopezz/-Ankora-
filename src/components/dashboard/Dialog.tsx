"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  stepper?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  stepper,
  children,
  footer,
  className,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-200" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-[91] flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] shadow-[0_40px_120px_rgba(0,0,0,0.6)]",
            "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
            "transition-[opacity,transform] duration-200 ease-out",
            className
          )}
        >
          {/* Ambient layers */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.12),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

          {/* Header */}
          <div className="relative flex flex-shrink-0 items-start justify-between gap-4 border-b border-[#ddcfc9]/[0.06] p-6">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-lg font-semibold text-[#ddcfc9]">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-xs text-[#b8a99e]">
                  {description}
                </DialogPrimitive.Description>
              )}
              {stepper && <div className="mt-4">{stepper}</div>}
            </div>
            <DialogPrimitive.Close
              className="flex-shrink-0 rounded-lg p-1.5 text-[#b8a99e] transition-colors hover:bg-[#ddcfc9]/[0.04] hover:text-[#ddcfc9]"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          {/* Body — data-lenis-prevent unhooks Lenis smooth scroll so wheel works inside */}
          <div
            data-lenis-prevent
            className="relative flex-1 overflow-y-auto overscroll-contain p-6"
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="relative flex flex-shrink-0 items-center justify-end gap-2 border-t border-[#ddcfc9]/[0.06] bg-[#3a1410]/60 p-4">
              {footer}
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: { id: string; label: string }[];
  current: number;
}) {
  const activeLabel = steps[current]?.label ?? "";
  return (
    <div>
      {/* Compact centered row of dots + fixed-width connectors */}
      <ol className="flex items-center justify-center gap-1.5">
        {steps.map((step, i) => {
          const isActive = i === current;
          const isDone = i < current;
          return (
            <li key={step.id} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                  isDone
                    ? "border-[#D4A45A] bg-[#D4A45A] text-[#3a1410]"
                    : isActive
                      ? "border-[#D4A45A] text-[#D4A45A]"
                      : "border-[#ddcfc9]/15 text-[#b8a99e]"
                )}
                title={step.label}
              >
                {isDone ? "✓" : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "h-px w-6 transition-colors",
                    isDone ? "bg-[#D4A45A]" : "bg-[#ddcfc9]/15"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Active step label */}
      <p className="mt-2 text-center text-[11px] font-medium text-[#D4A45A]">
        Paso {current + 1} de {steps.length} · {activeLabel}
      </p>
    </div>
  );
}
