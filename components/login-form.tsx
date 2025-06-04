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
import { AnimatedContainer } from "@/components/ui/animated-container";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      // Redirect to main dashboard after successful login
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AnimatedContainer variant="scaleIn">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-2xl text-brand-olive font-bold">Login</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
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
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-800 font-medium">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm text-brand-olive hover:text-brand-olive/80 underline-offset-4 hover:underline hover-scale font-medium"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mobile-touch-target text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                {error && (
                  <AnimatedContainer variant="fadeInUp">
                    <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-200">{error}</p>
                  </AnimatedContainer>
                )}
                <Button 
                  type="submit" 
                  className="w-full mobile-touch-target bg-brand-olive hover:bg-brand-olive/90 hover-lift text-white font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  );
}
