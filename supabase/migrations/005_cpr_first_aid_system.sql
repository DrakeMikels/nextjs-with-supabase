-- Migration: CPR/First Aid Certification Tracking System
-- Description: Creates tables for tracking CPR and First Aid certifications for coaches and their assigned offices
-- Date: 2024-12-28

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offices table
CREATE TABLE IF NOT EXISTS offices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, location)
);

-- Create coach_office_assignments table
CREATE TABLE IF NOT EXISTS coach_office_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coach_id, office_id)
);

-- Create cpr_first_aid_records table
CREATE TABLE IF NOT EXISTS cpr_first_aid_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    cpr_certification_date DATE,
    cpr_expiration_date DATE,
    first_aid_certification_date DATE,
    first_aid_expiration_date DATE,
    provider VARCHAR(100),
    certificate_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'not_certified' CHECK (status IN ('current', 'expiring_soon', 'expired', 'not_certified')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coach_id, office_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coach_office_assignments_coach_id ON coach_office_assignments(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_office_assignments_office_id ON coach_office_assignments(office_id);
CREATE INDEX IF NOT EXISTS idx_coach_office_assignments_is_primary ON coach_office_assignments(is_primary);

CREATE INDEX IF NOT EXISTS idx_cpr_first_aid_records_coach_id ON cpr_first_aid_records(coach_id);
CREATE INDEX IF NOT EXISTS idx_cpr_first_aid_records_office_id ON cpr_first_aid_records(office_id);
CREATE INDEX IF NOT EXISTS idx_cpr_first_aid_records_status ON cpr_first_aid_records(status);
CREATE INDEX IF NOT EXISTS idx_cpr_first_aid_records_expiration ON cpr_first_aid_records(cpr_expiration_date);

CREATE INDEX IF NOT EXISTS idx_offices_region ON offices(region);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for cpr_first_aid_records
DROP TRIGGER IF EXISTS update_cpr_first_aid_records_updated_at ON cpr_first_aid_records;
CREATE TRIGGER update_cpr_first_aid_records_updated_at 
    BEFORE UPDATE ON cpr_first_aid_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update certification status based on expiration dates
CREATE OR REPLACE FUNCTION update_certification_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Determine status based on expiration dates
    IF NEW.cpr_expiration_date IS NULL AND NEW.first_aid_expiration_date IS NULL THEN
        NEW.status = 'not_certified';
    ELSIF NEW.cpr_expiration_date < CURRENT_DATE OR NEW.first_aid_expiration_date < CURRENT_DATE THEN
        NEW.status = 'expired';
    ELSIF NEW.cpr_expiration_date <= CURRENT_DATE + INTERVAL '30 days' OR NEW.first_aid_expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN
        NEW.status = 'expiring_soon';
    ELSE
        NEW.status = 'current';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update status
DROP TRIGGER IF EXISTS update_certification_status_trigger ON cpr_first_aid_records;
CREATE TRIGGER update_certification_status_trigger 
    BEFORE INSERT OR UPDATE ON cpr_first_aid_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_certification_status();

-- Insert sample regions
INSERT INTO regions (name, description) VALUES
    ('PacWest', 'Pacific West region covering Colorado, Idaho, Utah, Oregon'),
    ('Texas', 'Texas region covering all Texas locations'),
    ('Southwest', 'Southwest region covering Arizona and New Mexico'),
    ('NorCal', 'Northern California region'),
    ('SoCal', 'Southern California region'),
    ('Northeast', 'Northeast region covering Massachusetts and surrounding areas'),
    ('SouthEast', 'Southeast region covering Florida and surrounding areas'),
    ('Central East', 'Central East region covering Illinois, Ohio, New Jersey, Maryland, Virginia')
ON CONFLICT (name) DO NOTHING;

-- Note: Office locations should be added manually by users through the application interface
-- This allows for accurate, up-to-date office information specific to your organization

-- Enable Row Level Security (RLS)
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_office_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpr_first_aid_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to view regions" ON regions;
CREATE POLICY "Allow authenticated users to view regions" ON regions
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to view offices" ON offices;
CREATE POLICY "Allow authenticated users to view offices" ON offices
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage coach office assignments" ON coach_office_assignments;
CREATE POLICY "Allow authenticated users to manage coach office assignments" ON coach_office_assignments
    FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage CPR/First Aid records" ON cpr_first_aid_records;
CREATE POLICY "Allow authenticated users to manage CPR/First Aid records" ON cpr_first_aid_records
    FOR ALL TO authenticated USING (true);

-- Grant permissions
GRANT SELECT ON regions TO authenticated;
GRANT SELECT ON offices TO authenticated;
GRANT ALL ON coach_office_assignments TO authenticated;
GRANT ALL ON cpr_first_aid_records TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE regions IS 'Geographical regions for organizing offices';
COMMENT ON TABLE offices IS 'Office locations where coaches are assigned';
COMMENT ON TABLE coach_office_assignments IS 'Many-to-many relationship between coaches and offices';
COMMENT ON TABLE cpr_first_aid_records IS 'CPR and First Aid certification records for coaches at specific offices';

COMMENT ON COLUMN cpr_first_aid_records.status IS 'Certification status: current, expiring_soon, expired, not_certified';
COMMENT ON COLUMN coach_office_assignments.is_primary IS 'Indicates if this is the coaches primary office assignment'; 