"use client";

import { useId } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type Props = {
  text?: string;
  size?: number;
  className?: string;
};

export function RotatingSeal({
  text = "ARKARA  •  TOKENIZACIÓN  •  ACTIVOS REALES  •  ",
  size = 180,
  className,
}: Props) {
  const id = useId().replace(/:/g, "-");
  const { scrollY } = useScroll();
  // una vuelta completa cada 1200px de scroll
  const rotate = useTransform(scrollY, (y) => (y / 1200) * 360);

  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <motion.div
      aria-hidden
      style={{ rotate, width: size, height: size }}
      className={className}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        <defs>
          <path
            id={`seal-${id}`}
            d={`M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
            fill="none"
          />
        </defs>
        <text
          className="fill-[var(--bronze)]"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          <textPath href={`#seal-${id}`} startOffset="0">
            {text.repeat(2)}
          </textPath>
        </text>
        <circle
          cx={cx}
          cy={cy}
          r={r - 14}
          fill="none"
          className="stroke-[var(--bronze)]/25"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r="3"
          className="fill-[var(--bronze)]"
        />
      </svg>
    </motion.div>
  );
}
