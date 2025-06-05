"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as motion from "motion/react-client";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Show loading overlay before redirect
      setShowLoadingOverlay(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    // Redirect to main dashboard after loading animation
    router.push("/");
  };

  return (
    <>
      <LoadingOverlay 
        isVisible={showLoadingOverlay} 
        onComplete={handleLoadingComplete}
      />
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.34,
            scale: { type: "spring", visualDuration: 0.34, bounce: 0.2 }
          }}
        >
        <Card className="hover-lift">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.34,
                delay: 0.2,
                y: { type: "spring", stiffness: 100, damping: 15 }
              }}
            >
              <CardTitle className="text-2xl text-brand-olive font-bold">Login</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email below to login to your account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <motion.div 
                  className="grid gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.34,
                    delay: 0.3,
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                >
                  <Label htmlFor="email" className="text-gray-800 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mobile-touch-target text-gray-900 placeholder:text-gray-500"
                  />
                </motion.div>
                <motion.div 
                  className="grid gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.34,
                    delay: 0.35,
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                >
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-800 font-medium">Password</Label>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm text-brand-olive hover:text-brand-olive/80 underline-offset-4 hover:underline hover-scale font-medium"
                      >
                        Forgot your password?
                      </Link>
                    </motion.div>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mobile-touch-target text-gray-900 placeholder:text-gray-500"
                  />
                </motion.div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.26,
                      scale: { type: "spring", visualDuration: 0.26, bounce: 0.3 },
                      y: { type: "spring", stiffness: 100, damping: 15 }
                    }}
                  >
                    <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-200">{error}</p>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.34,
                    delay: 0.4,
                    y: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full mobile-touch-target bg-brand-olive hover:bg-brand-olive/90 hover-lift text-white font-semibold" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </>
  );
}
