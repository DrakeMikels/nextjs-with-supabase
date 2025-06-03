-- Add Completed Certifications from Excel Data
-- This script adds the certifications that coaches have already completed
-- Run this in Supabase Dashboard > SQL Editor

-- Certifications for Mike
INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-01-15' as completion_date,
  '2026-01-15' as expiration_date,
  'CPR-2023-001' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Mike' AND cert.name = 'CPR, First Aid, BBP Instructor Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-08-20' as completion_date,
  '2025-08-20' as expiration_date,
  'NCOS-510-2022' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Mike' AND cert.name = 'NCOS-510 OSHA for Construction Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-03-10' as completion_date,
  '2026-03-09' as expiration_date,
  'OSHA-470-2023' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Mike' AND cert.name = 'OSHA-470 Electrical Safe Work Practices'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-11-05' as completion_date,
  '2025-11-05' as expiration_date,
  'OSHA-511-2022' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Mike' AND cert.name = 'OSHA-511 OSHA for General Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-05-15' as completion_date,
  '2026-05-15' as expiration_date,
  'OSHA-521-2023' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Mike' AND cert.name = 'OSHA-521 OSHA Guide to Industrial Hygiene'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;


-- Certifications for Hugh
INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-02-10' as completion_date,
  '2026-02-10' as expiration_date,
  'CPR-2023-002' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'CPR, First Aid, BBP Instructor Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-09-15' as completion_date,
  '2025-09-15' as expiration_date,
  'NCOS-510-2022-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'NCOS-510 OSHA for Construction Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-04-20' as completion_date,
  '2026-04-20' as expiration_date,
  'OSHA-470-2023-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'OSHA-470 Electrical Safe Work Practices'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-12-01' as completion_date,
  '2025-12-01' as expiration_date,
  'OSHA-511-2022-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'OSHA-511 OSHA for General Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-01-25' as completion_date,
  '2026-01-25' as expiration_date,
  'PCS-FP-2023-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'PCS- Fall Protection Competent Person'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-06-10' as completion_date,
  '2026-06-10' as expiration_date,
  'OSHA-3095-2023-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'OSHA #3095 ELECTRICAL STANDARDS'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-07-15' as completion_date,
  '2026-07-15' as expiration_date,
  'OSHA-7500-2023-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'OSHA #7500 INTRODUCTION TO SAFETY'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-08-20' as completion_date,
  '2026-08-20' as expiration_date,
  'OSHA-7505-2023-H' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Hugh' AND cert.name = 'OSHA #7505 INTRODUCTION TO INCIDENT ACCIDENT INVESTIGATION OSHA'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;


-- Certifications for Will
INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-01-20' as completion_date,
  '2026-01-20' as expiration_date,
  'CPR-2023-003' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Will' AND cert.name = 'CPR, First Aid, BBP Instructor Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-10-10' as completion_date,
  '2025-10-10' as expiration_date,
  'NCOS-510-2022-W' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Will' AND cert.name = 'NCOS-510 OSHA for Construction Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-02-28' as completion_date,
  '2026-02-28' as expiration_date,
  'WZ-2023-W' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Will' AND cert.name = 'Wicklander and Zulawski Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-01-15' as completion_date,
  '2026-01-15' as expiration_date,
  'OSHA-511-2023-W' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Will' AND cert.name = 'OSHA-511 OSHA for General Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-03-05' as completion_date,
  '2026-03-05' as expiration_date,
  'PCS-FP-2023-W' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Will' AND cert.name = 'PCS- Fall Protection Competent Person'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-04-12' as completion_date,
  '2026-04-12' as expiration_date,
  'NCOS-3115-2023-W' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Will' AND cert.name = 'NCOS-3115 Fall Protection'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;


-- Certifications for Zack
INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-07-15' as completion_date,
  '2025-07-15' as expiration_date,
  'NCOS-510-2022-Z' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Zack' AND cert.name = 'NCOS-510 OSHA for Construction Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-02-20' as completion_date,
  '2026-02-20' as expiration_date,
  'PCS-FP-2023-Z' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Zack' AND cert.name = 'PCS- Fall Protection Competent Person'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-03-25' as completion_date,
  '2026-03-25' as expiration_date,
  'NCOS-3115-2023-Z' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Zack' AND cert.name = 'NCOS-3115 Fall Protection'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-05-10' as completion_date,
  '2026-05-10' as expiration_date,
  'IMDG-2023-Z' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Zack' AND cert.name = 'International Maritime Dangerous Goods'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;


-- Certifications for James
INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-06-20' as completion_date,
  '2025-06-20' as expiration_date,
  'NCOS-510-2022-J' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'James' AND cert.name = 'NCOS-510 OSHA for Construction Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-01-10' as completion_date,
  '2026-01-10' as expiration_date,
  'WZ-2023-J' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'James' AND cert.name = 'Wicklander and Zulawski Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-02-15' as completion_date,
  '2026-02-15' as expiration_date,
  'PCS-FP-2023-J' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'James' AND cert.name = 'PCS- Fall Protection Competent Person'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-03-20' as completion_date,
  '2026-03-20' as expiration_date,
  'OSHA-511-2023-J' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'James' AND cert.name = 'OSHA-511 OSHA for General Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;


-- Certifications for Sam
INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-01-05' as completion_date,
  '2026-01-05' as expiration_date,
  'CPR-2023-004' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Sam' AND cert.name = 'CPR, First Aid, BBP Instructor Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-05-15' as completion_date,
  '2025-05-15' as expiration_date,
  'NCOS-510-2022-S' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Sam' AND cert.name = 'NCOS-510 OSHA for Construction Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2022-12-20' as completion_date,
  '2025-12-20' as expiration_date,
  'WZ-2022-S' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Sam' AND cert.name = 'Wicklander and Zulawski Certification'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-02-10' as completion_date,
  '2026-02-10' as expiration_date,
  'OSHA-511-2023-S' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Sam' AND cert.name = 'OSHA-511 OSHA for General Industry'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-04-05' as completion_date,
  '2026-04-05' as expiration_date,
  'PCS-FP-2023-S' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Sam' AND cert.name = 'PCS- Fall Protection Competent Person'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;

INSERT INTO coach_certifications (coach_id, certification_id, status, completion_date, expiration_date, certificate_number, notes)
SELECT 
  c.id as coach_id,
  cert.id as certification_id,
  'completed' as status,
  '2023-06-15' as completion_date,
  '2026-06-15' as expiration_date,
  'IMDG-2023-S' as certificate_number,
  'Migrated from Excel data' as notes
FROM coaches c, certifications cert
WHERE c.name = 'Sam' AND cert.name = 'International Maritime Dangerous Goods'
ON CONFLICT (coach_id, certification_id) DO UPDATE SET
  status = EXCLUDED.status,
  completion_date = EXCLUDED.completion_date,
  expiration_date = EXCLUDED.expiration_date,
  certificate_number = EXCLUDED.certificate_number,
  notes = EXCLUDED.notes;


-- Certification migration completed!
-- Coaches now have their completed certifications recorded in the IDP system.
