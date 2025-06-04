"use client";

import { LoginForm } from "@/components/login-form";
import { Shield, Users, BarChart3 } from "lucide-react";
import * as motion from "motion/react-client";
import { useAnimate, animate, stagger } from "motion/react";
import { splitText } from "motion-plus";
import { useEffect, useRef } from "react";

export default function Page() {
  const [gradientRef, animateGradient] = useAnimate();
  const headerTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gradientAnimation = animateGradient(
      gradientRef.current,
      {
        background: [
          "linear-gradient(180deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(200deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(220deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(240deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(260deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(280deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(300deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(320deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(340deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(360deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(180deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)"
        ]
      },
      {
        duration: 12.75,
        repeat: Infinity,
        ease: "easeInOut"
      }
    );

    return () => {
      gradientAnimation.cancel();
    };
  }, [animateGradient, gradientRef]);

  // Split text animation effect
  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!headerTextRef.current) return;

      // Hide the container until the fonts are loaded
      headerTextRef.current.style.visibility = "visible";

      const h1Element = headerTextRef.current.querySelector("h1");
      if (!h1Element) return;

      const { words } = splitText(h1Element);

      // Animate the words in the h1
      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 1.7, // 15% faster than 2s
          bounce: 0,
          delay: stagger(0.043), // 15% faster than 0.05s
        }
      );
    });
  }, []);

  return (
    <motion.div 
      className="min-h-screen w-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.51 }}
    >
      {/* Smooth Motion-Powered Gradient Background */}
      <div
        ref={gradientRef}
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)"
        }}
      />
      
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Enhanced Floating Elements with Motion - Consistent for both themes */}
      <motion.div 
        className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, 20, 0],
          y: [0, -10, 0]
        }}
        transition={{
          opacity: { duration: 0.58, delay: 0.17 },
          scale: { duration: 0.58, delay: 0.17, type: "spring", visualDuration: 0.58, bounce: 0.3 },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-16 w-36 h-36 bg-white/8 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, -15, 0],
          y: [0, 15, 0]
        }}
        transition={{
          opacity: { duration: 0.58, delay: 0.34 },
          scale: { duration: 0.58, delay: 0.34, type: "spring", visualDuration: 0.58, bounce: 0.3 },
          x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/12 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, 10, 0],
          y: [0, -20, 0]
        }}
        transition={{
          opacity: { duration: 0.58, delay: 0.51 },
          scale: { duration: 0.58, delay: 0.51, type: "spring", visualDuration: 0.58, bounce: 0.3 },
          x: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 11, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/3 w-28 h-28 bg-white/6 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, -25, 0],
          y: [0, 12, 0]
        }}
        transition={{
          opacity: { duration: 0.58, delay: 0.68 },
          scale: { duration: 0.58, delay: 0.68, type: "spring", visualDuration: 0.58, bounce: 0.3 },
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <motion.div 
            className="hidden lg:block space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.43,
              delay: 0.26,
              x: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            {/* Header Section with Dark Background and Split Text Animation */}
            <motion.div 
              className="space-y-6 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.37,
                delay: 0.43,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl border border-white/30 shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.29,
                    delay: 0.6,
                    scale: { type: "spring", visualDuration: 0.29, bounce: 0.4 }
                  }}
                >
                  <Shield className="h-8 w-8 text-white" />
                </motion.div>
                <div ref={headerTextRef} style={{ visibility: "hidden" }}>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    Regional Safety Coaches
                  </h1>
                  <p className="text-white/90 font-medium">Professional Safety Management Platform</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <motion.h2 
                  className="text-xl font-semibold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, delay: 1.0 }}
                >
                  Streamline Your Safety Operations
                </motion.h2>
                <motion.p 
                  className="text-white/90 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, delay: 1.2 }}
                >
                  Comprehensive bi-weekly tracking, coach management, and safety metrics in one powerful platform.
                </motion.p>
              </div>
            </motion.div>
            
            {/* Feature Cards with Dark Backgrounds */}
            <div className="grid gap-4">
              {[
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Real-time insights and reporting",
                  delay: 0.68
                },
                {
                  icon: Users,
                  title: "Coach Management", 
                  description: "Track development and certifications",
                  delay: 0.85
                },
                {
                  icon: Shield,
                  title: "Safety Metrics",
                  description: "Comprehensive tracking and reporting", 
                  delay: 1.02
                }
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl hover-lift"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.43,
                    delay: feature.delay,
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.14, type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <motion.div 
                    className="p-3 bg-white/20 rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.22,
                      delay: feature.delay + 0.17,
                      scale: { type: "spring", visualDuration: 0.22, bounce: 0.4 }
                    }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right Side - Login Form */}
          <motion.div 
            className="w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.43,
              delay: 0.34,
              x: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            {/* Mobile Header with Dark Background */}
            <motion.div 
              className="text-center lg:hidden mb-8 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.37,
                delay: 0.43,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl border border-white/30 shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.29,
                    delay: 0.6,
                    scale: { type: "spring", visualDuration: 0.29, bounce: 0.4 }
                  }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">RSC Platform</h1>
              </div>
              <p className="text-white/90 font-medium">
                Regional Safety Coaches Dashboard
              </p>
            </motion.div>
            
            {/* Login Form Container with Dark Background */}
            <motion.div
              className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.43,
                delay: 0.51,
                scale: { type: "spring", visualDuration: 0.43, bounce: 0.2 }
              }}
            >
              <LoginForm />
            </motion.div>
            
            {/* Footer Text with Dark Background */}
            <motion.div 
              className="mt-6 text-center p-4 bg-black/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.22,
                delay: 0.77,
                scale: { type: "spring", visualDuration: 0.22, bounce: 0.4 }
              }}
            >
              <p className="text-sm text-white/90 font-medium">
                Only authorized Freedom Forever team members can access this system
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>

      {/* Split Text Animation Styles */}
      <style jsx>{`
        .split-word {
          will-change: transform, opacity;
        }
      `}</style>
    </motion.div>
  );
}
