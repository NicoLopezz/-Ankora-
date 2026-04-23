"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface CoinsIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CoinsIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const COIN_BACK_VARIANTS: Variants = {
  normal: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  animate: { y: [-6, 0], opacity: [0, 1], transition: { duration: 0.35, delay: 0.1 } },
};

const COIN_FRONT_VARIANTS: Variants = {
  normal: { rotate: 0, transition: { duration: 0.2 } },
  animate: { rotate: [0, -8, 0], transition: { duration: 0.4 } },
};

const CoinsIcon = forwardRef<CoinsIconHandle, CoinsIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) onMouseEnter?.(e);
        else controls.start("animate");
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) onMouseLeave?.(e);
        else controls.start("normal");
      },
      [controls, onMouseLeave]
    );

    return (
      <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back coin */}
          <motion.g animate={controls} initial="normal" variants={COIN_BACK_VARIANTS}>
            <circle cx="15" cy="9" r="6" />
          </motion.g>
          {/* Front coin (flips) */}
          <motion.g
            animate={controls}
            initial="normal"
            variants={COIN_FRONT_VARIANTS}
            style={{ originX: "9px", originY: "15px" }}
          >
            <circle cx="9" cy="15" r="6" />
            <path d="M7 15h4" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

CoinsIcon.displayName = "CoinsIcon";
export { CoinsIcon };
