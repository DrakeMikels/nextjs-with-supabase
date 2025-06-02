-- Create coaches table
CREATE TABLE coaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_hire DATE,
  vacation_days_remaining INTEGER DEFAULT 0,
  vacation_days_total INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bi_weekly_periods table
CREATE TABLE bi_weekly_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  period_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(start_date, end_date)
);

-- Create safety_metrics table
CREATE TABLE safety_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period_id UUID REFERENCES bi_weekly_periods(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  travel_plans TEXT,
  training_branch_location TEXT,
  site_safety_evaluations INTEGER DEFAULT 0,
  forensic_survey_audits INTEGER DEFAULT 0,
  warehouse_safety_audits INTEGER DEFAULT 0,
  open_investigations_injuries INTEGER DEFAULT 0,
  open_investigations_auto INTEGER DEFAULT 0,
  open_investigations_property_damage INTEGER DEFAULT 0,
  open_investigations_near_miss INTEGER DEFAULT 0,
  do_hr_partnership_meeting DATE,
  bm_pm_whs_partnership_meeting DATE,
  lms_reports_date DATE,
  tbt_attendance_reports_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(period_id, coach_id)
);

-- Insert initial coaches data
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) VALUES
('James', '2020-07-15', 0, 2),
('Sam', '2019-10-01', 0, 2),
('Mike', '2020-09-20', 1, 2),
('Hugh', '2016-06-16', 1, 2),
('Joe', NULL, 2, 2),
('Zack', '2021-02-01', 0, 2),
('Will', '2021-03-01', 0, 4);

-- Create some sample bi-weekly periods
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) VALUES
('2025-04-28', '2025-05-05', '4-28-2025'),
('2025-04-14', '2025-04-25', '4-14-25'),
('2025-03-17', '2025-03-28', '3-17-25'),
('2025-03-03', '2025-03-14', '3-3-25');

-- Create RLS policies
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_weekly_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_metrics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and write all data
CREATE POLICY "Allow authenticated users full access to coaches" ON coaches
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to bi_weekly_periods" ON bi_weekly_periods
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to safety_metrics" ON safety_metrics
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bi_weekly_periods_updated_at BEFORE UPDATE ON bi_weekly_periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_metrics_updated_at BEFORE UPDATE ON safety_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 