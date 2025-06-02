"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Calendar, Target, AlertTriangle } from "lucide-react";

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

interface SafetyMetric {
  id: string;
  period_id: string;
  coach_id: string;
  site_safety_evaluations: number;
  forensic_survey_audits: number;
  warehouse_safety_audits: number;
  open_investigations_injuries: number;
  open_investigations_auto: number;
  open_investigations_property_damage: number;
  open_investigations_near_miss: number;
  coaches: {
    name: string;
  };
  bi_weekly_periods: {
    period_name: string;
    start_date: string;
  };
}

interface MetricsDashboardProps {
  periods: BiWeeklyPeriod[];
  coaches: Coach[];
}

export function MetricsDashboard({ periods, coaches }: MetricsDashboardProps) {
  const [metrics, setMetrics] = useState<SafetyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("safety_metrics")
        .select(`
          *,
          coaches(name),
          bi_weekly_periods(period_name, start_date)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMetrics();
  }, [periods, fetchMetrics]);

  const calculateTotalsByCoach = () => {
    const totals = coaches.map(coach => {
      const coachMetrics = metrics.filter(m => m.coach_id === coach.id);
      return {
        coach,
        totalEvaluations: coachMetrics.reduce((sum, m) => sum + m.site_safety_evaluations, 0),
        totalAudits: coachMetrics.reduce((sum, m) => sum + m.forensic_survey_audits, 0),
        totalWarehouseAudits: coachMetrics.reduce((sum, m) => sum + m.warehouse_safety_audits, 0),
        totalInvestigations: coachMetrics.reduce((sum, m) => 
          sum + m.open_investigations_injuries + m.open_investigations_auto + 
          m.open_investigations_property_damage + m.open_investigations_near_miss, 0),
        periodsReported: coachMetrics.length
      };
    });
    return totals;
  };

  const calculateOverallStats = () => {
    const totalEvaluations = metrics.reduce((sum, m) => sum + m.site_safety_evaluations, 0);
    const totalAudits = metrics.reduce((sum, m) => sum + m.forensic_survey_audits, 0);
    const totalWarehouseAudits = metrics.reduce((sum, m) => sum + m.warehouse_safety_audits, 0);
    const totalInvestigations = metrics.reduce((sum, m) => 
      sum + m.open_investigations_injuries + m.open_investigations_auto + 
      m.open_investigations_property_damage + m.open_investigations_near_miss, 0);

    return {
      totalEvaluations,
      totalAudits,
      totalWarehouseAudits,
      totalInvestigations,
      avgEvaluationsPerPeriod: periods.length > 0 ? (totalEvaluations / periods.length).toFixed(1) : "0",
      avgAuditsPerPeriod: periods.length > 0 ? (totalAudits / periods.length).toFixed(1) : "0"
    };
  };

  const getRecentTrends = () => {
    const recentPeriods = periods.slice(0, 3);
    return recentPeriods.map(period => {
      const periodMetrics = metrics.filter(m => m.period_id === period.id);
      return {
        period: period.period_name,
        evaluations: periodMetrics.reduce((sum, m) => sum + m.site_safety_evaluations, 0),
        audits: periodMetrics.reduce((sum, m) => sum + m.forensic_survey_audits, 0),
        investigations: periodMetrics.reduce((sum, m) => 
          sum + m.open_investigations_injuries + m.open_investigations_auto + 
          m.open_investigations_property_damage + m.open_investigations_near_miss, 0)
      };
    });
  };

  const getGoalProgress = () => {
    const monthlyEvaluationGoal = 12; // 12-15 per month
    const monthlyAuditGoal = 12; // 12-15 per month
    const monthlyWarehouseGoal = 2; // 2 per month

    const stats = calculateOverallStats();
    const periodsPerMonth = 2; // Bi-weekly = 2 periods per month
    const monthlyPeriods = Math.ceil(periods.length / periodsPerMonth);

    return {
      evaluationProgress: monthlyPeriods > 0 ? (stats.totalEvaluations / (monthlyEvaluationGoal * monthlyPeriods)) * 100 : 0,
      auditProgress: monthlyPeriods > 0 ? (stats.totalAudits / (monthlyAuditGoal * monthlyPeriods)) * 100 : 0,
      warehouseProgress: monthlyPeriods > 0 ? (stats.totalWarehouseAudits / (monthlyWarehouseGoal * monthlyPeriods)) * 100 : 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  const coachTotals = calculateTotalsByCoach();
  const overallStats = calculateOverallStats();
  const trends = getRecentTrends();
  const goalProgress = getGoalProgress();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Safety metrics overview and performance tracking</p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {overallStats.avgEvaluationsPerPeriod} per period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalAudits}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {overallStats.avgAuditsPerPeriod} per period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouse Audits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalWarehouseAudits}</div>
            <p className="text-xs text-muted-foreground">
              Goal: 2 per month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Investigations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalInvestigations}</div>
            <p className="text-xs text-muted-foreground">
              All types combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>Progress towards monthly safety goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Site Safety Evaluations (Goal: 12-15/month)</span>
              <span className="text-sm text-muted-foreground">{goalProgress.evaluationProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(goalProgress.evaluationProgress, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Forensic/Survey Audits (Goal: 12-15/month)</span>
              <span className="text-sm text-muted-foreground">{goalProgress.auditProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(goalProgress.auditProgress, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Warehouse Safety Audits (Goal: 2/month)</span>
              <span className="text-sm text-muted-foreground">{goalProgress.warehouseProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(goalProgress.warehouseProgress, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coach Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Coach Performance Summary</CardTitle>
          <CardDescription>Individual coach metrics across all periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coachTotals.map(({ coach, totalEvaluations, totalAudits, totalWarehouseAudits, totalInvestigations, periodsReported }) => (
              <div key={coach.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{coach.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {periodsReported} period{periodsReported !== 1 ? 's' : ''} reported
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{totalEvaluations}</div>
                    <div className="text-muted-foreground">Evaluations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{totalAudits}</div>
                    <div className="text-muted-foreground">Audits</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{totalWarehouseAudits}</div>
                    <div className="text-muted-foreground">Warehouse</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{totalInvestigations}</div>
                    <div className="text-muted-foreground">Investigations</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trends</CardTitle>
          <CardDescription>Performance over the last 3 bi-weekly periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div key={trend.period} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{trend.period}</span>
                  {index === 0 && <Badge variant="secondary">Latest</Badge>}
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{trend.evaluations}</div>
                    <div className="text-muted-foreground">Evaluations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{trend.audits}</div>
                    <div className="text-muted-foreground">Audits</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{trend.investigations}</div>
                    <div className="text-muted-foreground">Investigations</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 