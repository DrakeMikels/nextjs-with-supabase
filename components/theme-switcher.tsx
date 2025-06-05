"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { useAnimate } from "motion/react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [transitionRef, animateTransition] = useAnimate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced theme change with Motion gradient transition
  const handleThemeChange = async (newTheme: string) => {
    if (newTheme === theme || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Temporarily disable CSS transitions to prevent conflicts
    const style = document.createElement('style');
    style.textContent = `
      html, body, 
      .bg-background, .bg-card, .bg-popover, .bg-muted, .border-border,
      .text-foreground, .text-card-foreground, .text-popover-foreground, .text-muted-foreground {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Create a flowing gradient transition overlay
    if (transitionRef.current) {
      // Show the transition overlay
      transitionRef.current.style.display = 'block';
      
      // Animate the gradient flow based on theme direction
      const isGoingToDark = newTheme === 'dark';
      const gradientSequence = isGoingToDark 
        ? [
            "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)",
            "linear-gradient(135deg, #e9ecef 0%, #dee2e6 50%, #adb5bd 100%)",
            "linear-gradient(135deg, #adb5bd 0%, #6c757d 50%, #495057 100%)",
            "linear-gradient(135deg, #495057 0%, #343a40 50%, #212529 100%)",
            "linear-gradient(135deg, #212529 0%, #1a1a1a 50%, #000000 100%)"
          ]
        : [
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #212529 100%)",
            "linear-gradient(135deg, #212529 0%, #343a40 50%, #495057 100%)",
            "linear-gradient(135deg, #495057 0%, #6c757d 50%, #adb5bd 100%)",
            "linear-gradient(135deg, #adb5bd 0%, #dee2e6 50%, #e9ecef 100%)",
            "linear-gradient(135deg, #e9ecef 0%, #f8f9fa 50%, #ffffff 100%)"
          ];

      // Animate the flowing gradient transition
      await animateTransition(
        transitionRef.current,
        {
          background: gradientSequence,
          backgroundPosition: [
            "0% 0%",
            "25% 25%", 
            "50% 50%",
            "75% 75%",
            "100% 100%"
          ],
          opacity: [0, 0.95, 0.95, 0.95, 0]
        },
        {
          duration: 1.2,
          ease: "easeInOut"
        }
      );
      
      // Hide the overlay
      transitionRef.current.style.display = 'none';
    }
    
    // Change the theme in the middle of the animation
    setTimeout(() => {
      setTheme(newTheme);
    }, 600);
    
    // Re-enable CSS transitions after Motion animation completes
    setTimeout(() => {
      document.head.removeChild(style);
      setIsTransitioning(false);
    }, 1300);
  };

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <>
      {/* Motion-powered theme transition overlay */}
      <div
        ref={transitionRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          display: 'none',
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 0%'
        }}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="ghost" 
              size={"sm"} 
              className="hover:bg-brand-olive/10 relative overflow-hidden"
              disabled={isTransitioning}
            >
              {/* Animated background for button */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-olive/5 to-brand-olive-light/5"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              {/* Icon with smooth transitions */}
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative z-10"
              >
                {theme === "light" ? (
                  <Sun
                    size={ICON_SIZE}
                    className="text-high-contrast"
                  />
                ) : theme === "dark" ? (
                  <Moon
                    size={ICON_SIZE}
                    className="text-high-contrast"
                  />
                ) : (
                  <Laptop
                    size={ICON_SIZE}
                    className="text-high-contrast"
                  />
                )}
              </motion.div>
              
              {/* Loading indicator during transition */}
              {isTransitioning && (
                <motion.div
                  className="absolute inset-0 bg-brand-olive/20 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={handleThemeChange}
          >
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuRadioItem className="flex gap-2" value="light">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun size={ICON_SIZE} className="text-high-contrast" />
                </motion.div>
                <span className="text-high-contrast">Light</span>
              </DropdownMenuRadioItem>
            </motion.div>
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuRadioItem className="flex gap-2" value="dark">
                <motion.div
                  whileHover={{ rotate: -180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon size={ICON_SIZE} className="text-high-contrast" />
                </motion.div>
                <span className="text-high-contrast">Dark</span>
              </DropdownMenuRadioItem>
            </motion.div>
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuRadioItem className="flex gap-2" value="system">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Laptop size={ICON_SIZE} className="text-high-contrast" />
                </motion.div>
                <span className="text-high-contrast">System</span>
              </DropdownMenuRadioItem>
            </motion.div>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { ThemeSwitcher };
