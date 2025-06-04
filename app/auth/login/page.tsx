import { LoginForm } from "@/components/login-form";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Shield, Users, BarChart3 } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-olive/5 via-background to-brand-olive-light/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brand-olive/10 rounded-full blur-xl animate-pulse-subtle"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-brand-olive-light/10 rounded-full blur-xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-olive-medium/10 rounded-full blur-xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <AnimatedContainer variant="slideInLeft" className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-olive rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-brand-olive">Regional Safety Coaches</h1>
                  <p className="text-brand-olive-medium">Professional Safety Management Platform</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-high-contrast">Streamline Your Safety Operations</h2>
                <p className="text-medium-contrast leading-relaxed">
                  Comprehensive bi-weekly tracking, coach management, and safety metrics in one powerful platform.
                </p>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="grid gap-4">
              <AnimatedContainer variant="fadeInUp" delay={0.2} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 hover-lift">
                <div className="p-2 bg-brand-olive/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-brand-olive" />
                </div>
                <div>
                  <h3 className="font-medium text-high-contrast">Analytics Dashboard</h3>
                  <p className="text-sm text-medium-contrast">Real-time insights and reporting</p>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer variant="fadeInUp" delay={0.4} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 hover-lift">
                <div className="p-2 bg-brand-olive-light/10 rounded-lg">
                  <Users className="h-5 w-5 text-brand-olive-light" />
                </div>
                <div>
                  <h3 className="font-medium text-high-contrast">Coach Management</h3>
                  <p className="text-sm text-medium-contrast">Track development and certifications</p>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer variant="fadeInUp" delay={0.6} className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-olive/10 hover-lift">
                <div className="p-2 bg-brand-olive-medium/10 rounded-lg">
                  <Shield className="h-5 w-5 text-brand-olive-medium" />
                </div>
                <div>
                  <h3 className="font-medium text-high-contrast">Safety Metrics</h3>
                  <p className="text-sm text-medium-contrast">Comprehensive tracking and reporting</p>
                </div>
              </AnimatedContainer>
            </div>
          </AnimatedContainer>
          
          {/* Right Side - Login Form */}
          <AnimatedContainer variant="slideInRight" className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:hidden mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-brand-olive rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-brand-olive">RSC Platform</h1>
              </div>
              <p className="text-medium-contrast">Regional Safety Coaches Management</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-8 text-center">
              <p className="text-xs text-medium-contrast">
                Secure access for authorized Freedom Forever team members
              </p>
            </div>
          </AnimatedContainer>
          
        </div>
      </div>
    </div>
  );
}
