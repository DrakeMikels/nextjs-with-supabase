"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Calendar, 
  Users, 
  BarChart3, 
  ChevronDown, 
  TrendingUp,
  Edit3,
  CalendarDays,
  UserCheck,
  PieChart,
  GraduationCap,
  ClipboardList,
  MapPin,
  Heart
} from "lucide-react";
import * as motion from "motion/react-client";
import { BiWeeklyPeriodList } from "./bi-weekly-period-list";
import { SafetyMetricsForm } from "./safety-metrics-form";
import { CoachManagement } from "./coach-management";
import { MetricsDashboard } from "./metrics-dashboard";
import { MasterDashboard } from "./master-dashboard";
import { IdpDashboard } from "./idp-dashboard";
import { ActionItems } from "./action-items";
import { AnimatedContainer, AnimatedItem, LoadingSkeleton } from "@/components/ui/animated-container";
import type { BiWeeklyPeriod, Coach } from "@/lib/types";
import { BranchVisits } from "./branch-visits";
import { CprFirstAid } from "./cpr-first-aid";
import { MeetingView } from "./meeting-view";

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

// Animation variants for the circular reveal sidebar
const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
      opacity: { duration: 0.3 },
      y: { type: "spring", stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.3,
      scale: { type: "spring", visualDuration: 0.3 },
      opacity: { duration: 0.2 },
      y: { stiffness: 1000 },
    },
  },
};

// Custom hook for dimensions
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

// Animated hamburger menu
const Path = (props: React.ComponentProps<typeof motion.path>) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) => (
  <motion.button
    onClick={toggle}
    className="outline-none border-none cursor-pointer absolute top-4 left-4 w-12 h-12 rounded-full bg-transparent z-50 text-white"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <svg width="23" height="23" viewBox="0 0 23 23" className="w-full h-full">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </motion.button>
);

export function BiWeeklyDashboard() {
  const [periods, setPeriods] = useState<BiWeeklyPeriod[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BiWeeklyPeriod | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("master"); // Default to Master View
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string}>({
    start: "",
    end: ""
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);
  const supabase = createClient();

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
        className="flex h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="w-64 bg-brand-off-white border-r border-brand-olive/20 p-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            duration: 0.4,
            x: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <LoadingSkeleton className="h-8 w-32 mb-6" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.1,
                  scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 }
                }}
              >
                <LoadingSkeleton className="h-10 w-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          className="flex-1 p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2,
            y: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <LoadingSkeleton className="h-8 w-64" />
              <LoadingSkeleton className="h-4 w-48" />
            </div>
            <LoadingSkeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + (i * 0.1),
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 }
                }}
              >
                <LoadingSkeleton className="h-24" />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              scale: { type: "spring", visualDuration: 0.5, bounce: 0.1 }
            }}
          >
            <LoadingSkeleton className="h-96" />
          </motion.div>
        </motion.div>
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
      {/* Animated Sidebar with Circular Reveal */}
      <motion.nav
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        className="fixed lg:static inset-y-0 left-0 z-40 w-64"
      >
        {/* Circular reveal background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-brand-olive via-brand-olive-light to-brand-olive-medium"
          variants={sidebarVariants}
          custom={height}
        />
        
        {/* Navigation content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Enhanced background pattern for better texture */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          {/* Subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="p-6 border-b border-white/30 relative z-10 pt-16 lg:pt-6">
            <h2 className="text-lg font-semibold text-white drop-shadow-md">Navigation</h2>
            <p className="text-sm text-white/90 drop-shadow-sm">Regional Safety Coaches</p>
          </div>
          
          <motion.div 
            className="flex-1 p-4 space-y-2 relative z-10"
            variants={navVariants}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false); // Close mobile sidebar on selection
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-white/25 text-white shadow-lg border border-white/40 drop-shadow-sm' 
                      : 'text-white/90 hover:bg-white/15 hover:text-white hover:drop-shadow-sm'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'drop-shadow-sm' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${isActive ? 'drop-shadow-sm' : ''}`}>{item.label}</div>
                    <div className={`text-xs truncate ${isActive ? 'text-white/95 drop-shadow-sm' : 'text-white/75'}`}>
                      {item.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
        
        {/* Animated Menu Toggle */}
        <MenuToggle toggle={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />
      </motion.nav>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-background border-b border-brand-olive/20 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-12 lg:ml-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-olive">
                {currentNavItem?.label || "Dashboard"}
              </h1>
              <p className="text-medium-contrast text-sm sm:text-base">
                {currentNavItem?.description || "Regional Safety Coaches Dashboard"}
              </p>
            </div>
            <Button 
              onClick={createNewPeriod} 
              className="gap-2 bg-brand-olive hover:bg-brand-olive/90 text-white w-full sm:w-auto hover-lift hover-glow"
            >
              <PlusCircle className="h-4 w-4" />
              New Period
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-4 lg:p-6 border-b border-brand-olive/10">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Periods", value: periods.length, icon: Calendar, color: "brand-olive" },
              { title: "Active Coaches", value: coaches.length, icon: Users, color: "brand-olive-light" },
              { title: "Current Period", value: selectedPeriod?.period_name || "None", icon: BarChart3, color: "brand-olive-medium", isDropdown: true },
              { title: "Custom Date Range", value: "", icon: Calendar, color: "brand-olive-soft", isCustomRange: true }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
                }}
              >
                <Card className={`border-${card.color}/20 hover:border-${card.color}/40 transition-colors hover-lift`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-high-contrast">{card.title}</CardTitle>
                    <card.icon className={`h-4 w-4 text-${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    {card.isDropdown ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-auto p-0 text-left justify-start hover:bg-transparent w-full hover-scale"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className={`text-xl sm:text-2xl font-bold text-${card.color} truncate`}>
                                {selectedPeriod?.period_name || "None"}
                              </div>
                              <ChevronDown className={`h-4 w-4 text-${card.color} flex-shrink-0`} />
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          {periods.map((period) => (
                            <DropdownMenuItem
                              key={period.id}
                              onClick={() => setSelectedPeriod(period)}
                              className={selectedPeriod?.id === period.id ? "bg-brand-olive/10" : ""}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{period.period_name}</span>
                                <span className="text-xs text-medium-contrast">
                                  {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : card.isCustomRange ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => setCustomDateRange(prev => ({...prev, start: e.target.value}))}
                            className="text-xs h-8"
                            placeholder="Start date"
                          />
                          <Input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange(prev => ({...prev, end: e.target.value}))}
                            className="text-xs h-8"
                            placeholder="End date"
                          />
                        </div>
                        {customDateRange.start && customDateRange.end && (
                          <div className={`text-xs text-${card.color} font-medium`}>
                            {new Date(customDateRange.start).toLocaleDateString()} - {new Date(customDateRange.end).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`text-2xl font-bold text-${card.color}`}>{card.value}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
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