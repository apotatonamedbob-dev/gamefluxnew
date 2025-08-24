-- Fix any potential constraint issues with profile updates
-- Make sure username can be updated and is not overly restrictive

-- Drop existing constraints if they exist
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_check;

-- Add a more flexible username constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_username_check 
CHECK (username IS NULL OR (length(username) >= 3 AND length(username) <= 30 AND username ~ '^[a-zA-Z0-9_]+$'));

-- Ensure the profiles table has proper permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Update RLS policies to ensure users can update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ensure the trigger function exists and works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, created_at, updated_at)
  VALUES (
    new.id,
    null,
    null,
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
