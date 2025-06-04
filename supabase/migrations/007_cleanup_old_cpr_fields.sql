-- Migration: Clean up old CPR certification fields
-- Description: Remove old CPR certification fields that were replaced with trainer license fields
-- Date: 2024-12-28

-- Drop old indexes if they exist
DROP INDEX IF EXISTS idx_coaches_cpr_expiration;
DROP INDEX IF EXISTS idx_coaches_first_aid_expiration;

-- Remove old CPR certification columns
ALTER TABLE coaches 
DROP COLUMN IF EXISTS cpr_certification_date,
DROP COLUMN IF EXISTS cpr_expiration_date,
DROP COLUMN IF EXISTS first_aid_certification_date,
DROP COLUMN IF EXISTS first_aid_expiration_date,
DROP COLUMN IF EXISTS cpr_provider,
DROP COLUMN IF EXISTS cpr_certificate_number; 