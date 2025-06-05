"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { 
  PlusCircle, 
   
  Users, 
  BarChart3, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Edit3,
  CalendarDays,
  UserCheck,
  PieChart,
  GraduationCap,
  ClipboardList,
  MapPin,
  Heart,
  Shield
} from "lucide-react";
import * as motion from "motion/react-client";
import { BiWeeklyPeriodList } from "./bi-weekly-period-list";
import { SafetyMetricsForm } from "./safety-metrics-form";
import { CoachManagement } from "./coach-management";
import { MetricsDashboard } from "./metrics-dashboard";
import { MasterDashboard } from "./master-dashboard";
import { IdpDashboard } from "./idp-dashboard";
import { ActionItems } from "./action-items";
import { AnimatedContainer, AnimatedItem, LoadingSpinner } from "@/components/ui/animated-container";
import type { BiWeeklyPeriod, Coach } from "@/lib/types";
import { BranchVisits } from "./branch-visits";
import { CprFirstAid } from "./cpr-first-aid";
import { MeetingView } from "./meeting-view";
import MobileNavigation from "./mobile-navigation";

const navigationItems = [
  {
    id: "master",
    label: "Master View",
    icon: TrendingUp,
    description: "Complete overview of all metrics"
  },
  {
    id: "meeting",
    label: "Meeting View",
    icon: Users,
    description: "Side-by-side coach view for meetings"
  },
  {
    id: "metrics",
    label: "Quick Entry",
    icon: Edit3,
    description: "Enter safety metrics quickly"
  },
  {
    id: "periods",
    label: "Periods",
    icon: CalendarDays,
    description: "Manage bi-weekly periods"
  },
  {
    id: "coaches",
    label: "Coaches",
    icon: UserCheck,
    description: "Manage coach information"
  },
  {
    id: "dashboard",
    label: "Analytics",
    icon: PieChart,
    description: "View detailed analytics"
  },
  {
    id: "idp",
    label: "IDP",
    icon: GraduationCap,
    description: "Individual development plans"
  },
  {
    id: "action-items",
    label: "Action Items",
    icon: ClipboardList,
    description: "Manage action items"
  },
  {
    id: "branch-visits",
    label: "Branch Visits",
    icon: MapPin,
    description: "Track branch assignments and visits"
  },
  {
    id: "cpr-first-aid",
    label: "CPR/First Aid",
    icon: Heart,
    description: "Track CPR and First Aid certifications"
  }
];

// Animation variants for accordion-style sidebar with welcome sequence
const sidebarVariants = {
  open: {
    width: "16rem", // 64 * 0.25rem = 16rem
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    width: "4rem", // 16 * 0.25rem = 4rem
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  welcome: {
    width: "16rem",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      delay: 0.5, // Slight delay for dramatic effect
    },
  },
  // Mobile-specific variants
  mobileOpen: {
    width: "85vw", // Take up most of the screen on mobile
    maxWidth: "320px", // But not too wide on larger phones
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  mobileClosed: {
    width: "0px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const navVariants = {
  open: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  closed: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
  welcome: {
    transition: { staggerChildren: 0.08, delayChildren: 0.8 }, // Slower, more dramatic stagger
  },
  mobileOpen: {
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
  mobileClosed: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      x: { type: "spring", stiffness: 300, damping: 25 },
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      x: { type: "spring", stiffness: 300, damping: 25 },
    },
  },
  welcome: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      x: { type: "spring", stiffness: 250, damping: 20 },
    },
  },
  mobileOpen: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      x: { type: "spring", stiffness: 400, damping: 25 },
    },
  },
  mobileClosed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
      x: { type: "spring", stiffness: 400, damping: 25 },
    },
  },
};

const iconVariants = {
  open: {
    scale: 1,
    transition: {
      duration: 0.2,
      scale: { type: "spring", stiffness: 400, damping: 25 },
    },
  },
  closed: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      scale: { type: "spring", stiffness: 400, damping: 25 },
    },
  },
  welcome: {
    scale: [1, 1.05, 1], // Subtle pulse effect
    transition: {
      duration: 0.6,
      scale: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  mobileOpen: {
    scale: 1,
    transition: {
      duration: 0.2,
      scale: { type: "spring", stiffness: 400, damping: 25 },
    },
  },
  mobileClosed: {
    scale: 1,
    transition: {
      duration: 0.2,
      scale: { type: "spring", stiffness: 400, damping: 25 },
    },
  },
};

export function BiWeeklyDashboard() {
  const [periods, setPeriods] = useState<BiWeeklyPeriod[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BiWeeklyPeriod | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("master"); // Default to Master View
  const [sidebarOpen, setSidebarOpen] = useState(true); // Always start expanded for welcoming experience
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track first load for welcome animation

  const [isMobile, setIsMobile] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState(false);
  const supabase = createClient();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile by default
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [periodsResult, coachesResult] = await Promise.all([
        supabase
          .from("bi_weekly_periods")
          .select("*")
          .order("start_date", { ascending: false }),
        supabase
          .from("coaches")
          .select("*")
          .order("name")
      ]);

      if (periodsResult.data) {
        setPeriods(periodsResult.data);
        if (periodsResult.data.length > 0 && !selectedPeriod) {
          setSelectedPeriod(periodsResult.data[0]);
        }
      }

      if (coachesResult.data) {
        setCoaches(coachesResult.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      // After data loads, mark first load as complete
      setTimeout(() => setIsFirstLoad(false), 2000);
    }
  }, [supabase, selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createNewPeriod = async () => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 13); // 2 weeks

    const periodName = `${startDate.getMonth() + 1}-${startDate.getDate()}-${startDate.getFullYear().toString().slice(-2)}`;

    try {
      const { data, error } = await supabase
        .from("bi_weekly_periods")
        .insert({
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          period_name: periodName
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPeriods([data, ...periods]);
        setSelectedPeriod(data);
      }
    } catch (error) {
      console.error("Error creating period:", error);
    }
  };

  const handleOpenPeriod = (period: BiWeeklyPeriod) => {
    setSelectedPeriod(period);
    setActiveView("metrics");
  };

  const currentNavItem = navigationItems.find(item => item.id === activeView);

  const renderContent = () => {
    switch (activeView) {
      case "master":
        return (
          <MasterDashboard 
            periods={periods}
            coaches={coaches}
            onDataChange={fetchData}
          />
        );
      case "metrics":
        return selectedPeriod ? (
          <SafetyMetricsForm 
            period={selectedPeriod}
            coaches={coaches}
            onDataChange={fetchData}
          />
        ) : (
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>No Period Selected</CardTitle>
              <CardDescription>
                Please select a bi-weekly period to enter safety metrics.
              </CardDescription>
            </CardHeader>
          </Card>
        );
      case "periods":
        return (
          <BiWeeklyPeriodList 
            periods={periods} 
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
            onPeriodsChange={setPeriods}
            onOpenPeriod={handleOpenPeriod}
          />
        );
      case "coaches":
        return (
          <CoachManagement 
            coaches={coaches}
            onCoachesChange={setCoaches}
          />
        );
      case "dashboard":
        return (
          <MetricsDashboard 
            periods={periods}
            coaches={coaches}
            selectedPeriod={selectedPeriod}
          />
        );
      case "idp":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-olive">Individual Development Plans</h2>
                <p className="text-medium-contrast text-sm sm:text-base">Professional development and certification tracking for coaches</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach) => (
                <AnimatedItem key={coach.id}>
                  <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer hover-lift">
                    <h3 className="font-semibold text-high-contrast text-sm sm:text-base">{coach.name}</h3>
                    <p className="text-xs sm:text-sm text-medium-contrast">
                      Hired: {coach.date_of_hire ? new Date(coach.date_of_hire).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-medium-contrast">
                      Vacation: {coach.vacation_days_remaining}/{coach.vacation_days_total} days
                    </p>
                    <div className="mt-3">
                      <button 
                        onClick={() => setSelectedCoach(coach)}
                        className="text-xs sm:text-sm bg-brand-olive text-white px-3 py-1 rounded hover:bg-brand-olive-light w-full sm:w-auto hover-scale"
                      >
                        View IDP
                      </button>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </div>

            {selectedCoach && (
              <AnimatedContainer variant="fadeInUp" className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setSelectedCoach(null)}
                    className="text-xs sm:text-sm text-brand-olive hover:underline hover-scale"
                  >
                    ← Back to Coach List
                  </button>
                </div>
                <IdpDashboard 
                  coach={selectedCoach}
                  onDataChange={fetchData}
                />
              </AnimatedContainer>
            )}
          </div>
        );
      case "action-items":
        return (
          <ActionItems 
            coaches={coaches}
            onDataChange={fetchData}
          />
        );
      case "branch-visits":
        return (
          <BranchVisits 
            coaches={coaches}
            onDataChange={fetchData}
          />
        );
      case "cpr-first-aid":
        return (
          <CprFirstAid 
            coaches={coaches}
            onDataChange={fetchData}
          />
        );
      case "meeting":
        return (
          <MeetingView 
            coaches={coaches}
            selectedPeriod={selectedPeriod}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex items-center justify-center"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile Navigation - Only show on mobile */}
      {isMobile && (
        <MobileNavigation 
          activeView={activeView}
          onViewChange={setActiveView}
        />
      )}

      {/* Desktop Sidebar - Only show on desktop */}
      {!isMobile && (
        <motion.nav
          initial={false}
          animate={
            isFirstLoad && sidebarOpen 
              ? "welcome" 
              : sidebarOpen 
                ? "open" 
                : "closed"
          }
          variants={sidebarVariants}
          className="fixed lg:static inset-y-0 left-0 z-40 bg-gradient-to-b from-brand-olive via-brand-olive-light to-brand-olive-medium dark:from-brand-olive-medium dark:via-brand-olive-soft dark:to-brand-olive-pale border-r border-white/20 overflow-hidden"
        >
          {/* Navigation content */}
          <div className="flex flex-col h-full relative">
            {/* Enhanced background pattern for better texture */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Welcome pulse effect for first load */}
            {isFirstLoad && (
              <motion.div
                className="absolute inset-0 bg-white/5 rounded-r-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ 
                  duration: 2,
                  delay: 1.2,
                  ease: "easeInOut"
                }}
              />
            )}
            
            <div className="p-4 border-b border-white/30 relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-white/20 rounded-lg border border-white/30 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isFirstLoad ? { scale: [1, 1.1, 1] } : {}}
                  transition={isFirstLoad ? { duration: 1, delay: 1.5 } : {}}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="min-w-0"
                >
                  <h2 className="text-sm font-semibold text-white drop-shadow-md truncate">Navigation</h2>
                  <p className="text-xs text-white/90 drop-shadow-sm truncate">Regional Safety Coaches</p>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="flex-1 p-2 space-y-1 relative z-10"
              variants={navVariants}
              animate={
                isFirstLoad && sidebarOpen 
                  ? "welcome" 
                  : sidebarOpen 
                    ? "open" 
                    : "closed"
              }
            >
              {/* Welcome tooltip for first-time users */}
              {isFirstLoad && (
                <motion.div
                  className="absolute -right-4 top-4 bg-white text-brand-olive px-3 py-2 rounded-lg shadow-lg text-sm font-medium z-50"
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{ 
                    duration: 0.4,
                    delay: 2.5,
                  }}
                  style={{ 
                    clipPath: "polygon(0 50%, 12px 0, 100% 0, 100% 100%, 12px 100%)"
                  }}
                >
                  <div className="ml-3">
                    Welcome! Explore your dashboard
                  </div>
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 4, duration: 0.5 }}
                    className="absolute inset-0 bg-white rounded-lg"
                  />
                </motion.div>
              )}
              
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveView(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 rounded-lg text-left transition-all duration-200 group relative py-2.5
                      ${isActive 
                        ? 'bg-white/25 text-white shadow-lg border border-white/40 drop-shadow-sm' 
                        : 'text-white/90 hover:bg-white/15 hover:text-white hover:drop-shadow-sm'
                      }
                      ${isFirstLoad ? 'animate-pulse-subtle' : ''}
                    `}
                  >
                    <motion.div
                      variants={iconVariants}
                      className="flex-shrink-0"
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'drop-shadow-sm' : ''}`} />
                    </motion.div>
                    <motion.div 
                      variants={itemVariants}
                      className="flex-1 min-w-0"
                    >
                      <div className={`font-medium text-sm truncate ${isActive ? 'drop-shadow-sm' : ''}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs truncate ${isActive ? 'text-white/95 drop-shadow-sm' : 'text-white/75'}`}>
                        {item.description}
                      </div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
            
            {/* Toggle Button */}
            <div className="p-4 border-t border-white/30 relative z-10">
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: sidebarOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </motion.div>
                <motion.span
                  variants={itemVariants}
                  className="text-sm font-medium"
                >
                  {sidebarOpen ? 'Collapse' : 'Expand'}
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-background border-b border-brand-olive/20 p-2 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile menu button - Only show on mobile for the new navigation */}
              {isMobile && (
                <div className="w-12 h-12" /> // Spacer for mobile navigation toggle
              )}
              
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brand-olive">
                {currentNavItem?.label || "Dashboard"}
              </h1>
              <p className="text-medium-contrast text-xs sm:text-sm lg:text-base">
                {currentNavItem?.description || "Regional Safety Coaches Dashboard"}
              </p>
            </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setStatsCollapsed(!statsCollapsed)}
                variant="outline"
                size="sm"
                className="gap-2 hover-scale"
              >
                {statsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                {statsCollapsed ? "Show Stats" : "Hide Stats"}
              </Button>
              <Button 
                onClick={createNewPeriod} 
                className="gap-2 bg-brand-olive hover:bg-brand-olive/90 text-white w-full sm:w-auto hover-lift hover-glow text-sm sm:text-base"
              >
                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">New Period</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="border-b border-brand-olive/10"
          initial={false}
          animate={{ 
            opacity: statsCollapsed ? 0 : 1,
            scaleY: statsCollapsed ? 0 : 1,
            transformOrigin: "top"
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut"
          }}
          style={{
            display: statsCollapsed ? 'none' : 'block'
          }}
        >
          <div className="p-2 sm:p-3 lg:p-5">
            <div className="grid gap-2 sm:gap-4 grid-cols-1">
              {[
                { title: "Period Selector", value: selectedPeriod?.period_name || "None", icon: BarChart3, color: "brand-olive-medium", isDropdown: true }
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + (index * 0.05),
                    ease: "easeOut",
                  }}
                >
                  <Card className={`border-${card.color}/20 hover:border-${card.color}/40 hover:shadow-lg transition-all duration-300 hover-lift`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 lg:p-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-high-contrast">{card.title}</CardTitle>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + (index * 0.05),
                          ease: "easeOut",
                        }}
                      >
                        <card.icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${card.color}`} />
                      </motion.div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                      {card.isDropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-auto p-0 text-left justify-start hover:bg-transparent w-full hover-scale"
                        >
                          <div className="flex items-center gap-2 w-full">
                                <motion.div 
                                  className={`text-lg sm:text-xl lg:text-2xl font-bold text-${card.color} truncate`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.3 + (index * 0.05),
                                    ease: "easeOut",
                                  }}
                                >
                              {selectedPeriod?.period_name || "None"}
                                </motion.div>
                                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-${card.color} flex-shrink-0`} />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>Select Period</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedPeriod(null)}>
                          All Periods
                        </DropdownMenuItem>
                        {periods.map((period) => (
                          <DropdownMenuItem
                            key={period.id}
                            onClick={() => setSelectedPeriod(period)}
                          >
                            {period.period_name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                      ) : (
                        <motion.div 
                          className={`text-lg sm:text-xl lg:text-2xl font-bold text-${card.color}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.3 + (index * 0.05),
                            ease: "easeOut",
                          }}
                        >
                          {card.value}
                        </motion.div>
                      )}
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto">
          <motion.div 
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              y: { type: "spring", stiffness: 100, damping: 15 },
            }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 