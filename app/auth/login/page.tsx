import { LoginForm } from "@/components/login-form";
import { Shield, Users, BarChart3 } from "lucide-react";
import * as motion from "motion/react-client";

export default function Page() {
  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-br from-brand-olive via-brand-olive-light to-brand-olive-medium relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Enhanced Floating Elements with Motion */}
      <motion.div 
        className="absolute top-20 left-10 w-24 h-24 bg-white/20 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-16 w-36 h-36 bg-white/15 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/25 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/3 w-28 h-28 bg-white/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
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
              duration: 0.6,
              delay: 0.3,
              x: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl border border-white/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.7,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                  }}
                >
                  <Shield className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-sm">Regional Safety Coaches</h1>
                  <p className="text-white/90 font-medium">Professional Safety Management Platform</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Streamline Your Safety Operations</h2>
                <p className="text-white/80 leading-relaxed">
                  Comprehensive bi-weekly tracking, coach management, and safety metrics in one powerful platform.
                </p>
              </div>
            </motion.div>
            
            {/* Feature Cards */}
            <div className="grid gap-4">
              {[
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Real-time insights and reporting",
                  delay: 0.8
                },
                {
                  icon: Users,
                  title: "Coach Management", 
                  description: "Track development and certifications",
                  delay: 1.0
                },
                {
                  icon: Shield,
                  title: "Safety Metrics",
                  description: "Comprehensive tracking and reporting", 
                  delay: 1.2
                }
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 bg-white/20 rounded-lg border border-white/30 hover-lift"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: feature.delay,
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="p-2 bg-white/20 rounded-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: feature.delay + 0.1,
                      scale: { type: "spring", visualDuration: 0.3, bounce: 0.3 }
                    }}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-white">{feature.title}</h3>
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
              duration: 0.6,
              delay: 0.4,
              x: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <motion.div 
              className="text-center lg:hidden mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl border border-white/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.7,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                  }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white">RSC Platform</h1>
              </div>
              <p className="text-white/90">
                Regional Safety Coaches Dashboard
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                scale: { type: "spring", visualDuration: 0.5, bounce: 0.2 }
              }}
            >
              <LoginForm />
            </motion.div>
            
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.9,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <p className="text-xs text-white/80">
                Only authorized Freedom Forever team members can access this system
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
