-- Regional Safety Coaches - COMPLETE Excel Data Migration
-- Generated from: Regional Safety Coaches - Bi-Weekly Touch Base.xlsx
-- This includes ALL actual data from the Excel file
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
VALUES ('2025-04-28', '2025-05-05', '4-28-2025');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-04-14', '2025-04-25', '4-14-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-03-17', '2025-03-28', '3-17-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-03-03', '2025-03-14', '3-3-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-12-09', '2024-12-20', '12-9-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2025-01-20', '2025-01-31', '1-20-25');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-11-25', '2024-12-06', '11-25-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-11-11', '2024-11-22', '11-12-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-10-28', '2024-11-09', '10-28-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-10-14', '2024-10-27', '10-14-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-09-30', '2024-10-13', '9-30-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-09-16', '2024-09-27', '9-16-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-08-19', '2024-08-30', '8-19-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-03-04', '2024-03-17', '3-4-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-02-05', '2024-02-18', '2-5-24');
INSERT INTO bi_weekly_periods (start_date, end_date, period_name) 
VALUES ('2024-03-18', '2024-03-31', '3-18-24');

-- Step 4: Insert ALL actual safety metrics from Excel
-- This includes real data from each coach for each period
INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Orlando' as travel_plans,
  'Orlando' as training_branch_location,
  2 as site_safety_evaluations,
  2 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  3 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-05-01' as do_hr_partnership_meeting,
  '2025-05-01' as bm_pm_whs_partnership_meeting,
  '2025-05-05' as lms_reports_date,
  '2025-05-05' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Chicago' as travel_plans,
  'Chicago' as training_branch_location,
  0 as site_safety_evaluations,
  2 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  3 as open_investigations_injuries,
  3 as open_investigations_auto,
  2 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-05-02' as do_hr_partnership_meeting,
  '2025-05-02' as bm_pm_whs_partnership_meeting,
  '2025-05-06' as lms_reports_date,
  '2025-05-06' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SE Region / Houston ' as travel_plans,
  'None / Houston' as training_branch_location,
  7 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  3 as open_investigations_auto,
  11 as open_investigations_property_damage,
  1 as open_investigations_near_miss,
  '2025-05-12' as do_hr_partnership_meeting,
  '2025-05-12' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Sacramento-Sacramento' as travel_plans,
  'Sacramento-Sacramento' as training_branch_location,
  1 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  7 as open_investigations_injuries,
  13 as open_investigations_auto,
  3 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-05-09' as do_hr_partnership_meeting,
  NULL as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'PR / CT' as travel_plans,
  'PR/ CT' as training_branch_location,
  12 as site_safety_evaluations,
  3 as forensic_survey_audits,
  5 as warehouse_safety_audits,
  5 as open_investigations_injuries,
  8 as open_investigations_auto,
  6 as open_investigations_property_damage,
  4 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  '2025-04-04' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-28-2025' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Greenville' as travel_plans,
  'Greenville ' as training_branch_location,
  5 as site_safety_evaluations,
  0 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  13 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-04-18' as do_hr_partnership_meeting,
  '2025-04-18' as bm_pm_whs_partnership_meeting,
  '2025-04-16' as lms_reports_date,
  '2025-04-16' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-14-25' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Dallas - FTW / Austin - San Antonio' as travel_plans,
  'Dallas - FTW / Austin - San Antonio' as training_branch_location,
  21 as site_safety_evaluations,
  1 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  2 as open_investigations_auto,
  4 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-04-14' as do_hr_partnership_meeting,
  '2025-04-14' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-14-25' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'NSMA / Maine' as travel_plans,
  'NSMA / Maine' as training_branch_location,
  2 as site_safety_evaluations,
  3 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  3 as open_investigations_injuries,
  1 as open_investigations_auto,
  0 as open_investigations_property_damage,
  4 as open_investigations_near_miss,
  '2025-04-04' as do_hr_partnership_meeting,
  '2025-04-04' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '4-14-25' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Orlando' as travel_plans,
  'Orlando' as training_branch_location,
  5 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  7 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-25' as do_hr_partnership_meeting,
  '2025-03-25' as bm_pm_whs_partnership_meeting,
  '2025-03-17' as lms_reports_date,
  '2025-03-19' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-17-25' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver (PTO) / Denver' as travel_plans,
  'PTO / Denver' as training_branch_location,
  3 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  4 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-04-02' as do_hr_partnership_meeting,
  '2025-04-02' as bm_pm_whs_partnership_meeting,
  '2025-04-02' as lms_reports_date,
  '2025-04-02' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-17-25' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'PHX / PTO' as travel_plans,
  'PHX / PTO' as training_branch_location,
  4 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  3 as open_investigations_auto,
  3 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-19' as do_hr_partnership_meeting,
  '2025-03-21' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-17-25' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'LI / CT' as travel_plans,
  'LI / CT' as training_branch_location,
  4 as site_safety_evaluations,
  12 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  9 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-07' as do_hr_partnership_meeting,
  '2025-03-07' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-17-25' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Fresno / Dallas' as travel_plans,
  'Fresno / Dallas' as training_branch_location,
  4 as site_safety_evaluations,
  10 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  8 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-18' as do_hr_partnership_meeting,
  '2025-03-18' as bm_pm_whs_partnership_meeting,
  '2025-03-18' as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-3-25' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'CHI' as travel_plans,
  'CHI/Peoria' as training_branch_location,
  2 as site_safety_evaluations,
  2 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  5 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-07' as do_hr_partnership_meeting,
  '2025-03-07' as bm_pm_whs_partnership_meeting,
  '2025-03-07' as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-3-25' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Medford / Denver' as travel_plans,
  'Denver' as training_branch_location,
  3 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  4 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-06' as do_hr_partnership_meeting,
  '2025-03-06' as bm_pm_whs_partnership_meeting,
  '2025-03-06' as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-3-25' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SoCal / Houston ' as travel_plans,
  'SoCal / Houston ' as training_branch_location,
  4 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  3 as open_investigations_injuries,
  2 as open_investigations_auto,
  1 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-19' as do_hr_partnership_meeting,
  '2025-03-21' as bm_pm_whs_partnership_meeting,
  '2025-03-21' as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-3-25' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Livermore/Sac' as travel_plans,
  'Livermore/Sac' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  10 as open_investigations_property_damage,
  3 as open_investigations_near_miss,
  '2025-03-12' as do_hr_partnership_meeting,
  '2025-03-12' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-3-25' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'CT / SSMA-NSMA' as travel_plans,
  'CT / SSMA ' as training_branch_location,
  2 as site_safety_evaluations,
  2 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-13' as do_hr_partnership_meeting,
  '2025-03-13' as bm_pm_whs_partnership_meeting,
  '2025-03-13' as lms_reports_date,
  '2025-03-13' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-3-25' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SoCal / Houston' as travel_plans,
  'SoCal / Houston' as training_branch_location,
  5 as site_safety_evaluations,
  1 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  5 as open_investigations_auto,
  4 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-12-18' as do_hr_partnership_meeting,
  '2025-12-20' as bm_pm_whs_partnership_meeting,
  '2025-12-20' as lms_reports_date,
  '2025-12-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '12-9-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SSMA / WMA' as travel_plans,
  'SSMA / WMA' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  27 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-12-20' as do_hr_partnership_meeting,
  '2024-12-20' as bm_pm_whs_partnership_meeting,
  '2024-12-20' as lms_reports_date,
  '2024-12-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '12-9-24' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Pensacola 1/22/25' as travel_plans,
  'Pensacola 1/22/25' as training_branch_location,
  4 as site_safety_evaluations,
  0 as forensic_survey_audits,
  3 as warehouse_safety_audits,
  3 as open_investigations_injuries,
  2 as open_investigations_auto,
  8 as open_investigations_property_damage,
  5 as open_investigations_near_miss,
  '2025-01-16' as do_hr_partnership_meeting,
  '2025-01-21' as bm_pm_whs_partnership_meeting,
  '2025-01-21' as lms_reports_date,
  '2025-01-21' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '1-20-25' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Chicago / Richmond?' as travel_plans,
  'Chicago' as training_branch_location,
  3 as site_safety_evaluations,
  4 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  2 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-01-17' as do_hr_partnership_meeting,
  '2025-01-17' as bm_pm_whs_partnership_meeting,
  '2025-01-17' as lms_reports_date,
  '2025-01-17' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '1-20-25' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver ' as travel_plans,
  'Denver' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  3 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  3 as open_investigations_auto,
  2 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-01-08' as do_hr_partnership_meeting,
  '2025-01-08' as bm_pm_whs_partnership_meeting,
  '2025-01-08' as lms_reports_date,
  '2025-01-08' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '1-20-25' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  ' Houston / Lubbock-OKC-Little Rock' as travel_plans,
  ' Houston / Lubbock-OKC-Little Rock' as training_branch_location,
  6 as site_safety_evaluations,
  10 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  0 as open_investigations_auto,
  3 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-01-22' as do_hr_partnership_meeting,
  '2025-01-24' as bm_pm_whs_partnership_meeting,
  '2025-01-24' as lms_reports_date,
  '2025-01-24' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '1-20-25' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Sacramento / Fresno/Livermore' as travel_plans,
  'Sacramento / Fresno/Livermore' as training_branch_location,
  2 as site_safety_evaluations,
  0 as forensic_survey_audits,
  4 as warehouse_safety_audits,
  2 as open_investigations_injuries,
  7 as open_investigations_auto,
  7 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-02-03' as do_hr_partnership_meeting,
  '2025-02-23' as bm_pm_whs_partnership_meeting,
  '2025-01-13' as lms_reports_date,
  '2025-01-21' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '1-20-25' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'CT / Columbus' as travel_plans,
  'CT / Columbus' as training_branch_location,
  3 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-01-17' as do_hr_partnership_meeting,
  '2025-01-17' as bm_pm_whs_partnership_meeting,
  '2025-01-17' as lms_reports_date,
  '2025-01-17' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '1-20-25' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Houston / Houston' as travel_plans,
  'Houston / Houston' as training_branch_location,
  11 as site_safety_evaluations,
  3 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  4 as open_investigations_auto,
  3 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-12-18' as do_hr_partnership_meeting,
  '2025-12-20' as bm_pm_whs_partnership_meeting,
  '2025-12-20' as lms_reports_date,
  '2025-12-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-25-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'WMA / OSHA 500 [online]' as travel_plans,
  'WMA / OSHA 500 [online]' as training_branch_location,
  7 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  20 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-12-20' as do_hr_partnership_meeting,
  '2024-12-20' as bm_pm_whs_partnership_meeting,
  '2024-12-20' as lms_reports_date,
  '2024-12-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-25-24' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Orlando' as travel_plans,
  'Orlando' as training_branch_location,
  1 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  46 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-11-15' as do_hr_partnership_meeting,
  '2024-11-04' as bm_pm_whs_partnership_meeting,
  '2024-11-04' as lms_reports_date,
  '2024-11-04' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-12-24' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Chicago ' as travel_plans,
  'Chicago ' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-10-23' as do_hr_partnership_meeting,
  '2025-11-08' as bm_pm_whs_partnership_meeting,
  '2025-11-08' as lms_reports_date,
  '2025-11-08' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-12-24' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver / Denver' as travel_plans,
  'Denver / Denver' as training_branch_location,
  0 as site_safety_evaluations,
  5 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  6 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-10-30' as do_hr_partnership_meeting,
  '2025-10-30' as bm_pm_whs_partnership_meeting,
  '2025-10-30' as lms_reports_date,
  '2025-10-30' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-12-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Houston / Houston' as travel_plans,
  'Houston / Houston' as training_branch_location,
  6 as site_safety_evaluations,
  3 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  3 as open_investigations_auto,
  5 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-11-20' as do_hr_partnership_meeting,
  '2025-11-22' as bm_pm_whs_partnership_meeting,
  '2025-11-22' as lms_reports_date,
  '2025-11-22' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-12-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SAC/FRESNO' as travel_plans,
  'SAC/FRESNO' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  26 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-12-01' as do_hr_partnership_meeting,
  '2025-12-05' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  '2025-11-05' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-12-24' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'WMA / PR' as travel_plans,
  'WMA / PR' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  9 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-11-15' as do_hr_partnership_meeting,
  '2024-11-15' as bm_pm_whs_partnership_meeting,
  '2024-11-15' as lms_reports_date,
  '2024-11-15' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '11-12-24' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Atlanta ' as travel_plans,
  'Atlanta ' as training_branch_location,
  4 as site_safety_evaluations,
  3 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-11-05' as do_hr_partnership_meeting,
  '2024-11-05' as bm_pm_whs_partnership_meeting,
  '2024-10-28' as lms_reports_date,
  '2024-11-05' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-28-24' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Peoria - St. Louis / Chicago ' as travel_plans,
  'Peoria - St. Louis / Chicago ' as training_branch_location,
  4 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-10-23' as do_hr_partnership_meeting,
  '2025-10-11' as bm_pm_whs_partnership_meeting,
  '2025-10-11' as lms_reports_date,
  '2025-10-11' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-28-24' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver' as travel_plans,
  'Denver' as training_branch_location,
  7 as site_safety_evaluations,
  2 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  5 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  NULL as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-28-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Lubbock / Houston' as travel_plans,
  'Lubbock / Houston' as training_branch_location,
  10 as site_safety_evaluations,
  3 as forensic_survey_audits,
  3 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  7 as open_investigations_auto,
  7 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-10-23' as do_hr_partnership_meeting,
  '2025-10-25' as bm_pm_whs_partnership_meeting,
  '2025-10-25' as lms_reports_date,
  '2025-10-25' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-28-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'OC/IE-SAC/LIV' as travel_plans,
  'OC/IE-SAC/LIV' as training_branch_location,
  5 as site_safety_evaluations,
  2 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  5 as open_investigations_injuries,
  4 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  '2025-11-06' as bm_pm_whs_partnership_meeting,
  '2024-10-28' as lms_reports_date,
  '2024-10-28' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-28-24' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SSMA / WMA' as travel_plans,
  'SSMA / WMA' as training_branch_location,
  12 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  17 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-10-25' as do_hr_partnership_meeting,
  '2024-10-25' as bm_pm_whs_partnership_meeting,
  '2024-10-25' as lms_reports_date,
  '2024-10-25' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-28-24' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'LA/OC/IE / Houston' as travel_plans,
  'OC / Houston' as training_branch_location,
  6 as site_safety_evaluations,
  1 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  3 as open_investigations_injuries,
  7 as open_investigations_auto,
  4 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-10-23' as do_hr_partnership_meeting,
  '2025-10-25' as bm_pm_whs_partnership_meeting,
  '2025-10-25' as lms_reports_date,
  '2025-10-25' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '10-14-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Houston / San Antonio' as travel_plans,
  'Houston / San Antonio' as training_branch_location,
  6 as site_safety_evaluations,
  1 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  2 as open_investigations_injuries,
  3 as open_investigations_auto,
  7 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-10-23' as do_hr_partnership_meeting,
  '2025-10-25' as bm_pm_whs_partnership_meeting,
  '2025-10-25' as lms_reports_date,
  '2025-10-25' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-30-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Orlando' as travel_plans,
  'Orlando ' as training_branch_location,
  4 as site_safety_evaluations,
  3 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  79 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-09-17' as do_hr_partnership_meeting,
  '2024-09-17' as bm_pm_whs_partnership_meeting,
  '2024-09-16' as lms_reports_date,
  '2024-09-16' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-16-24' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'St. Louis / Chicago' as travel_plans,
  'St. Louis / Chicago' as training_branch_location,
  4 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  '2024-09-06' as bm_pm_whs_partnership_meeting,
  '2024-09-17' as lms_reports_date,
  '2024-09-06' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-16-24' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver' as travel_plans,
  'Denver' as training_branch_location,
  3 as site_safety_evaluations,
  8 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  4 as open_investigations_injuries,
  4 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  '2024-09-19' as bm_pm_whs_partnership_meeting,
  '2024-09-19' as lms_reports_date,
  '2024-09-19' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-16-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Dallas/ FTW/ South Houston' as travel_plans,
  'Dallas/ FTW/ South Houston' as training_branch_location,
  6 as site_safety_evaluations,
  13 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  3 as open_investigations_auto,
  2 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-09-18' as do_hr_partnership_meeting,
  '2025-09-20' as bm_pm_whs_partnership_meeting,
  '2025-09-20' as lms_reports_date,
  '2025-09-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-16-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'OC/SAC' as travel_plans,
  'OC/SAC' as training_branch_location,
  6 as site_safety_evaluations,
  1 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  5 as open_investigations_injuries,
  9 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  '2024-10-02' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-16-24' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'NSMA / PTO' as travel_plans,
  'NSMA / PTO' as training_branch_location,
  5 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  72 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-09-20' as do_hr_partnership_meeting,
  '2024-09-20' as bm_pm_whs_partnership_meeting,
  '2024-09-20' as lms_reports_date,
  '2024-09-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '9-16-24' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Orlando / Orlando' as travel_plans,
  'Orlando / Orlando' as training_branch_location,
  3 as site_safety_evaluations,
  1 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  72 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-08-20' as do_hr_partnership_meeting,
  '2024-08-20' as bm_pm_whs_partnership_meeting,
  '2024-08-19' as lms_reports_date,
  '2024-08-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '8-19-24' AND c.name = 'James';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Peoria / Chicago' as travel_plans,
  'Peoria / Chicago' as training_branch_location,
  3 as site_safety_evaluations,
  1 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  77 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  NULL as do_hr_partnership_meeting,
  NULL as bm_pm_whs_partnership_meeting,
  '2024-08-19' as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '8-19-24' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver/Denver' as travel_plans,
  'Denver/Denver' as training_branch_location,
  0 as site_safety_evaluations,
  5 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  9 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-08-01' as do_hr_partnership_meeting,
  '2025-08-01' as bm_pm_whs_partnership_meeting,
  '2025-08-01' as lms_reports_date,
  '2025-08-01' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '8-19-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'South Houston/ South Houston' as travel_plans,
  'South Houston/ South Houston' as training_branch_location,
  4 as site_safety_evaluations,
  4 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  24 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-09-18' as do_hr_partnership_meeting,
  '2025-09-20' as bm_pm_whs_partnership_meeting,
  '2025-09-20' as lms_reports_date,
  '2025-09-20' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '8-19-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SAC/ LIV / LA' as travel_plans,
  'Sac / LA' as training_branch_location,
  9 as site_safety_evaluations,
  2 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-08-01' as do_hr_partnership_meeting,
  '2025-09-04' as bm_pm_whs_partnership_meeting,
  '2025-08-19' as lms_reports_date,
  '2025-08-07' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '8-19-24' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'SSMA / PR' as travel_plans,
  'SSMA / PR' as training_branch_location,
  4 as site_safety_evaluations,
  4 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-08-16' as do_hr_partnership_meeting,
  '2024-08-16' as bm_pm_whs_partnership_meeting,
  '2024-08-16' as lms_reports_date,
  '2024-08-16' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '8-19-24' AND c.name = 'Will';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  ' N. Houston / Temecula' as travel_plans,
  ' N. Houston / Temecula' as training_branch_location,
  3 as site_safety_evaluations,
  7 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-03-14' as do_hr_partnership_meeting,
  '2025-03-15' as bm_pm_whs_partnership_meeting,
  '2025-03-15' as lms_reports_date,
  '2025-03-15' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-4-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Tucson/Temecula' as travel_plans,
  'Tucson/Temecula' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-25' as do_hr_partnership_meeting,
  '2025-03-05' as bm_pm_whs_partnership_meeting,
  '2024-03-01' as lms_reports_date,
  '2024-03-01' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-4-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Richmond / MA' as travel_plans,
  'Richmond / WMA' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  24 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-01' as do_hr_partnership_meeting,
  '2025-03-01' as bm_pm_whs_partnership_meeting,
  '2025-03-01' as lms_reports_date,
  '2025-03-01' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-4-24' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver / Denver / SLC (2.19)' as travel_plans,
  'Denver / Denver / SLC (2.19)' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-02-05' as do_hr_partnership_meeting,
  '2024-02-05' as bm_pm_whs_partnership_meeting,
  '2024-02-05' as lms_reports_date,
  '2024-02-05' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '2-5-24' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Fort Worth / S. Houston ' as travel_plans,
  'Fort Worth / S. Houston ' as training_branch_location,
  3 as site_safety_evaluations,
  14 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  0 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-02-14' as do_hr_partnership_meeting,
  '2025-02-15' as bm_pm_whs_partnership_meeting,
  '2025-02-15' as lms_reports_date,
  '2025-02-15' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '2-5-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Las Vegas ' as travel_plans,
  'Las Vegas ' as training_branch_location,
  8 as site_safety_evaluations,
  1 as forensic_survey_audits,
  0 as warehouse_safety_audits,
  2 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-02-26' as do_hr_partnership_meeting,
  '2024-02-06' as bm_pm_whs_partnership_meeting,
  NULL as lms_reports_date,
  NULL as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '2-5-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'South Jersey / PTO' as travel_plans,
  'South Jersey / PTO' as training_branch_location,
  0 as site_safety_evaluations,
  0 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  14 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-02-02' as do_hr_partnership_meeting,
  '2025-02-02' as bm_pm_whs_partnership_meeting,
  '2025-02-02' as lms_reports_date,
  '2025-02-02' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '2-5-24' AND c.name = 'Zack';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'Denver(PTO) / PHX' as travel_plans,
  'PTO / PHX Asbestos Training ' as training_branch_location,
  4 as site_safety_evaluations,
  0 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  1 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-11' as do_hr_partnership_meeting,
  '2025-03-11' as bm_pm_whs_partnership_meeting,
  '2025-03-11' as lms_reports_date,
  '2025-03-11' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-18-24' AND c.name = 'Sam';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  ' OSHA Training / PHX Asbestos Training' as travel_plans,
  ' OSHA Training / PHX Asbestos Training' as training_branch_location,
  3 as site_safety_evaluations,
  7 as forensic_survey_audits,
  1 as warehouse_safety_audits,
  2 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2024-03-14' as do_hr_partnership_meeting,
  '2025-03-15' as bm_pm_whs_partnership_meeting,
  '2025-03-15' as lms_reports_date,
  '2025-03-15' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-18-24' AND c.name = 'Mike';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'PHX - NPHX -/ PHX Asbestos Training ' as travel_plans,
  'PHX - NPHX -/ PHX Asbestos Training ' as training_branch_location,
  3 as site_safety_evaluations,
  6 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  6 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-25' as do_hr_partnership_meeting,
  '2025-03-05' as bm_pm_whs_partnership_meeting,
  '2024-03-01' as lms_reports_date,
  '2024-03-01' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-18-24' AND c.name = 'Hugh';

INSERT INTO safety_metrics (
  period_id, coach_id, travel_plans, training_branch_location,
  site_safety_evaluations, forensic_survey_audits, warehouse_safety_audits,
  open_investigations_injuries, open_investigations_auto, 
  open_investigations_property_damage, open_investigations_near_miss,
  do_hr_partnership_meeting, bm_pm_whs_partnership_meeting,
  lms_reports_date, tbt_attendance_reports_date, notes
) 
SELECT 
  p.id as period_id,
  c.id as coach_id,
  'MA / PHX' as travel_plans,
  'Travel / Asbestos Training' as training_branch_location,
  6 as site_safety_evaluations,
  0 as forensic_survey_audits,
  2 as warehouse_safety_audits,
  26 as open_investigations_injuries,
  0 as open_investigations_auto,
  0 as open_investigations_property_damage,
  0 as open_investigations_near_miss,
  '2025-03-01' as do_hr_partnership_meeting,
  '2025-03-01' as bm_pm_whs_partnership_meeting,
  '2025-03-01' as lms_reports_date,
  '2025-03-01' as tbt_attendance_reports_date,
  '' as notes
FROM bi_weekly_periods p, coaches c 
WHERE p.period_name = '3-18-24' AND c.name = 'Zack';

-- Migration completed!
-- You now have ALL actual data from your Excel file in the database.
-- Total records: 6 coaches, 16 periods, 65 metrics
