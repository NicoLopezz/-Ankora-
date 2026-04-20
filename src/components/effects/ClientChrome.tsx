"use client";

import dynamic from "next/dynamic";

// Dynamic + ssr:false requiere client boundary. Este wrapper los saca del first-load.
const CustomCursor = dynamic(
  () => import("./CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);
const HeroSeal = dynamic(
  () => import("@/components/ui/HeroSeal").then((m) => m.HeroSeal),
  { ssr: false },
);

export function ClientChrome() {
  return (
    <>
      <CustomCursor />
      <HeroSeal />
    </>
  );
}
