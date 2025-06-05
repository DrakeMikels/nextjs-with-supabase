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
      transition={{ duration: 0.5 }}
    >
      {/* Background overlay with gradient to fade out login screen */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(44, 81, 52, 0.95) 50%, rgba(78, 133, 90, 0.95) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Center content */}
      <div className="relative z-10 text-center">
        <motion.h2
          className="text-2xl font-bold text-white mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Loading Dashboard
        </motion.h2>
        
        {/* Three dots jumping animation with enhanced visibility */}
        <motion.div
          className="container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div 
            className="dot" 
            animate="jump"
            variants={dotVariants}
            transition={{ delay: 0 }}
          />
          <motion.div 
            className="dot" 
            animate="jump"
            variants={dotVariants}
            transition={{ delay: 0.2 }}
          />
          <motion.div 
            className="dot" 
            animate="jump"
            variants={dotVariants}
            transition={{ delay: 0.4 }}
          />
        </motion.div>
        
        <motion.p
          className="text-white/90 text-sm mt-8 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
          box-shadow: 0 4px 12px rgba(205, 234, 128, 0.4);
      }
      `}
    </style>
  );
} 