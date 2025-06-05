"use client";

import * as motion from "motion/react-client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function MotionThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Track if we're in dark mode for the toggle state
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Simple theme toggle without complex transitions
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      className="toggle-container"
      style={{
        ...container,
        justifyContent: isDark ? "flex-end" : "flex-start",
        backgroundColor: isDark ? "#2C5134" : "#CDEA80",
      }}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Sun icon on the left */}
      <motion.div
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        animate={{
          opacity: isDark ? 0.4 : 0.8,
          scale: isDark ? 0.8 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Sun size={16} color={isDark ? "#CDEA80" : "#2C5134"} />
      </motion.div>

      {/* Moon icon on the right */}
      <motion.div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        animate={{
          opacity: isDark ? 0.8 : 0.4,
          scale: isDark ? 1 : 0.8,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Moon size={16} color={isDark ? "#CDEA80" : "#2C5134"} />
      </motion.div>

      {/* Animated handle */}
      <motion.div
        className="toggle-handle"
        style={{
          ...handle,
          backgroundColor: isDark ? "#CDEA80" : "#2C5134",
        }}
        layout
        transition={{
          type: "spring",
          visualDuration: 0.3,
          bounce: 0.1,
        }}
      />
    </motion.button>
  );
}

/**
 * ==============   Styles   ================
 */

const container = {
  width: 80,
  height: 40,
  borderRadius: 40,
  cursor: "pointer",
  display: "flex",
  padding: 4,
  position: "relative" as const,
  alignItems: "center",
  transition: "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "2px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  outline: "none",
};

const handle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  transition: "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
}; 