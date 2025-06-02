import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 max-w-4xl mx-auto p-6">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(data.user, null, 2)}
        </pre>
      </div>
      
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl mb-4">Regional Safety Coaches Tracker</h2>
        <p className="text-muted-foreground">
          You&apos;re successfully authenticated! You can now access the full Regional Safety Coaches 
          Bi-Weekly Tracker application.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size="16" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
