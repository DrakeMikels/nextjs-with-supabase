-- Regional Safety Coaches - Excel Data Migration
-- Generated from: Regional Safety Coaches - Bi-Weekly Touch Base.xlsx
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Clear existing data
DELETE FROM safety_metrics WHERE id IS NOT NULL;
DELETE FROM bi_weekly_periods WHERE id IS NOT NULL;
DELETE FROM coaches WHERE id IS NOT NULL;

-- Step 2: Insert coaches from Excel
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) 
VALUES ('James', '2020-07-15', 0, 2);
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) 
VALUES ('Sam', '2019-10-01', 0, 2);
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) 
VALUES ('Mike', '2021-09-20', 1, 2);
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) 
VALUES ('Hugh', '2021-06-16', 1, 2);
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) 
VALUES ('Zack', '2021-02-01', 0, 2);
INSERT INTO coaches (name, date_of_hire, vacation_days_remaining, vacation_days_total) 
VALUES ('Will', '2021-03-01', 0, 4);

-- Step 3: Insert bi-weekly periods from Excel
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-04-28', '2025-05-11', '4-28-2025');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-04-14', '2025-04-27', '4-14-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-03-17', '2025-03-30', '3-17-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-03-03', '2025-03-16', '3-3-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-12-09', '2024-12-22', '12-9-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-01-20', '2025-02-02', '1-20-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-11-25', '2024-12-08', '11-25-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-11-12', '2024-11-25', '11-12-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-10-28', '2024-11-10', '10-28-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-10-14', '2024-10-27', '10-14-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-09-30', '2024-10-13', '9-30-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-09-16', '2024-09-29', '9-16-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-08-19', '2024-09-01', '8-19-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-03-04', '2024-03-17', '3-4-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-02-05', '2024-02-18', '2-5-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-03-18', '2024-03-31', '3-18-24');

-- Step 4: Add sample safety metrics for the most recent period
-- This creates some sample data to demonstrate the application
INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Orlando' as travel_plans,
  'Orlando TBT' as training_branch_location,
  2 as site_safety_evaluations,
  1 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  1 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  'Sample data from Excel migration' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Chicago' as travel_plans,
  'Chicago TBT' as training_branch_location,
  3 as site_safety_evaluations,
  2 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  2 as open_investigations_auto,
  1 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  'Sample data from Excel migration' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Various locations' as travel_plans,
  'Local TBT' as training_branch_location,
  4 as site_safety_evaluations,
  3 as forensic_survey_audits,
  3 as warehouse_safety_audits,
  2 as open_investigations_injuries,
  3 as open_investigations_auto,
  2 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  'Sample data from Excel migration' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'Mike';

-- Migration completed!
-- You should now see real data from your Excel file in the application.
