"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Calendar, Users, BarChart3, ChevronDown } from "lucide-react";
import { BiWeeklyPeriodList } from "./bi-weekly-period-list";
import { SafetyMetricsForm } from "./safety-metrics-form";
import { CoachManagement } from "./coach-management";
import { MetricsDashboard } from "./metrics-dashboard";
import { MasterDashboard } from "./master-dashboard";
import { IdpDashboard } from "./idp-dashboard";
import { IdpOverview } from "./idp-overview";
import type { BiWeeklyPeriod, Coach } from "@/lib/types";

export function BiWeeklyDashboard() {
  const [periods, setPeriods] = useState<BiWeeklyPeriod[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BiWeeklyPeriod | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("master"); // Default to Master View
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
    setActiveTab("metrics");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-olive">Regional Safety Coaches</h1>
          <p className="text-medium-contrast text-sm sm:text-base">Bi-Weekly Touch Base Tracker</p>
        </div>
        <Button onClick={createNewPeriod} className="gap-2 bg-brand-olive hover:bg-brand-olive/90 text-white w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          New Period
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-brand-olive/20 hover:border-brand-olive/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Total Periods</CardTitle>
            <Calendar className="h-4 w-4 text-brand-olive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-olive">{periods.length}</div>
          </CardContent>
        </Card>
        <Card className="border-brand-olive-light/20 hover:border-brand-olive-light/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Active Coaches</CardTitle>
            <Users className="h-4 w-4 text-brand-olive-light" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-olive-light">{coaches.length}</div>
          </CardContent>
        </Card>
        <Card className="border-brand-olive-medium/20 hover:border-brand-olive-medium/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Current Period</CardTitle>
            <BarChart3 className="h-4 w-4 text-brand-olive-medium" />
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 text-left justify-start hover:bg-transparent w-full"
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
        <Card className="border-brand-olive-soft/20 hover:border-brand-olive-soft/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-brand-olive-soft" />
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 text-left justify-start hover:bg-transparent w-full"
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-6 bg-brand-off-white border border-brand-olive/20 min-w-max w-full">
            <TabsTrigger value="master" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">📊 Master View</TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-brand-olive-light data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">✏️ Quick Entry</TabsTrigger>
            <TabsTrigger value="periods" className="data-[state=active]:bg-brand-olive-medium data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">📅 Periods</TabsTrigger>
            <TabsTrigger value="coaches" className="data-[state=active]:bg-brand-olive-soft data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">👥 Coaches</TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-brand-olive-pale data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">📈 Analytics</TabsTrigger>
            <TabsTrigger value="idp" className="data-[state=active]:bg-brand-olive-pale data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">🎓 IDP</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="master" className="space-y-4">
          <MasterDashboard 
            periods={periods}
            coaches={coaches}
            onDataChange={fetchData}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {selectedPeriod ? (
            <SafetyMetricsForm 
              period={selectedPeriod}
              coaches={coaches}
              onDataChange={fetchData}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Period Selected</CardTitle>
                <CardDescription>
                  Please select a bi-weekly period to enter safety metrics.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="periods" className="space-y-4">
          <BiWeeklyPeriodList 
            periods={periods} 
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
            onPeriodsChange={setPeriods}
            onOpenPeriod={handleOpenPeriod}
          />
        </TabsContent>

        <TabsContent value="coaches" className="space-y-4">
          <CoachManagement 
            coaches={coaches}
            onCoachesChange={setCoaches}
          />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <MetricsDashboard 
            periods={periods}
            coaches={coaches}
          />
        </TabsContent>

        <TabsContent value="idp" className="space-y-4">
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-olive">Individual Development Plans</h2>
                <p className="text-medium-contrast text-sm sm:text-base">Professional development and certification tracking for coaches</p>
              </div>
            </div>
            
            <TabsList className="grid w-full grid-cols-2 bg-brand-off-white border border-brand-olive/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast text-xs sm:text-sm">
                📋 Team Overview
              </TabsTrigger>
              <TabsTrigger value="individual" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast text-xs sm:text-sm">
                👤 Individual Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <IdpOverview 
                coaches={coaches}
              />
            </TabsContent>

            <TabsContent value="individual" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {coaches.map((coach) => (
                  <div key={coach.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
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
                        className="text-xs sm:text-sm bg-brand-olive text-white px-3 py-1 rounded hover:bg-brand-olive-light w-full sm:w-auto"
                      >
                        View IDP
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCoach && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button 
                      onClick={() => setSelectedCoach(null)}
                      className="text-xs sm:text-sm text-brand-olive hover:underline"
                    >
                      ← Back to Coach List
                    </button>
                  </div>
                  <IdpDashboard 
                    coach={selectedCoach}
                    onDataChange={fetchData}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
} 