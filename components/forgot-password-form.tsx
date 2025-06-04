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
import { useState } from "react";
import * as motion from "motion/react-client";
import { CheckCircle } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
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
                  delay: 0.1,
                  y: { type: "spring", stiffness: 100, damping: 15 }
                }}
                className="flex items-center gap-3"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                  }}
                >
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </motion.div>
                <div>
                  <CardTitle className="text-2xl text-green-800">Check Your Email</CardTitle>
                  <CardDescription className="text-green-700">Password reset instructions sent</CardDescription>
                </div>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.p 
                className="text-sm text-green-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3,
                  y: { type: "spring", stiffness: 100, damping: 15 }
                }}
              >
                If you registered using your email and password, you will receive
                a password reset email.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 }
          }}
        >
          <Card className="hover-lift">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  y: { type: "spring", stiffness: 100, damping: 15 }
                }}
              >
                <CardTitle className="text-2xl text-brand-olive">Reset Your Password</CardTitle>
                <CardDescription>
                  Type in your email and we&apos;ll send you a link to reset your
                  password
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-6">
                  <motion.div 
                    className="grid gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      x: { type: "spring", stiffness: 100, damping: 15 }
                    }}
                  >
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mobile-touch-target"
                    />
                  </motion.div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        scale: { type: "spring", visualDuration: 0.3, bounce: 0.3 },
                        y: { type: "spring", stiffness: 100, damping: 15 }
                      }}
                    >
                      <p className="text-sm text-red-500">{error}</p>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3,
                      y: { type: "spring", stiffness: 100, damping: 15 }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full mobile-touch-target bg-brand-olive hover:bg-brand-olive/90 hover-lift" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send reset email"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div 
                  className="mt-4 text-center text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5,
                    y: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                >
                  Already have an account?{" "}
                  <motion.div
                    className="inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/auth/login"
                      className="text-brand-olive hover:text-brand-olive/80 font-medium"
                    >
                      Login
                    </Link>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
