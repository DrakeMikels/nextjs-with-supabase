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

// IDP (Individual Development Plan) Types
export interface CertificationCategory {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean;
  created_at: string;
}

export interface Certification {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  provider: string | null;
  duration_hours: number | null;
  expiration_months: number | null;
  is_required: boolean;
  created_at: string;
  category?: CertificationCategory;
}

export interface CoachCertification {
  id: string;
  coach_id: string;
  certification_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  start_date: string | null;
  completion_date: string | null;
  expiration_date: string | null;
  certificate_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  certification?: Certification;
}

export interface IdpGoal {
  id: string;
  coach_id: string;
  title: string;
  description: string | null;
  target_completion_date: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface IdpDashboardProps {
  coach: Coach;
  onDataChange: () => void;
} 