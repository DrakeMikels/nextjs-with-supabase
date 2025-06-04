-- Migration: Add CPR Trainer License fields to coaches table
-- Description: Adds CPR trainer license tracking fields to the coaches table (separate from general CPR certification)
-- Date: 2024-12-28

-- Add CPR Trainer License fields to coaches table
ALTER TABLE coaches 
ADD COLUMN IF NOT EXISTS cpr_trainer_license_date DATE,
ADD COLUMN IF NOT EXISTS cpr_trainer_expiration_date DATE,
ADD COLUMN IF NOT EXISTS cpr_trainer_provider VARCHAR(100),
ADD COLUMN IF NOT EXISTS cpr_trainer_license_number VARCHAR(50);

-- Add indexes for better performance on expiration date queries
CREATE INDEX IF NOT EXISTS idx_coaches_cpr_trainer_expiration ON coaches(cpr_trainer_expiration_date);

-- Add comments for documentation
COMMENT ON COLUMN coaches.cpr_trainer_license_date IS 'Date when CPR trainer license was obtained';
COMMENT ON COLUMN coaches.cpr_trainer_expiration_date IS 'Date when CPR trainer license expires';
COMMENT ON COLUMN coaches.cpr_trainer_provider IS 'Organization that provided the CPR trainer license';
COMMENT ON COLUMN coaches.cpr_trainer_license_number IS 'License number for the CPR trainer certification'; 