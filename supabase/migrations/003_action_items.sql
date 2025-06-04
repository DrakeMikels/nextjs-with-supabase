-- Create action items table for tracking tasks and follow-ups
CREATE TABLE action_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES coaches(id) ON DELETE SET NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_action_items_assigned_to ON action_items(assigned_to);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_priority ON action_items(priority);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);

-- Create updated_at trigger for action_items
CREATE TRIGGER update_action_items_updated_at 
  BEFORE UPDATE ON action_items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to view action items" ON action_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert action items" ON action_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update action items" ON action_items
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete action items" ON action_items
  FOR DELETE TO authenticated USING (true);

-- Insert some sample action items
INSERT INTO action_items (title, description, assigned_to, priority, status, due_date) VALUES
('Complete Q4 Safety Training', 'Ensure all coaches complete their quarterly safety training requirements', NULL, 'high', 'open', '2024-12-31'),
('Update Emergency Procedures', 'Review and update emergency response procedures for all locations', NULL, 'medium', 'open', '2025-01-15'),
('Schedule Equipment Inspections', 'Coordinate safety equipment inspections for all branches', NULL, 'medium', 'open', '2025-01-30'); 