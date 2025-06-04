-- Create authorized_users table
CREATE TABLE authorized_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  added_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read authorized users (needed for signup validation)
CREATE POLICY "Allow authenticated users to read authorized_users" ON authorized_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage authorized users (for admin functionality later)
CREATE POLICY "Allow authenticated users to manage authorized_users" ON authorized_users
  FOR ALL USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_authorized_users_updated_at BEFORE UPDATE ON authorized_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial authorized users (replace with actual email addresses)
INSERT INTO authorized_users (email, name) VALUES
('mike@freedomforever.com', 'Mike'),
('james@freedomforever.com', 'James'),
('sam@freedomforever.com', 'Sam'),
('hugh@freedomforever.com', 'Hugh'),
('joe@freedomforever.com', 'Joe'),
('zack@freedomforever.com', 'Zack'),
('will@freedomforever.com', 'Will'),
('admin@freedomforever.com', 'Admin');

-- Create a function to check if an email is authorized
CREATE OR REPLACE FUNCTION is_email_authorized(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM authorized_users 
    WHERE email = user_email AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function that will be called on user signup to validate authorization
CREATE OR REPLACE FUNCTION validate_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email is in the authorized users list
  IF NOT is_email_authorized(NEW.email) THEN
    RAISE EXCEPTION 'Email % is not authorized to sign up. Please contact an administrator.', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to validate user signup
CREATE TRIGGER validate_signup_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_signup(); 