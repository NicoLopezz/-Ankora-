"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ArrowLeftRightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ArrowLeftRightIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const TOP_VARIANTS: Variants = {
  normal: { x: 0, transition: { duration: 0.2 } },
  animate: { x: [0, 3, 0], transition: { duration: 0.4 } },
};

const BOTTOM_VARIANTS: Variants = {
  normal: { x: 0, transition: { duration: 0.2 } },
  animate: { x: [0, -3, 0], transition: { duration: 0.4, delay: 0.1 } },
};

const ArrowLeftRightIcon = forwardRef<ArrowLeftRightIconHandle, ArrowLeftRightIconProps>(
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
          <motion.g animate={controls} initial="normal" variants={TOP_VARIANTS}>
            <path d="M8 3L4 7l4 4" />
            <path d="M4 7h16" />
          </motion.g>
          <motion.g animate={controls} initial="normal" variants={BOTTOM_VARIANTS}>
            <path d="M16 21l4-4-4-4" />
            <path d="M20 17H4" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

ArrowLeftRightIcon.displayName = "ArrowLeftRightIcon";
export { ArrowLeftRightIcon };
