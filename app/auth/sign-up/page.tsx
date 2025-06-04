import { SignUpForm } from "@/components/sign-up-form";
import { Shield, UserPlus, Lock } from "lucide-react";
import * as motion from "motion/react-client";

export default function Page() {
  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-br from-brand-olive/5 via-background to-brand-olive-light/5 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements with Motion */}
      <motion.div 
        className="absolute top-20 right-10 w-20 h-20 bg-brand-olive/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-16 w-32 h-32 bg-brand-olive-light/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-brand-olive-medium/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Signup Form */}
          <motion.div 
            className="w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              x: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <motion.div 
              className="text-center lg:hidden mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  className="p-3 bg-brand-olive rounded-xl"
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
                <h1 className="text-2xl font-bold text-brand-olive">RSC Platform</h1>
              </div>
              <p className="text-medium-contrast">Join the Regional Safety Coaches team</p>
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
              <SignUpForm />
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
              <p className="text-xs text-medium-contrast">
                Only authorized Freedom Forever team members can create accounts
              </p>
            </motion.div>
          </motion.div>
          
          {/* Right Side - Branding & Info */}
          <motion.div 
            className="hidden lg:block space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              x: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-3 bg-brand-olive rounded-xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.8,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                  }}
                >
                  <UserPlus className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-brand-olive">Join Our Team</h1>
                  <p className="text-brand-olive-medium">Authorized Access Only</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-high-contrast">Secure Registration Process</h2>
                <p className="text-medium-contrast leading-relaxed">
                  Your email must be pre-authorized by an administrator to create an account. This ensures secure access to our safety management platform.
                </p>
              </div>
            </motion.div>
            
            {/* Info Cards */}
            <div className="grid gap-4">
              {[
                {
                  icon: Lock,
                  title: "Secure Access",
                  description: "Email verification required",
                  delay: 1.0
                },
                {
                  icon: Shield,
                  title: "Authorized Users Only",
                  description: "Pre-approved email addresses",
                  delay: 1.2
                },
                {
                  icon: UserPlus,
                  title: "Team Integration",
                  description: "Seamless onboarding process",
                  delay: 1.4
                }
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 bg-white/50 rounded-lg border border-brand-olive/10 hover-lift"
                  initial={{ opacity: 0, x: 20 }}
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
                    className="p-2 bg-brand-olive/10 rounded-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: feature.delay + 0.1,
                      scale: { type: "spring", visualDuration: 0.3, bounce: 0.3 }
                    }}
                  >
                    <feature.icon className="h-5 w-5 text-brand-olive" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-high-contrast">{feature.title}</h3>
                    <p className="text-sm text-medium-contrast">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
