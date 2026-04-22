import { cn } from "@/lib/utils";

interface PlanetDecorProps {
  size?: number;
  className?: string;
  opacity?: number;
  blur?: boolean;
}

export function PlanetDecor({ size = 260, className, opacity = 0.35, blur = false }: PlanetDecorProps) {
  return (
    <div
      className={cn("pointer-events-none absolute select-none", className)}
      style={{ width: size, height: size, opacity }}
      aria-hidden
    >
      {/* Soft gold halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,164,90,0.35) 0%, rgba(212,164,90,0) 60%)",
          filter: "blur(20px)",
        }}
      />
      {/* Planet — uses existing /globe.svg asset */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/globe.svg"
        alt=""
        className={cn(
          "relative h-full w-full object-contain animate-planet-drift",
          blur && "blur-[1px]"
        )}
        style={{
          filter:
            "drop-shadow(0 20px 40px rgba(0,0,0,0.5)) sepia(0.35) hue-rotate(-10deg) saturate(1.3) brightness(1.1)",
        }}
      />
    </div>
  );
}
