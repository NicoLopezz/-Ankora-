"use client";

import dynamic from "next/dynamic";

const Grainient = dynamic(() => import("@/components/ui/Grainient"), { ssr: false });

export function GrainientBackground() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 1 }}>
        <Grainient
          color1="#8a5a22"
          color2="#5e0b15"
          color3="#1a0306"
          timeSpeed={0.7}
          colorBalance={-0.28}
          warpStrength={1.0}
          warpFrequency={4.0}
          warpSpeed={1.2}
          warpAmplitude={60.0}
          blendAngle={20.0}
          blendSoftness={0.15}
          rotationAmount={420.0}
          noiseScale={1.8}
          grainAmount={0.12}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.2}
          gamma={1.0}
          saturation={0.85}
          zoom={0.85}
        />
      </div>
      {/* Capa de oscurecimiento para contraste de texto — viñeta radial que respeta la textura */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--night-bordeaux) 15%, transparent) 0%, color-mix(in oklab, var(--night-bordeaux) 45%, transparent) 100%)",
        }}
      />
    </>
  );
}
