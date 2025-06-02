"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, Users, BarChart3 } from "lucide-react";
import { BiWeeklyPeriodList } from "./bi-weekly-period-list";
import { CoachManagement } from "./coach-management";
import { SafetyMetricsForm } from "./safety-metrics-form";
import { MetricsDashboard } from "./metrics-dashboard";

interface BiWeeklyPeriod {
  id: string;
  start_date: string;
  end_date: string;
  period_name: string;
  created_at: string;
}

interface Coach {
  id: string;
  name: string;
  date_of_hire: string | null;
  vacation_days_remaining: number;
  vacation_days_total: number;
}

export function BiWeeklyDashboard() {
  const [periods, setPeriods] = useState<BiWeeklyPeriod[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<BiWeeklyPeriod | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Regional Safety Coaches</h1>
          <p className="text-muted-foreground">Bi-Weekly Touch Base Tracker</p>
        </div>
        <Button onClick={createNewPeriod} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Period
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Periods</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periods.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coaches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coaches.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Period</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPeriod?.period_name || "None"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {selectedPeriod ? 
                `${new Date(selectedPeriod.start_date).toLocaleDateString()} - ${new Date(selectedPeriod.end_date).toLocaleDateString()}` 
                : "No period selected"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="periods">Bi-Weekly Periods</TabsTrigger>
          <TabsTrigger value="metrics">Safety Metrics</TabsTrigger>
          <TabsTrigger value="coaches">Coach Management</TabsTrigger>
          <TabsTrigger value="dashboard">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="periods" className="space-y-4">
          <BiWeeklyPeriodList 
            periods={periods} 
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
            onPeriodsChange={setPeriods}
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