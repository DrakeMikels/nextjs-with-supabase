"use client";

import * as motion from "motion/react-client";
import type { ReactNode } from "react";
import { forwardRef } from "react";

// Define our own types since motion/react-client doesn't export these
type MotionProps = React.ComponentProps<typeof motion.div>;
type Variants = Record<string, {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: number[] | string;
    staggerChildren?: number;
    delayChildren?: number;
    repeat?: number;
  };
}>;

// Animation variants for different entrance effects
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

// Staggered container for animating children
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
  }
};

interface AnimatedContainerProps extends Omit<MotionProps, 'variants' | 'initial' | 'animate'> {
  variant?: "fadeIn" | "slideUp" | "stagger" | "fadeInUp" | "fadeInDown" | "slideInLeft" | "slideInRight" | "scaleIn";
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ variant = "fadeIn", delay = 0, duration, children, ...props }, ref) => {
    const getVariants = () => {
      switch (variant) {
        case "fadeInUp": return fadeInUpVariants;
        case "fadeInDown": return fadeInDownVariants;
        case "slideInLeft": return slideInLeftVariants;
        case "slideInRight": return slideInRightVariants;
        case "scaleIn": return scaleInVariants;
        case "stagger": return staggerContainerVariants;
        default: return fadeInVariants;
      }
    };

    const variants = getVariants();
    
    // Override duration if provided
    if (duration) {
      const customVariants: Variants = {
        ...variants,
        visible: {
          ...(typeof variants.visible === 'object' ? variants.visible : {}),
          transition: {
            duration: 0.17,
            delay,
            ease: [0.4, 0, 0.2, 1]
          }
        }
      };
      
      return (
        <motion.div
          ref={ref}
          initial="hidden"
          animate="visible"
          variants={customVariants}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.17, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = "AnimatedContainer";

// Animated item for use within stagger containers
export const AnimatedItem = forwardRef<HTMLDivElement, AnimatedItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={staggerItemVariants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedItem.displayName = "AnimatedItem";

// Page transition wrapper
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Simple loading component without jarring effects
export const LoadingSpinner = () => {
  return (
    <motion.div
      className="flex items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-6 h-6 border-2 border-brand-olive/20 border-t-brand-olive rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

interface AnimatedItemProps extends Omit<MotionProps, 'variants' | 'initial' | 'animate'> {
  children: ReactNode;
  delay?: number;
} 