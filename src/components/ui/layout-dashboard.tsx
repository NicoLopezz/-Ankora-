"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface LayoutDashboardIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LayoutDashboardIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RECT_VARIANTS: Variants = {
  normal: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  animate: (i: number) => ({
    scale: [0.6, 1],
    opacity: [0, 1],
    transition: { duration: 0.3, delay: i * 0.08 },
  }),
};

const LayoutDashboardIcon = forwardRef<LayoutDashboardIconHandle, LayoutDashboardIconProps>(
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
          <motion.rect x="3" y="3" width="7" height="9" rx="1" animate={controls} initial="normal" variants={RECT_VARIANTS} custom={0} />
          <motion.rect x="14" y="3" width="7" height="5" rx="1" animate={controls} initial="normal" variants={RECT_VARIANTS} custom={1} />
          <motion.rect x="14" y="12" width="7" height="9" rx="1" animate={controls} initial="normal" variants={RECT_VARIANTS} custom={2} />
          <motion.rect x="3" y="16" width="7" height="5" rx="1" animate={controls} initial="normal" variants={RECT_VARIANTS} custom={3} />
        </svg>
      </div>
    );
  }
);

LayoutDashboardIcon.displayName = "LayoutDashboardIcon";
export { LayoutDashboardIcon };
