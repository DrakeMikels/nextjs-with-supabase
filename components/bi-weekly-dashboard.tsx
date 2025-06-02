"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, Users, BarChart3 } from "lucide-react";
import { BiWeeklyPeriodList } from "./bi-weekly-period-list";
import { SafetyMetricsForm } from "./safety-metrics-form";
import { CoachManagement } from "./coach-management";
import { MetricsDashboard } from "./metrics-dashboard";
import { MasterDashboard } from "./master-dashboard";
import type { BiWeeklyPeriod, Coach } from "@/lib/types";

export function BiWeeklyDashboard() {
  const [periods, setPeriods] = useState<BiWeeklyPeriod[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BiWeeklyPeriod | null>(null);
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-olive">Regional Safety Coaches</h1>
          <p className="text-medium-contrast">Bi-Weekly Touch Base Tracker</p>
        </div>
        <Button onClick={createNewPeriod} className="gap-2 bg-brand-olive hover:bg-brand-olive/90 text-white">
          <PlusCircle className="h-4 w-4" />
          New Period
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="text-2xl font-bold text-brand-olive-medium">{selectedPeriod?.period_name || "None"}</div>
          </CardContent>
        </Card>
        <Card className="border-brand-olive-soft/20 hover:border-brand-olive-soft/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-brand-olive-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-brand-olive-soft font-medium">
              {selectedPeriod ? 
                `${new Date(selectedPeriod.start_date).toLocaleDateString()} - ${new Date(selectedPeriod.end_date).toLocaleDateString()}` 
                : "No period selected"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-brand-off-white border border-brand-olive/20">
          <TabsTrigger value="master" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast">📊 Master View</TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-brand-olive-light data-[state=active]:text-white text-medium-contrast">✏️ Quick Entry</TabsTrigger>
          <TabsTrigger value="periods" className="data-[state=active]:bg-brand-olive-medium data-[state=active]:text-white text-medium-contrast">📅 Periods</TabsTrigger>
          <TabsTrigger value="coaches" className="data-[state=active]:bg-brand-olive-soft data-[state=active]:text-white text-medium-contrast">👥 Coaches</TabsTrigger>
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-brand-olive-pale data-[state=active]:text-white text-medium-contrast">📈 Analytics</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
} 