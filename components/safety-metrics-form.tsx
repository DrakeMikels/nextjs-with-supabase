"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, User } from "lucide-react";

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
  id?: string;
  period_id: string;
  coach_id: string;
  travel_plans: string;
  training_branch_location: string;
  site_safety_evaluations: number;
  forensic_survey_audits: number;
  warehouse_safety_audits: number;
  open_investigations_injuries: number;
  open_investigations_auto: number;
  open_investigations_property_damage: number;
  open_investigations_near_miss: number;
  do_hr_partnership_meeting: string;
  bm_pm_whs_partnership_meeting: string;
  lms_reports_date: string;
  tbt_attendance_reports_date: string;
  notes: string;
}

interface SafetyMetricsFormProps {
  period: BiWeeklyPeriod;
  coaches: Coach[];
  onDataChange: () => void;
}

export function SafetyMetricsForm({ period, coaches, onDataChange }: SafetyMetricsFormProps) {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [metrics, setMetrics] = useState<SafetyMetric>({
    period_id: period.id,
    coach_id: "",
    travel_plans: "",
    training_branch_location: "",
    site_safety_evaluations: 0,
    forensic_survey_audits: 0,
    warehouse_safety_audits: 0,
    open_investigations_injuries: 0,
    open_investigations_auto: 0,
    open_investigations_property_damage: 0,
    open_investigations_near_miss: 0,
    do_hr_partnership_meeting: "",
    bm_pm_whs_partnership_meeting: "",
    lms_reports_date: "",
    tbt_attendance_reports_date: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [existingMetrics, setExistingMetrics] = useState<SafetyMetric[]>([]);
  const supabase = createClient();

  const fetchExistingMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("safety_metrics")
        .select("*")
        .eq("period_id", period.id);

      if (error) throw error;
      setExistingMetrics(data || []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }, [supabase, period.id]);

  useEffect(() => {
    fetchExistingMetrics();
  }, [fetchExistingMetrics]);

  const loadCoachMetrics = useCallback(async (coachId: string) => {
    try {
      const { data } = await supabase
        .from("safety_metrics")
        .select("*")
        .eq("period_id", period.id)
        .eq("coach_id", coachId)
        .single();

      if (data) {
        setMetrics({
          ...data,
          do_hr_partnership_meeting: data.do_hr_partnership_meeting || "",
          bm_pm_whs_partnership_meeting: data.bm_pm_whs_partnership_meeting || "",
          lms_reports_date: data.lms_reports_date || "",
          tbt_attendance_reports_date: data.tbt_attendance_reports_date || ""
        });
      } else {
        // Reset to default values for new coach
        setMetrics({
          period_id: period.id,
          coach_id: coachId,
          travel_plans: "",
          training_branch_location: "",
          site_safety_evaluations: 0,
          forensic_survey_audits: 0,
          warehouse_safety_audits: 0,
          open_investigations_injuries: 0,
          open_investigations_auto: 0,
          open_investigations_property_damage: 0,
          open_investigations_near_miss: 0,
          do_hr_partnership_meeting: "",
          bm_pm_whs_partnership_meeting: "",
          lms_reports_date: "",
          tbt_attendance_reports_date: "",
          notes: ""
        });
      }
    } catch (error) {
      console.error("Error loading coach metrics:", error);
    }
  }, [supabase, period.id]);

  useEffect(() => {
    if (selectedCoach) {
      loadCoachMetrics(selectedCoach.id);
    }
  }, [selectedCoach, loadCoachMetrics]);

  const saveMetrics = async () => {
    if (!selectedCoach) return;

    setLoading(true);
    try {
      const metricsData = {
        ...metrics,
        do_hr_partnership_meeting: metrics.do_hr_partnership_meeting || null,
        bm_pm_whs_partnership_meeting: metrics.bm_pm_whs_partnership_meeting || null,
        lms_reports_date: metrics.lms_reports_date || null,
        tbt_attendance_reports_date: metrics.tbt_attendance_reports_date || null
      };

      const { error } = await supabase
        .from("safety_metrics")
        .upsert(metricsData, {
          onConflict: "period_id,coach_id"
        });

      if (error) throw error;

      await fetchExistingMetrics();
      onDataChange();
    } catch (error) {
      console.error("Error saving metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetric = (field: keyof SafetyMetric, value: string | number) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasMetrics = (coachId: string) => {
    return existingMetrics.some(m => m.coach_id === coachId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-olive">Safety Metrics</h2>
          <p className="text-medium-contrast">
            Period: {period.period_name} ({new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()})
          </p>
        </div>
      </div>

      {/* Coach Selection */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl text-high-contrast">👤 Step 1: Select Your Coach Profile</CardTitle>
          <CardDescription className="text-medium-contrast">Choose your name to enter or edit your safety metrics for this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <Button
                key={coach.id}
                variant={selectedCoach?.id === coach.id ? "default" : "outline"}
                className="justify-start gap-2 h-auto p-4"
                onClick={() => setSelectedCoach(coach)}
              >
                <User className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-high-contrast">{coach.name}</div>
                  <div className="text-xs opacity-70 flex items-center gap-2 text-medium-contrast">
                    {coach.vacation_days_remaining}/{coach.vacation_days_total} vacation days
                    {hasMetrics(coach.id) && <Badge variant="secondary" className="text-xs">✓ Has Data</Badge>}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          {!selectedCoach && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-medium-contrast">
                👆 Please select your name above to begin entering safety metrics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics Form */}
      {selectedCoach ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-high-contrast">
              📊 Step 2: Enter Safety Metrics for {selectedCoach.name}
            </CardTitle>
            <CardDescription className="text-medium-contrast">
              Fill in your safety metrics for the period: {period.period_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Travel and Training */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="travel_plans" className="text-high-contrast">Travel Plans - Branch Location</Label>
                <Input
                  id="travel_plans"
                  value={metrics.travel_plans}
                  onChange={(e) => updateMetric("travel_plans", e.target.value)}
                  placeholder="e.g., Orlando, Chicago, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="training_branch" className="text-high-contrast">Training Branch - TBT Location Attendance</Label>
                <Input
                  id="training_branch"
                  value={metrics.training_branch_location}
                  onChange={(e) => updateMetric("training_branch_location", e.target.value)}
                  placeholder="e.g., Orlando, Mesa TBT, etc."
                />
              </div>
            </div>

            {/* Safety Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="site_safety" className="text-high-contrast">Site Safety Evaluations (Goal: 12-15/month)</Label>
                <Input
                  id="site_safety"
                  type="number"
                  value={metrics.site_safety_evaluations}
                  onChange={(e) => updateMetric("site_safety_evaluations", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forensic_survey" className="text-high-contrast">Forensic/Survey Audits (Goal: 12-15/month)</Label>
                <Input
                  id="forensic_survey"
                  type="number"
                  value={metrics.forensic_survey_audits}
                  onChange={(e) => updateMetric("forensic_survey_audits", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse_audits" className="text-high-contrast">Warehouse Safety Audits (Goal: 2/month)</Label>
                <Input
                  id="warehouse_audits"
                  type="number"
                  value={metrics.warehouse_safety_audits}
                  onChange={(e) => updateMetric("warehouse_safety_audits", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Open Investigations */}
            <div className="space-y-4">
              <Label className="text-base font-medium text-high-contrast">Open Investigations</Label>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="injuries" className="text-high-contrast">Injuries</Label>
                  <Input
                    id="injuries"
                    type="number"
                    value={metrics.open_investigations_injuries}
                    onChange={(e) => updateMetric("open_investigations_injuries", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto" className="text-high-contrast">Auto</Label>
                  <Input
                    id="auto"
                    type="number"
                    value={metrics.open_investigations_auto}
                    onChange={(e) => updateMetric("open_investigations_auto", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_damage" className="text-high-contrast">Property Damage</Label>
                  <Input
                    id="property_damage"
                    type="number"
                    value={metrics.open_investigations_property_damage}
                    onChange={(e) => updateMetric("open_investigations_property_damage", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="near_miss" className="text-high-contrast">Near Miss</Label>
                  <Input
                    id="near_miss"
                    type="number"
                    value={metrics.open_investigations_near_miss}
                    onChange={(e) => updateMetric("open_investigations_near_miss", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Meeting Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="do_hr_meeting" className="text-high-contrast">DO/HR Partnership Meeting Date</Label>
                <Input
                  id="do_hr_meeting"
                  type="date"
                  value={metrics.do_hr_partnership_meeting}
                  onChange={(e) => updateMetric("do_hr_partnership_meeting", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bm_pm_meeting" className="text-high-contrast">BM/PM/WHS Partnership Meeting Date</Label>
                <Input
                  id="bm_pm_meeting"
                  type="date"
                  value={metrics.bm_pm_whs_partnership_meeting}
                  onChange={(e) => updateMetric("bm_pm_whs_partnership_meeting", e.target.value)}
                />
              </div>
            </div>

            {/* Report Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lms_reports" className="text-high-contrast">LMS Reports Date</Label>
                <Input
                  id="lms_reports"
                  type="date"
                  value={metrics.lms_reports_date}
                  onChange={(e) => updateMetric("lms_reports_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tbt_reports" className="text-high-contrast">TBT Attendance Reports Date</Label>
                <Input
                  id="tbt_reports"
                  type="date"
                  value={metrics.tbt_attendance_reports_date}
                  onChange={(e) => updateMetric("tbt_attendance_reports_date", e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-high-contrast">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={metrics.notes}
                onChange={(e) => updateMetric("notes", e.target.value)}
                placeholder="Additional notes or comments..."
              />
            </div>

            <Button onClick={saveMetrics} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Metrics"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-high-contrast">Ready to Enter Metrics</CardTitle>
            <CardDescription className="text-medium-contrast">
              Select a coach above to begin entering safety metrics for {period.period_name}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
} 