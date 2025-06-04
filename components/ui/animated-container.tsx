"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { forwardRef } from "react";

// Animation variants for different entrance effects
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
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
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  variant?: "fadeIn" | "fadeInUp" | "fadeInDown" | "slideInLeft" | "slideInRight" | "scaleIn" | "stagger";
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ variant = "fadeIn", delay = 0, duration, staggerChildren = false, children, ...props }, ref) => {
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
            duration,
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
        transition={{ delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = "AnimatedContainer";

// Animated item for use within stagger containers
export const AnimatedItem = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
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

// Loading skeleton component
export const LoadingSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`loading-skeleton rounded ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  );
}; 