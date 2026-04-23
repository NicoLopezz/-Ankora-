"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
  const [finePointer, setFinePointer] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <>
      {finePointer && <CustomCursor />}
      {!isDashboard && <HeroSeal />}
    </>
  );
}
