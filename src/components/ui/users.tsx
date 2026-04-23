"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface UsersIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UsersIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const LEFT_VARIANTS: Variants = {
  normal: { x: 0, transition: { duration: 0.2 } },
  animate: { x: [0, -2, 0], transition: { duration: 0.4 } },
};

const RIGHT_VARIANTS: Variants = {
  normal: { x: 0, opacity: 1, transition: { duration: 0.2 } },
  animate: { x: [4, 0], opacity: [0, 1], transition: { duration: 0.4, delay: 0.1 } },
};

const UsersIcon = forwardRef<UsersIconHandle, UsersIconProps>(
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
          {/* Left user (main) */}
          <motion.g animate={controls} initial="normal" variants={LEFT_VARIANTS}>
            <circle cx="9" cy="7" r="4" />
            <path d="M3 21v-1a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v1" />
          </motion.g>
          {/* Right user (slides in) */}
          <motion.g animate={controls} initial="normal" variants={RIGHT_VARIANTS}>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M22 21v-1a6 6 0 0 0-3-5.2" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

UsersIcon.displayName = "UsersIcon";
export { UsersIcon };
