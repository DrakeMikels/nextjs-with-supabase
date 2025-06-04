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
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as motion from "motion/react-client";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      let errorMessage = error instanceof Error ? error.message : "An error occurred";
      
      // Provide more user-friendly error message for unauthorized emails
      if (errorMessage.includes("not authorized to sign up")) {
        errorMessage = "Your email address is not authorized to create an account. Please contact an administrator to be added to the authorized users list.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
              <CardTitle className="text-2xl text-brand-olive">Sign up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
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
                <motion.div 
                  className="grid gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3,
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                >
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mobile-touch-target"
                  />
                </motion.div>
                <motion.div 
                  className="grid gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4,
                    x: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                >
                  <div className="flex items-center">
                    <Label htmlFor="repeat-password">Repeat Password</Label>
                  </div>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
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
                    delay: 0.5,
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
                      {isLoading ? "Creating an account..." : "Sign up"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
