"use client";

import * as motion from "motion/react-client";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<ButtonProps, 'asChild'> {
  animationType?: "lift" | "scale" | "glow" | "bounce";
  disabled?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animationType = "lift", disabled, children, ...props }, ref) => {
    const getAnimationProps = () => {
      if (disabled) return {};
      
      switch (animationType) {
        case "lift":
          return {
            whileHover: { y: -2 },
            whileTap: { y: 0 },
            transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
          };
        case "scale":
          return {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
          };
        case "glow":
          return {
            whileHover: { 
              boxShadow: "0 0 20px rgba(44, 81, 52, 0.3)",
              y: -1
            },
            whileTap: { y: 0 },
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
          };
        case "bounce":
          return {
            whileHover: { y: -3 },
            whileTap: { y: -1, scale: 0.98 },
            transition: { 
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          };
        default:
          return {};
      }
    };

    return (
      <motion.div {...getAnimationProps()}>
        <Button
          ref={ref}
          className={cn(
            "transition-all duration-200",
            disabled && "pointer-events-none",
            className
          )}
          disabled={disabled}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton"; 