"use client";

import { motion, Variants } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function LoadingOverlay({ isVisible, onComplete }: LoadingOverlayProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible, onComplete]);

  if (!showContent) return null;

  const dotVariants: Variants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Transparent background */}
      <motion.div
        className="absolute inset-0 bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Center content */}
      <div className="relative z-10 text-center">
        <motion.h2
          className="text-2xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Loading Dashboard
        </motion.h2>
        
        {/* Three dots jumping animation */}
        <motion.div
          animate="jump"
          transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
          className="container"
        >
          <motion.div className="dot" variants={dotVariants} />
          <motion.div className="dot" variants={dotVariants} />
          <motion.div className="dot" variants={dotVariants} />
        </motion.div>
        
        <motion.p
          className="text-white/70 text-sm mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Preparing your safety management platform...
        </motion.p>
      </div>
      
      <StyleSheet />
    </motion.div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
      .container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
      }

      .dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #CDEA80;
          will-change: transform;
      }
      `}
    </style>
  );
} 