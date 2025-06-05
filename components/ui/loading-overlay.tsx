"use client";

import * as motion from "motion/react-client";
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background with off-black gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Animated lines container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Horizontal lines */}
        <div className="absolute inset-0 flex flex-col justify-center space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0.7, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeInOut",
                opacity: {
                  duration: 2,
                  delay: i * 0.1,
                }
              }}
              style={{ originX: 0.5 }}
            />
          ))}
        </div>
        
        {/* Vertical lines */}
        <div className="absolute inset-0 flex justify-center items-stretch space-x-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="w-0.5 bg-gradient-to-b from-transparent via-white to-transparent"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: [0, 1, 0.7, 0] }}
              transition={{
                duration: 1.5,
                delay: 0.3 + i * 0.1,
                ease: "easeInOut",
                opacity: {
                  duration: 2,
                  delay: 0.3 + i * 0.1,
                }
              }}
              style={{ originY: 0.5 }}
            />
          ))}
        </div>
        
        {/* Center logo/content */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.2,
            scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
          }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/30 flex items-center justify-center"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white/80" />
          </motion.div>
          
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            Loading Dashboard
          </motion.h2>
          
          <motion.p
            className="text-white/70 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
          >
            Preparing your safety management platform...
          </motion.p>
        </motion.div>
        
        {/* Animated dots */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
} 