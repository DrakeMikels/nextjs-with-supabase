import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-br from-red-50 via-background to-red-100/20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-32 right-24 w-20 h-20 bg-red-200/30 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute bottom-24 left-20 w-28 h-28 bg-orange-200/20 rounded-full blur-xl"
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
              <Card className="hover-lift border-red-200 bg-red-50/50">
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
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl text-red-800">
                        Sorry, something went wrong.
                      </CardTitle>
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
                    {params?.error ? (
                      <div className="space-y-2">
                        <p className="text-sm text-red-700 font-medium">
                          Error Details:
                        </p>
                        <motion.div 
                          className="p-3 bg-red-100/50 rounded-lg border border-red-200"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.8,
                            scale: { type: "spring", visualDuration: 0.3, bounce: 0.3 }
                          }}
                        >
                          <p className="text-sm text-red-800 font-mono">
                            {params.error}
                          </p>
                        </motion.div>
                      </div>
                    ) : (
                      <p className="text-sm text-red-700">
                        An unspecified error occurred. Please try again or contact support if the problem persists.
                      </p>
                    )}
                    
                    <motion.div 
                      className="flex gap-3 pt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.9,
                        y: { type: "spring", stiffness: 100, damping: 15 }
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button 
                          onClick={() => window.location.reload()}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </motion.div>
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
                delay: 1.0,
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
