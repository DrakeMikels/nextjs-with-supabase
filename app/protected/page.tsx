import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Shield, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-br from-brand-olive/5 via-background to-brand-olive-light/5 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 right-16 w-24 h-24 bg-brand-olive/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-20 w-32 h-32 bg-brand-olive-light/10 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          scale: { type: "spring", visualDuration: 0.8, bounce: 0.3 }
        }}
      />
      
      <div className="flex-1 w-full flex flex-col gap-12 max-w-4xl mx-auto p-6 relative z-10">
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            y: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <motion.div 
            className="bg-green-50 border border-green-200 text-sm p-4 px-6 rounded-lg text-green-800 flex gap-3 items-center hover-lift"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.5,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.7,
                scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
              }}
            >
              <CheckCircle size="18" strokeWidth={2} />
            </motion.div>
            <span>Successfully authenticated! You have access to the protected dashboard.</span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col gap-6 items-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.6,
            x: { type: "spring", stiffness: 100, damping: 15 }
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
              <User className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="font-bold text-2xl text-brand-olive">Your Account Details</h2>
          </div>
          
          <motion.div 
            className="w-full bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 p-4 hover-lift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.9,
              y: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-brand-olive">Email:</span>
                <span className="text-high-contrast">{data.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-brand-olive">User ID:</span>
                <span className="text-high-contrast font-mono text-xs">{data.user.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-brand-olive">Last Sign In:</span>
                <span className="text-high-contrast">
                  {data.user.last_sign_in_at ? new Date(data.user.last_sign_in_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.7,
            x: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 bg-brand-olive-light rounded-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 1.0,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
              }}
            >
              <Shield className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="font-bold text-2xl text-brand-olive">Regional Safety Coaches Tracker</h2>
          </div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 1.1,
              y: { type: "spring", stiffness: 100, damping: 15 }
            }}
          >
            <p className="text-medium-contrast leading-relaxed">
              Welcome to the Regional Safety Coaches Bi-Weekly Tracker! You now have full access to 
              track safety metrics, manage coach information, and monitor bi-weekly reporting periods.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-brand-olive text-white px-6 py-3 rounded-lg hover:bg-brand-olive/90 font-medium hover-lift hover-glow"
              >
                <ArrowLeft size="18" />
                Go to Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
