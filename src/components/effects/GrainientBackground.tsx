"use client";

import dynamic from "next/dynamic";

const Grainient = dynamic(() => import("@/components/ui/Grainient"), { ssr: false });

export function GrainientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.9 }}
    >
      <Grainient
        color1="#bc8034"
        color2="#90323d"
        color3="#3d070e"
        timeSpeed={0.18}
        colorBalance={-0.05}
        warpStrength={1.0}
        warpFrequency={4.0}
        warpSpeed={1.2}
        warpAmplitude={60.0}
        blendAngle={20.0}
        blendSoftness={0.15}
        rotationAmount={420.0}
        noiseScale={1.8}
        grainAmount={0.14}
        grainScale={2.0}
        grainAnimated={false}
        contrast={1.3}
        gamma={1.0}
        saturation={0.95}
        zoom={0.85}
      />
    </div>
  );
}
