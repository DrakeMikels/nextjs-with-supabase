-- Migration: Fix RLS policy for offices table to allow INSERT operations
-- Description: Adds INSERT policy for offices table so CPR/First Aid component can create new offices
-- Date: 2024-12-28

-- Drop the existing SELECT-only policy for offices
DROP POLICY IF EXISTS "Allow authenticated users to view offices" ON offices;

-- Create a comprehensive policy that allows all operations for authenticated users
CREATE POLICY "Allow authenticated users to manage offices" ON offices
    FOR ALL TO authenticated USING (true);

-- Ensure proper permissions are granted
GRANT ALL ON offices TO authenticated; 