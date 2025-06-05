"use client";

import { LoginForm } from "@/components/login-form";
import { Shield, Users, BarChart3 } from "lucide-react";
import * as motion from "motion/react-client";
import { useAnimate } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { SplitText } from "@/components/ui/split-text";

export default function Page() {
  const [gradientRef, animateGradient] = useAnimate();
  const [init, setInit] = useState(false);

  // Initialize tsParticles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    const gradientAnimation = animateGradient(
      gradientRef.current,
      {
        backgroundPosition: [
          "0% 0%",
          "25% 25%", 
          "50% 50%",
          "75% 75%",
          "100% 100%",
          "75% 75%",
          "50% 50%",
          "25% 25%",
          "0% 0%"
        ],
        background: [
          "linear-gradient(135deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(135deg, #2C5134 0%, #4E855A 50%, #1a1a1a 100%)",
          "linear-gradient(135deg, #4E855A 0%, #1a1a1a 50%, #2C5134 100%)",
          "linear-gradient(135deg, #1a1a1a 0%, #4E855A 50%, #2C5134 100%)",
          "linear-gradient(135deg, #2C5134 0%, #1a1a1a 50%, #4E855A 100%)",
          "linear-gradient(135deg, #4E855A 0%, #2C5134 50%, #1a1a1a 100%)",
          "linear-gradient(135deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          "linear-gradient(135deg, #2C5134 0%, #4E855A 50%, #1a1a1a 100%)",
          "linear-gradient(135deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)"
        ]
      },
      {
        duration: 30,
        repeat: Infinity,
        ease: "easeInOut"
      }
    );

    return () => {
      gradientAnimation.cancel();
    };
  }, [animateGradient, gradientRef]);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  // Particles configuration adapted from your JSON with olive theme
  const options: ISourceOptions = useMemo(
    () => ({
      autoPlay: true,
      background: {
        color: {
          value: "transparent" // Let our gradient show through
        }
      },
      fullScreen: {
        enable: false, // Don't take full screen, let it be part of our layout
        zIndex: 0
      },
      detectRetina: true,
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onClick: {
            enable: true,
            mode: "push"
          },
          onHover: {
            enable: true,
            mode: "repulse"
          },
          resize: {
            delay: 0.5,
            enable: true
          }
        },
        modes: {
          push: {
            quantity: 4
          },
          repulse: {
            distance: 200,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: "ease-out-quad"
          }
        }
      },
      particles: {
        color: {
          value: "#4E855A", // Our olive color
          animation: {
            h: {
              count: 0,
              enable: true,
              speed: 10,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0
            }
          }
        },
        links: {
          color: {
            value: "#ffffff"
          },
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out"
          },
          random: false,
          speed: 3,
          straight: false
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080
          },
          value: 80
        },
        opacity: {
          value: 0.5
        },
        shape: {
          type: "circle"
        },
        size: {
          value: {
            min: 1,
            max: 3
          }
        }
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true
    }),
    []
  );

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
          background: "linear-gradient(135deg, #1a1a1a 0%, #2C5134 50%, #4E855A 100%)",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%"
        }}
      />
      
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* tsParticles Background */}
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          className="absolute inset-0"
        />
      )}
      
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
            {/* Header Section with Split Text Animation */}
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
              <div className="text-center space-y-2">
                <SplitText 
                  text="RSC Platform" 
                  className="mb-2"
                  staggerDelay={0.08}
                />
                <motion.p
                  className="text-lg font-medium"
                  style={{ color: "#F6F6F6", fontFamily: "'Inter', 'Articulat CF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.2,
                    ease: "easeOut"
                  }}
                >
                  Safety Management System
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
            {/* Mobile Header with Split Text */}
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
              <div className="space-y-2">
                <SplitText 
                  text="RSC Platform" 
                  className="mb-2"
                  staggerDelay={0.08}
                />
                <motion.p
                  className="text-base font-medium"
                  style={{ color: "#F6F6F6", fontFamily: "'Inter', 'Articulat CF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.2,
                    ease: "easeOut"
                  }}
                >
                  Safety Management System
                </motion.p>
              </div>
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


    </motion.div>
  );
}
