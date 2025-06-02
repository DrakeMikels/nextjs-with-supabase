import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { BiWeeklyDashboard } from "@/components/bi-weekly-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"} className="text-lg">
              Regional Safety Coaches - Bi-Weekly Tracker
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav>
      
      <div className="flex-1 w-full">
        {hasEnvVars ? (
          <BiWeeklyDashboard />
        ) : (
          <div className="flex-1 flex flex-col gap-20 max-w-5xl mx-auto p-5">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Setup Required</h1>
              <p className="text-muted-foreground">
                Please configure your Supabase environment variables to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
