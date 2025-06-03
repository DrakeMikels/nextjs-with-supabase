-- Create IDP (Individual Development Plan) system tables

-- Certification categories and requirements
CREATE TABLE certification_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Individual certifications/courses
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES certification_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT,
  duration_hours INTEGER,
  expiration_months INTEGER, -- How many months until it expires
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Coach certification progress/completion
CREATE TABLE coach_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'expired')) DEFAULT 'not_started',
  start_date DATE,
  completion_date DATE,
  expiration_date DATE,
  certificate_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(coach_id, certification_id)
);

-- IDP goals and objectives
CREATE TABLE idp_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_completion_date DATE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')) DEFAULT 'not_started',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert certification categories
INSERT INTO certification_categories (name, description, is_required) VALUES
('OSHA Safety', 'Occupational Safety and Health Administration certifications', true),
('First Aid & CPR', 'Emergency response and medical certifications', true),
('Investigation & Audit', 'Incident investigation and audit certifications', false),
('Electrical Safety', 'Electrical safety and NFPA certifications', false),
('Fall Protection', 'Fall protection and height safety certifications', true),
('Maritime Safety', 'Maritime and dangerous goods certifications', false),
('Instructor Certifications', 'Training and instruction certifications', false);

-- Insert specific certifications based on the Excel data
INSERT INTO certifications (category_id, name, description, duration_hours, expiration_months, is_required) VALUES
-- OSHA Safety
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'NCOS-510 OSHA for Construction Industry', 'OSHA 510 - Occupational Safety and Health Standards for Construction', 30, 36, true),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA-511 OSHA for General Industry', 'OSHA 511 - Occupational Safety and Health Standards for General Industry', 30, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA-521 OSHA Guide to Industrial Hygiene', 'OSHA 521 - Guide to Industrial Hygiene', 32, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #500 - Trainer Course', 'OSHA 500 - Trainer Course in Occupational Safety and Health Standards for Construction', 40, 48, false),

-- First Aid & CPR
((SELECT id FROM certification_categories WHERE name = 'First Aid & CPR'), 'CPR, First Aid, BBP Instructor Certification', 'CPR, First Aid, and Bloodborne Pathogen Instructor Certification', 16, 24, true),

-- Investigation & Audit
((SELECT id FROM certification_categories WHERE name = 'Investigation & Audit'), 'Wicklander and Zulawski Certification', 'Wicklander and Zulawski Interview and Interrogation Certification', 40, 36, false),

-- Electrical Safety
((SELECT id FROM certification_categories WHERE name = 'Electrical Safety'), 'OSHA-470 Electrical Safe Work Practices', 'OSHA 470 - Electrical Safe Work Practices and Update to NFPA 70E', 30, 36, false),

-- Fall Protection
((SELECT id FROM certification_categories WHERE name = 'Fall Protection'), 'PCS- Fall Protection Competent Person', 'Fall Protection Competent Person [24 Hours]', 24, 36, true),
((SELECT id FROM certification_categories WHERE name = 'Fall Protection'), 'NCOS-3115 Fall Protection', 'NCOS-3115 Fall Protection Certification', 8, 36, false),

-- Maritime Safety
((SELECT id FROM certification_categories WHERE name = 'Maritime Safety'), 'International Maritime Dangerous Goods', 'International Maritime Dangerous Goods Certification', 16, 60, false),

-- Respiratory Protection
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #2225 RESPIRATORY PROTECTION', 'OSHA 2225 Respiratory Protection Standards', 16, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #2255 PRINCIPLES OF ERGONOMICS', 'OSHA 2255 Principles of Ergonomics', 14, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #3095 ELECTRICAL STANDARDS', 'OSHA 3095 Electrical Standards', 30, 36, false),

-- Health and Safety Management
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #500 - Trainer Course in Occupational Safety and Health Standards for the Construction Industry', 'Advanced trainer certification for construction safety', 40, 48, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #501 - Trainer Course in Occupational Safety and Health Standards for General Industry', 'Advanced trainer certification for general industry safety', 40, 48, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7105 INTRODUCTION TO EVACUATION AND EMERGENCY PLANNING', 'Emergency evacuation and planning procedures', 14, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7115 INTRODUCTION TO MACHINE SAFEGUARDING', 'Machine safeguarding principles and practices', 16, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7200 INTRODUCTION TO MACHINE SAFEGUARDING', 'Advanced machine safeguarding techniques', 24, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7205 HEALTH HAZARD AWARENESS', 'Health hazard identification and control', 16, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7300 INTRODUCTION TO SAFETY AND HEALTH MANAGEMENT', 'Safety and health management systems', 30, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7305 INTRODUCTION TO INCIDENT (ACCIDENT) INVESTIGATION', 'Incident investigation procedures and techniques', 16, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7400 HAZARD RECOGNITION & HEARING PROTECTION IN CONSTRUCTION & GENERAL INDUSTRIES', 'Hazard recognition and hearing protection', 16, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7410 INTRODUCTION TO SAFETY AND HEALTH MANAGEMENT', 'Introduction to safety and health management principles', 24, 36, false),
((SELECT id FROM certification_categories WHERE name = 'OSHA Safety'), 'OSHA #7845 RECORDKEEPING RULE SEMINAR', 'OSHA recordkeeping requirements and compliance', 8, 36, false);

-- Create indexes for better performance
CREATE INDEX idx_coach_certifications_coach_id ON coach_certifications(coach_id);
CREATE INDEX idx_coach_certifications_status ON coach_certifications(status);
CREATE INDEX idx_coach_certifications_expiration ON coach_certifications(expiration_date);
CREATE INDEX idx_idp_goals_coach_id ON idp_goals(coach_id);
CREATE INDEX idx_idp_goals_status ON idp_goals(status);

-- Create updated_at trigger for coach_certifications
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coach_certifications_updated_at BEFORE UPDATE ON coach_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_idp_goals_updated_at BEFORE UPDATE ON idp_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 