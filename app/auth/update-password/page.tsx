import { UpdatePasswordForm } from "@/components/update-password-form";
import { Lock, ArrowLeft } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

export default function Page() {
  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-br from-brand-olive/10 via-background to-brand-olive-light/10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 right-16 w-20 h-20 bg-brand-olive/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-20 w-28 h-28 bg-brand-olive-light/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 relative z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            y: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
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
                  delay: 0.6,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                }}
              >
                <Lock className="h-6 w-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-brand-olive">Update Password</h1>
            </div>
            <p className="text-medium-contrast">
              Enter your new password to secure your account.
            </p>
          </motion.div>
          
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
              scale: { type: "spring", visualDuration: 0.5, bounce: 0.2 }
            }}
          >
            <UpdatePasswordForm />
          </motion.div>
          
          {/* Back to Login */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              y: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-brand-olive hover:text-brand-olive/80 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
