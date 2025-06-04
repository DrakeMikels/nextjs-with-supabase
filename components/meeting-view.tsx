"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Building,
  Shield,
  Eye
} from "lucide-react";
import { AnimatedContainer, AnimatedItem, LoadingSpinner } from "@/components/ui/animated-container";
import * as motion from "motion/react-client";
import type { BiWeeklyPeriod, Coach, SafetyMetric } from "@/lib/types";

interface MeetingViewProps {
  coaches: Coach[];
  selectedPeriod: BiWeeklyPeriod | null;
}

interface CoachMetrics extends Coach {
  metrics?: SafetyMetric;
  hasData: boolean;
}

export function MeetingView({ coaches, selectedPeriod }: MeetingViewProps) {
  const [loading, setLoading] = useState(true);
  const [coachMetrics, setCoachMetrics] = useState<CoachMetrics[]>([]);
  const supabase = createClient();

  const fetchMetrics = useCallback(async () => {
    if (!selectedPeriod) {
      setCoachMetrics(coaches.map(coach => ({ ...coach, hasData: false })));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data: metricsData, error } = await supabase
        .from("safety_metrics")
        .select("*")
        .eq("period_id", selectedPeriod.id);

      if (error) {
        console.error("Error fetching metrics:", error);
        setCoachMetrics(coaches.map(coach => ({ ...coach, hasData: false })));
        return;
      }

      const coachesWithMetrics = coaches.map(coach => {
        const metrics = metricsData?.find(m => m.coach_id === coach.id);
        return {
          ...coach,
          metrics,
          hasData: !!metrics
        };
      });

      setCoachMetrics(coachesWithMetrics);
    } catch (error) {
      console.error("Error fetching meeting data:", error);
      setCoachMetrics(coaches.map(coach => ({ ...coach, hasData: false })));
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedPeriod, coaches]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const getStatusBadge = (hasData: boolean, metrics?: SafetyMetric) => {
    if (!hasData) {
      return <Badge variant="destructive" className="text-xs"><AlertTriangle className="h-3 w-3 mr-1" />No Data</Badge>;
    }
    
    const totalInvestigations = (metrics?.open_investigations_injuries || 0) + 
                               (metrics?.open_investigations_auto || 0) + 
                               (metrics?.open_investigations_property_damage || 0) + 
                               (metrics?.open_investigations_near_miss || 0);
    
    if (totalInvestigations > 0) {
      return <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" />Active Cases</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs"><CheckCircle className="h-3 w-3 mr-1" />Complete</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString + 'T00:00:00').toLocaleDateString();
  };

  if (loading) {
    return (
      <AnimatedContainer variant="fadeIn" className="space-y-6">
        <LoadingSpinner />
      </AnimatedContainer>
    );
  }

  if (!selectedPeriod) {
    return (
      <AnimatedContainer variant="fadeIn" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Meeting View
            </CardTitle>
            <CardDescription>
              Please select a bi-weekly period to view coach metrics for the meeting.
            </CardDescription>
          </CardHeader>
        </Card>
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer variant="stagger" className="space-y-6">
      {/* Header */}
      <AnimatedItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-olive flex items-center gap-2">
            <Users className="h-6 w-6" />
            Meeting View - {selectedPeriod.period_name}
          </h2>
          <p className="text-medium-contrast flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(selectedPeriod.start_date)} - {formatDate(selectedPeriod.end_date)}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Complete ({coachMetrics.filter(c => c.hasData).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Missing ({coachMetrics.filter(c => !c.hasData).length})</span>
          </div>
        </div>
      </AnimatedItem>

      {/* Coach Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coachMetrics.map((coach, index) => (
          <motion.div
            key={coach.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1 + (index * 0.1),
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <Card className={`h-full ${coach.hasData ? 'border-green-200 hover:border-green-300' : 'border-red-200 hover:border-red-300'} transition-colors hover-lift`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-high-contrast">{coach.name}</CardTitle>
                  {getStatusBadge(coach.hasData, coach.metrics)}
                </div>
                <CardDescription className="text-xs">
                  Hired: {formatDate(coach.date_of_hire)} • 
                  Vacation: {coach.vacation_days_remaining}/{coach.vacation_days_total}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {coach.hasData && coach.metrics ? (
                  <>
                    {/* Travel Plans */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3 + (index * 0.1),
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-brand-olive" />
                        Travel Plans
                      </div>
                      <p className="text-xs text-medium-contrast bg-muted p-2 rounded">
                        {coach.metrics.travel_plans || "No travel plans specified"}
                      </p>
                    </motion.div>

                    {/* Training Location */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + (index * 0.1),
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Building className="h-4 w-4 text-brand-olive" />
                        Training Branch
                      </div>
                      <p className="text-xs text-medium-contrast">
                        {coach.metrics.training_branch_location || "Not specified"}
                      </p>
                    </motion.div>

                    {/* Safety Metrics */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.5 + (index * 0.1),
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Eye className="h-4 w-4 text-brand-olive" />
                        Evaluations & Audits
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-medium text-blue-800">Site Safety</div>
                          <div className="text-blue-600">{coach.metrics.site_safety_evaluations}</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="font-medium text-purple-800">Forensic</div>
                          <div className="text-purple-600">{coach.metrics.forensic_survey_audits}</div>
                        </div>
                        <div className="bg-orange-50 p-2 rounded col-span-2">
                          <div className="font-medium text-orange-800">Warehouse Safety</div>
                          <div className="text-orange-600">{coach.metrics.warehouse_safety_audits}</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Open Investigations */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + (index * 0.1),
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Shield className="h-4 w-4 text-brand-olive" />
                        Open Investigations
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex justify-between">
                          <span>Injuries:</span>
                          <span className={coach.metrics.open_investigations_injuries > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {coach.metrics.open_investigations_injuries}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto:</span>
                          <span className={coach.metrics.open_investigations_auto > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {coach.metrics.open_investigations_auto}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Property:</span>
                          <span className={coach.metrics.open_investigations_property_damage > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {coach.metrics.open_investigations_property_damage}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Near Miss:</span>
                          <span className={coach.metrics.open_investigations_near_miss > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {coach.metrics.open_investigations_near_miss}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Meeting Dates */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.7 + (index * 0.1),
                        ease: [0, 0.71, 0.2, 1.01],
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-brand-olive" />
                        Meetings & Reports
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>HR Partnership:</span>
                          <span className={coach.metrics.do_hr_partnership_meeting ? 'text-green-600' : 'text-red-600'}>
                            {coach.metrics.do_hr_partnership_meeting || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>BM/PM/WHS:</span>
                          <span className={coach.metrics.bm_pm_whs_partnership_meeting ? 'text-green-600' : 'text-red-600'}>
                            {coach.metrics.bm_pm_whs_partnership_meeting || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>LMS Reports:</span>
                          <span className={coach.metrics.lms_reports_date ? 'text-green-600' : 'text-red-600'}>
                            {coach.metrics.lms_reports_date ? formatDate(coach.metrics.lms_reports_date) : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>TBT Reports:</span>
                          <span className={coach.metrics.tbt_attendance_reports_date ? 'text-green-600' : 'text-red-600'}>
                            {coach.metrics.tbt_attendance_reports_date ? formatDate(coach.metrics.tbt_attendance_reports_date) : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Notes */}
                    {coach.metrics.notes && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.8 + (index * 0.1),
                          ease: [0, 0.71, 0.2, 1.01],
                        }}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-4 w-4 text-brand-olive" />
                          Notes
                        </div>
                        <p className="text-xs text-medium-contrast bg-muted p-2 rounded">
                          {coach.metrics.notes}
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + (index * 0.1),
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                  >
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <p className="text-sm text-medium-contrast">No data submitted for this period</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatedContainer>
  );
} 