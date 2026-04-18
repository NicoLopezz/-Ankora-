"use client";

import { useEffect, useState } from "react";

export function useLowEnd() {
  const [lowEnd, setLowEnd] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const lowCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const saveData = nav.connection?.saveData === true;
    const slowConn = nav.connection?.effectiveType ? /2g|slow-2g/.test(nav.connection.effectiveType) : false;

    setLowEnd(reducedMotion || saveData || slowConn || (lowMemory && lowCores) || (coarsePointer && lowCores));
  }, []);

  return lowEnd;
}
