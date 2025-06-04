import { SignUpForm } from "@/components/sign-up-form";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Shield, UserPlus, Lock } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-olive/5 via-background to-brand-olive-light/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-brand-olive/10 rounded-full blur-xl animate-pulse-subtle"></div>
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-brand-olive-light/10 rounded-full blur-xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-brand-olive-medium/10 rounded-full blur-xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Signup Form */}
          <AnimatedContainer variant="slideInLeft" className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:hidden mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-brand-olive rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-brand-olive">RSC Platform</h1>
              </div>
              <p className="text-medium-contrast">Join the Regional Safety Coaches team</p>
            </div>
            
            <SignUpForm />
            
            <div className="mt-8 text-center">
              <p className="text-xs text-medium-contrast">
                Only authorized Freedom Forever team members can create accounts
              </p>
            </div>
          </AnimatedContainer>
          
          {/* Right Side - Branding & Info */}
          <AnimatedContainer variant="slideInRight" className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-olive rounded-xl">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-brand-olive">Join Our Team</h1>
                  <p className="text-brand-olive-medium">Authorized Access Only</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-high-contrast">Secure Registration Process</h2>
                <p className="text-medium-contrast leading-relaxed">
                  Your email must be pre-authorized by an administrator to create an account. This ensures secure access to our safety management platform.
                </p>
              </div>
            </div>
            
            {/* Info Cards */}
            <div className="grid gap-4">
              <AnimatedContainer variant="fadeInUp" delay={0.2} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 hover-lift">
                <div className="p-2 bg-brand-olive/10 rounded-lg">
                  <Lock className="h-5 w-5 text-brand-olive" />
                </div>
                <div>
                  <h3 className="font-medium text-high-contrast">Secure Access</h3>
                  <p className="text-sm text-medium-contrast">Email verification required</p>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer variant="fadeInUp" delay={0.4} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 hover-lift">
                <div className="p-2 bg-brand-olive-light/10 rounded-lg">
                  <Shield className="h-5 w-5 text-brand-olive-light" />
                </div>
                <div>
                  <h3 className="font-medium text-high-contrast">Authorized Users Only</h3>
                  <p className="text-sm text-medium-contrast">Pre-approved email addresses</p>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer variant="fadeInUp" delay={0.6} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 hover-lift">
                <div className="p-2 bg-brand-olive-medium/10 rounded-lg">
                  <UserPlus className="h-5 w-5 text-brand-olive-medium" />
                </div>
                <div>
                  <h3 className="font-medium text-high-contrast">Team Integration</h3>
                  <p className="text-sm text-medium-contrast">Seamless onboarding process</p>
                </div>
              </AnimatedContainer>
            </div>
          </AnimatedContainer>
          
        </div>
      </div>
    </div>
  );
}
