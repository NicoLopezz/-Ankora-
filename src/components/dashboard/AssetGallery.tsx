"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  src: string;
  caption?: string;
}

export function AssetGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length));
  }, [items.length]);
  const next = useCallback(() => {
    setActive((i) => (i === null ? i : (i + 1) % items.length));
  }, [items.length]);

  // Keyboard nav + body scroll lock
  useEffect(() => {
    if (active === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 animate-fade-in-up md:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
          <Images className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Galería</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">
            {items.length} {items.length === 1 ? "imagen" : "imágenes"} del proyecto
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#ddcfc9]/[0.06] bg-[#3a1410] transition-all duration-300 hover:border-[#D4A45A]/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.src}
              alt={it.caption ?? ""}
              className="h-full w-full object-cover transition-transform duration-[4000ms] ease-[cubic-bezier(0.6,0.01,0.05,0.95)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3a1410]/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
            {it.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left">
                <p className="truncate text-[11px] font-medium text-[#ddcfc9]">{it.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <Lightbox
          item={items[active]}
          index={active}
          total={items.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

function Lightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 animate-fade-in-up"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#ddcfc9]/20 bg-black/50 text-[#ddcfc9] backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-[#D4A45A]"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className={cn(
            "absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full",
            "border border-[#ddcfc9]/20 bg-black/50 text-[#ddcfc9] backdrop-blur-sm",
            "transition-colors hover:bg-black/70 hover:text-[#D4A45A]"
          )}
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className={cn(
            "absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full",
            "border border-[#ddcfc9]/20 bg-black/50 text-[#ddcfc9] backdrop-blur-sm",
            "transition-colors hover:bg-black/70 hover:text-[#D4A45A]"
          )}
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image + caption */}
      <div
        className="relative flex max-h-full max-w-6xl flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.caption ?? ""}
          className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain"
        />
        <div className="flex items-center gap-3 rounded-full border border-[#ddcfc9]/10 bg-black/60 px-4 py-1.5 backdrop-blur-sm">
          {item.caption && <p className="text-xs text-[#ddcfc9]">{item.caption}</p>}
          <span className="font-mono text-[10px] text-[#b8a99e]">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
