-- Create branch visits table for tracking coach responsibilities and last visit dates
CREATE TABLE branch_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  branch_name TEXT NOT NULL,
  last_visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(coach_id, branch_name)
);

-- Create indexes for better performance
CREATE INDEX idx_branch_visits_coach_id ON branch_visits(coach_id);
CREATE INDEX idx_branch_visits_branch_name ON branch_visits(branch_name);
CREATE INDEX idx_branch_visits_last_visit_date ON branch_visits(last_visit_date);

-- Create updated_at trigger for branch_visits
CREATE TRIGGER update_branch_visits_updated_at 
  BEFORE UPDATE ON branch_visits 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE branch_visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to view branch visits" ON branch_visits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert branch visits" ON branch_visits
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update branch visits" ON branch_visits
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete branch visits" ON branch_visits
  FOR DELETE TO authenticated USING (true);

-- Insert some sample branch assignments and last visit dates
INSERT INTO branch_visits (coach_id, branch_name, last_visit_date) 
SELECT 
  c.id,
  'Houston Branch',
  DATE '2024-12-15'
FROM coaches c WHERE c.name = 'Hugh'
UNION ALL
SELECT 
  c.id,
  'Denver Branch',
  DATE '2024-12-10'
FROM coaches c WHERE c.name = 'Mike'
UNION ALL
SELECT 
  c.id,
  'Sacramento Branch',
  DATE '2024-12-08'
FROM coaches c WHERE c.name = 'Zack'
UNION ALL
SELECT 
  c.id,
  'Phoenix Branch',
  NULL
FROM coaches c WHERE c.name = 'Hugh'
UNION ALL
SELECT 
  c.id,
  'Austin Branch',
  DATE '2024-11-28'
FROM coaches c WHERE c.name = 'Mike'; 