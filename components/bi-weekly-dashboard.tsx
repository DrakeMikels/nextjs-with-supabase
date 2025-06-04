"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
  Menu,
  X
} from "lucide-react";
import { BiWeeklyPeriodList } from "./bi-weekly-period-list";
import { SafetyMetricsForm } from "./safety-metrics-form";
import { CoachManagement } from "./coach-management";
import { MetricsDashboard } from "./metrics-dashboard";
import { MasterDashboard } from "./master-dashboard";
import { IdpDashboard } from "./idp-dashboard";
import { IdpOverview } from "./idp-overview";
import { AnimatedContainer, AnimatedItem, LoadingSkeleton } from "@/components/ui/animated-container";
import type { BiWeeklyPeriod, Coach } from "@/lib/types";

const navigationItems = [
  {
    id: "master",
    label: "Master View",
    icon: TrendingUp,
    description: "Complete overview of all metrics"
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
  }
];

export function BiWeeklyDashboard() {
  const [periods, setPeriods] = useState<BiWeeklyPeriod[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BiWeeklyPeriod | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("master"); // Default to Master View
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
              {coaches.map((coach, index) => (
                <AnimatedItem key={coach.id} className={`stagger-${Math.min(index + 1, 7)}`}>
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
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AnimatedContainer variant="fadeIn" className="flex h-screen">
        <div className="w-64 bg-brand-off-white border-r border-brand-olive/20 p-4">
          <LoadingSkeleton className="h-8 w-32 mb-6" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <LoadingSkeleton className="h-8 w-64" />
              <LoadingSkeleton className="h-4 w-48" />
            </div>
            <LoadingSkeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-24" />
            ))}
          </div>
          <LoadingSkeleton className="h-96" />
        </div>
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer variant="stagger" className="flex h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background/95 backdrop-blur hover-scale"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-brand-off-white border-r border-brand-olive/20 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-brand-olive/20">
            <h2 className="text-lg font-semibold text-brand-olive">Navigation</h2>
            <p className="text-sm text-medium-contrast">Regional Safety Coaches</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false); // Close mobile sidebar on selection
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 hover-scale
                    ${isActive 
                      ? 'bg-brand-olive text-white shadow-sm' 
                      : 'text-medium-contrast hover:bg-brand-olive/10 hover:text-brand-olive'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-medium-contrast/80'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-background/95 backdrop-blur border-b border-brand-olive/20 p-4 lg:p-6">
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
          <AnimatedContainer variant="stagger" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatedItem>
              <Card className="border-brand-olive/20 hover:border-brand-olive/40 transition-colors hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-high-contrast">Total Periods</CardTitle>
                  <Calendar className="h-4 w-4 text-brand-olive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-olive">{periods.length}</div>
                </CardContent>
              </Card>
            </AnimatedItem>
            
            <AnimatedItem>
              <Card className="border-brand-olive-light/20 hover:border-brand-olive-light/40 transition-colors hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-high-contrast">Active Coaches</CardTitle>
                  <Users className="h-4 w-4 text-brand-olive-light" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-olive-light">{coaches.length}</div>
                </CardContent>
              </Card>
            </AnimatedItem>
            
            <AnimatedItem>
              <Card className="border-brand-olive-medium/20 hover:border-brand-olive-medium/40 transition-colors hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-high-contrast">Current Period</CardTitle>
                  <BarChart3 className="h-4 w-4 text-brand-olive-medium" />
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 text-left justify-start hover:bg-transparent w-full hover-scale"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className="text-xl sm:text-2xl font-bold text-brand-olive-medium truncate">
                            {selectedPeriod?.period_name || "None"}
                          </div>
                          <ChevronDown className="h-4 w-4 text-brand-olive-medium flex-shrink-0" />
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
                </CardContent>
              </Card>
            </AnimatedItem>
            
            <AnimatedItem>
              <Card className="border-brand-olive-soft/20 hover:border-brand-olive-soft/40 transition-colors hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-high-contrast">Date Range</CardTitle>
                  <Calendar className="h-4 w-4 text-brand-olive-soft" />
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 text-left justify-start hover:bg-transparent w-full hover-scale"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className="text-xs sm:text-sm text-brand-olive-soft font-medium truncate">
                            {selectedPeriod ? 
                              `${new Date(selectedPeriod.start_date).toLocaleDateString()} - ${new Date(selectedPeriod.end_date).toLocaleDateString()}` 
                              : "No period selected"
                            }
                          </div>
                          <ChevronDown className="h-4 w-4 text-brand-olive-soft flex-shrink-0" />
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
                </CardContent>
              </Card>
            </AnimatedItem>
          </AnimatedContainer>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatedContainer variant="fadeInUp" className="h-full">
            {renderContent()}
          </AnimatedContainer>
        </div>
      </div>
    </AnimatedContainer>
  );
} 