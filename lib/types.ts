export interface BiWeeklyPeriod {
  id: string;
  start_date: string;
  end_date: string;
  period_name: string;
  created_at: string;
}

export interface Coach {
  id: string;
  name: string;
  date_of_hire: string | null;
  vacation_days_remaining: number;
  vacation_days_total: number;
}

export interface SafetyMetric {
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
  do_hr_partnership_meeting: string | null;
  bm_pm_whs_partnership_meeting: string | null;
  lms_reports_date: string | null;
  tbt_attendance_reports_date: string | null;
  notes: string;
}

export interface DashboardProps {
  periods: BiWeeklyPeriod[];
  coaches: Coach[];
  onDataChange: () => void;
} 