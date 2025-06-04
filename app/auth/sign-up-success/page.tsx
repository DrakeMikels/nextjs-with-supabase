import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

export default function Page() {
  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-br from-green-50 via-background to-brand-olive-light/10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-24 right-20 w-24 h-24 bg-green-200/30 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-16 w-32 h-32 bg-brand-olive/10 rounded-full blur-xl"
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
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 }
              }}
            >
              <Card className="hover-lift border-green-200 bg-green-50/50">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5,
                      y: { type: "spring", stiffness: 100, damping: 15 }
                    }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                      }}
                    >
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl text-green-800">
                        Thank you for signing up!
                      </CardTitle>
                      <CardDescription className="text-green-700">Check your email to confirm</CardDescription>
                    </div>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.7,
                      y: { type: "spring", stiffness: 100, damping: 15 }
                    }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-green-700">
                      You&apos;ve successfully signed up. Please check your email to
                      confirm your account before signing in.
                    </p>
                    
                    <motion.div 
                      className="flex items-center gap-3 p-3 bg-green-100/50 rounded-lg border border-green-200"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.8,
                        scale: { type: "spring", visualDuration: 0.3, bounce: 0.3 }
                      }}
                    >
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Check your inbox</p>
                        <p className="text-xs text-green-600">Click the confirmation link to activate your account</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Back to Login */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.9,
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
