"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface PieChartIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PieChartIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SLICE_VARIANTS: Variants = {
  normal: { rotate: 0, transition: { duration: 0.3 } },
  animate: { rotate: [0, 90, 0], transition: { duration: 0.6 } },
};

const CIRCLE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
  animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.5 } },
};

const PieChartIcon = forwardRef<PieChartIconHandle, PieChartIconProps>(
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
          <motion.path
            d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
            animate={controls}
            initial="normal"
            variants={CIRCLE_VARIANTS}
          />
          <motion.path
            d="M12 3v9h9"
            animate={controls}
            initial="normal"
            variants={SLICE_VARIANTS}
            style={{ originX: "12px", originY: "12px" }}
          />
        </svg>
      </div>
    );
  }
);

PieChartIcon.displayName = "PieChartIcon";
export { PieChartIcon };
