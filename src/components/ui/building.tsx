"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface BuildingIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface BuildingIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FRAME_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.5 },
  },
};

const WINDOW_VARIANTS: Variants = {
  normal: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  animate: (i: number) => ({
    scale: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.25, delay: 0.25 + i * 0.05 },
  }),
};

const BuildingIcon = forwardRef<BuildingIconHandle, BuildingIconProps>(
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
          {/* Outer frame */}
          <motion.path
            d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
            animate={controls}
            initial="normal"
            variants={FRAME_VARIANTS}
          />
          <motion.path
            d="M6 22H2"
            animate={controls}
            initial="normal"
            variants={FRAME_VARIANTS}
          />
          <motion.path
            d="M18 22h4"
            animate={controls}
            initial="normal"
            variants={FRAME_VARIANTS}
          />
          {/* Door */}
          <motion.path
            d="M10 22v-4h4v4"
            animate={controls}
            initial="normal"
            variants={FRAME_VARIANTS}
          />
          {/* Windows — stagger */}
          <motion.line x1="10" y1="6" x2="10" y2="6.01" animate={controls} initial="normal" variants={WINDOW_VARIANTS} custom={0} />
          <motion.line x1="14" y1="6" x2="14" y2="6.01" animate={controls} initial="normal" variants={WINDOW_VARIANTS} custom={1} />
          <motion.line x1="10" y1="10" x2="10" y2="10.01" animate={controls} initial="normal" variants={WINDOW_VARIANTS} custom={2} />
          <motion.line x1="14" y1="10" x2="14" y2="10.01" animate={controls} initial="normal" variants={WINDOW_VARIANTS} custom={3} />
          <motion.line x1="10" y1="14" x2="10" y2="14.01" animate={controls} initial="normal" variants={WINDOW_VARIANTS} custom={4} />
          <motion.line x1="14" y1="14" x2="14" y2="14.01" animate={controls} initial="normal" variants={WINDOW_VARIANTS} custom={5} />
        </svg>
      </div>
    );
  }
);

BuildingIcon.displayName = "BuildingIcon";
export { BuildingIcon };
