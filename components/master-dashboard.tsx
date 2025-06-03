"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Eye, EyeOff, Sparkles } from "lucide-react";
import type { Coach, SafetyMetric, DashboardProps } from "@/lib/types";

export function MasterDashboard({ periods, coaches, onDataChange }: DashboardProps) {
  const [metrics, setMetrics] = useState<SafetyMetric[]>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const supabase = createClient();

  const fetchMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("safety_metrics")
        .select("*");

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
  }, [fetchMetrics]);

  const getMetricForCoachAndPeriod = (coachId: string, periodId: string): SafetyMetric | null => {
    return metrics.find(m => m.coach_id === coachId && m.period_id === periodId) || null;
  };

  const updateMetric = async (coachId: string, periodId: string, field: keyof SafetyMetric, value: string | number) => {
    try {
      const existingMetric = getMetricForCoachAndPeriod(coachId, periodId);
      
      // Helper function to handle date values - send null instead of empty string
      const formatDateValue = (dateValue: string | null | undefined): string | null => {
        if (!dateValue || dateValue.trim() === "") return null;
        return dateValue;
      };
      
      const metricData = {
        period_id: periodId,
        coach_id: coachId,
        travel_plans: existingMetric?.travel_plans || "",
        training_branch_location: existingMetric?.training_branch_location || "",
        site_safety_evaluations: existingMetric?.site_safety_evaluations || 0,
        forensic_survey_audits: existingMetric?.forensic_survey_audits || 0,
        warehouse_safety_audits: existingMetric?.warehouse_safety_audits || 0,
        open_investigations_injuries: existingMetric?.open_investigations_injuries || 0,
        open_investigations_auto: existingMetric?.open_investigations_auto || 0,
        open_investigations_property_damage: existingMetric?.open_investigations_property_damage || 0,
        open_investigations_near_miss: existingMetric?.open_investigations_near_miss || 0,
        do_hr_partnership_meeting: formatDateValue(existingMetric?.do_hr_partnership_meeting),
        bm_pm_whs_partnership_meeting: formatDateValue(existingMetric?.bm_pm_whs_partnership_meeting),
        lms_reports_date: formatDateValue(existingMetric?.lms_reports_date),
        tbt_attendance_reports_date: formatDateValue(existingMetric?.tbt_attendance_reports_date),
        notes: existingMetric?.notes || "",
        [field]: field.includes('date') || field.includes('meeting') ? formatDateValue(value as string) : value
      };

      const { error } = await supabase
        .from("safety_metrics")
        .upsert(metricData, {
          onConflict: "period_id,coach_id"
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await fetchMetrics();
      onDataChange();
    } catch (error) {
      console.error("Error updating metric:", error);
      // Show user-friendly error message
      alert(`Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const EditableCell = ({ 
    value, 
    coachId, 
    periodId, 
    field, 
    type = "text" 
  }: { 
    value: string | number; 
    coachId: string; 
    periodId: string; 
    field: keyof SafetyMetric; 
    type?: string;
  }) => {
    const cellId = `${coachId}-${periodId}-${field}`;
    const isEditing = editingCell === cellId;
    const [localValue, setLocalValue] = useState(value);

    // Update local value when the prop value changes (from database)
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleSave = async () => {
      if (localValue !== value) {
        const newValue = type === "number" ? parseInt(localValue.toString()) || 0 : localValue;
        await updateMetric(coachId, periodId, field, newValue);
      }
      setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        setLocalValue(value); // Reset to original value
        setEditingCell(null);
      }
    };

    if (isEditing) {
      return (
        <Input
          type={type}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 text-xs"
          autoFocus
        />
      );
    }

    return (
      <div
        className="min-h-[32px] p-1 cursor-pointer hover:bg-muted/50 rounded text-xs flex items-center text-high-contrast"
        onClick={() => setEditingCell(cellId)}
      >
        {value || "-"}
      </div>
    );
  };

  const CoachView = ({ coach }: { coach: Coach }) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-high-contrast">{coach.name}</h3>
          <p className="text-sm text-medium-contrast">
            Vacation: {coach.vacation_days_remaining}/{coach.vacation_days_total} days
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllColumns(!showAllColumns)}
          className="gap-2 w-full sm:w-auto"
        >
          {showAllColumns ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showAllColumns ? "Hide Details" : "Show All"}
        </Button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-max px-4 sm:px-0">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[100px]">Period</th>
                <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[120px]">Travel Plans</th>
                <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[120px]">Training Branch</th>
                <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[80px]">Site Evals</th>
                <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[80px]">Audits</th>
                <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[90px]">Warehouse</th>
                {showAllColumns && (
                  <>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[80px]">Injuries</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[80px]">Auto</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[80px]">Property</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[80px]">Near Miss</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[120px]">DO/HR Meeting</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[120px]">BM/PM Meeting</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[120px]">LMS Reports</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[120px]">TBT Reports</th>
                    <th className="border border-border p-2 text-left text-xs font-medium text-high-contrast min-w-[150px]">Notes</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const metric = getMetricForCoachAndPeriod(coach.id, period.id);
                return (
                  <tr key={period.id} className="hover:bg-muted/25">
                    <td className="border border-border p-2">
                      <div className="text-xs font-medium text-high-contrast">{period.period_name}</div>
                      <div className="text-xs text-medium-contrast">
                        {new Date(period.start_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="border border-border p-1">
                      <EditableCell
                        value={metric?.travel_plans || ""}
                        coachId={coach.id}
                        periodId={period.id}
                        field="travel_plans"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <EditableCell
                        value={metric?.training_branch_location || ""}
                        coachId={coach.id}
                        periodId={period.id}
                        field="training_branch_location"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <EditableCell
                        value={metric?.site_safety_evaluations || 0}
                        coachId={coach.id}
                        periodId={period.id}
                        field="site_safety_evaluations"
                        type="number"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <EditableCell
                        value={metric?.forensic_survey_audits || 0}
                        coachId={coach.id}
                        periodId={period.id}
                        field="forensic_survey_audits"
                        type="number"
                      />
                    </td>
                    <td className="border border-border p-1">
                      <EditableCell
                        value={metric?.warehouse_safety_audits || 0}
                        coachId={coach.id}
                        periodId={period.id}
                        field="warehouse_safety_audits"
                        type="number"
                      />
                    </td>
                    {showAllColumns && (
                      <>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.open_investigations_injuries || 0}
                            coachId={coach.id}
                            periodId={period.id}
                            field="open_investigations_injuries"
                            type="number"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.open_investigations_auto || 0}
                            coachId={coach.id}
                            periodId={period.id}
                            field="open_investigations_auto"
                            type="number"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.open_investigations_property_damage || 0}
                            coachId={coach.id}
                            periodId={period.id}
                            field="open_investigations_property_damage"
                            type="number"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.open_investigations_near_miss || 0}
                            coachId={coach.id}
                            periodId={period.id}
                            field="open_investigations_near_miss"
                            type="number"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.do_hr_partnership_meeting || ""}
                            coachId={coach.id}
                            periodId={period.id}
                            field="do_hr_partnership_meeting"
                            type="date"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.bm_pm_whs_partnership_meeting || ""}
                            coachId={coach.id}
                            periodId={period.id}
                            field="bm_pm_whs_partnership_meeting"
                            type="date"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.lms_reports_date || ""}
                            coachId={coach.id}
                            periodId={period.id}
                            field="lms_reports_date"
                            type="date"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <EditableCell
                            value={metric?.tbt_attendance_reports_date || ""}
                            coachId={coach.id}
                            periodId={period.id}
                            field="tbt_attendance_reports_date"
                            type="date"
                          />
                        </td>
                        <td className="border border-border p-1 max-w-[200px]">
                          <EditableCell
                            value={metric?.notes || ""}
                            coachId={coach.id}
                            periodId={period.id}
                            field="notes"
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading master dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand-olive" />
            <span className="text-brand-olive">Master Dashboard</span>
          </h2>
          <p className="text-medium-contrast text-sm">
            Excel-style interface - Click any cell to edit data directly
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-brand-olive/30 text-brand-olive text-xs">
            <Edit3 className="h-3 w-3" />
            Click to edit
          </Badge>
        </div>
      </div>

      <Tabs value={selectedCoach?.id || "all"} onValueChange={(value) => {
        if (value === "all") {
          setSelectedCoach(null);
        } else {
          const coach = coaches.find(c => c.id === value);
          setSelectedCoach(coach || null);
        }
      }}>
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-8 bg-brand-off-white border border-brand-olive/20 min-w-max w-full">
            <TabsTrigger value="all" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast whitespace-nowrap text-xs sm:text-sm">All Coaches</TabsTrigger>
            {coaches.map((coach) => (
              <TabsTrigger 
                key={coach.id} 
                value={coach.id} 
                className="text-xs data-[state=active]:bg-brand-olive-light data-[state=active]:text-white text-medium-contrast whitespace-nowrap"
              >
                {coach.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4 sm:space-y-6">
          {coaches.map((coach) => (
            <Card key={coach.id}>
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg text-high-contrast">{coach.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <CoachView coach={coach} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {coaches.map((coach) => (
          <TabsContent key={coach.id} value={coach.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-high-contrast">{coach.name} - Detailed View</CardTitle>
                <CardDescription className="text-medium-contrast text-sm">
                  Complete data view for {coach.name} across all periods
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <CoachView coach={coach} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 