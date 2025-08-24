-- Fix infinite recursion in RLS policies by removing problematic admin policy
-- and simplifying the policies structure

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;

-- Create a simpler admin policy that doesn't reference the profiles table
-- This allows admins to view all profiles without circular reference
CREATE POLICY "profiles_admin_select_all" ON public.profiles 
  FOR SELECT USING (
    -- Allow access if user email is the admin email
    (SELECT auth.email() = 'josiahglanton@gmail.com')
  );

-- Also add admin policies for update and delete operations
CREATE POLICY "profiles_admin_update_all" ON public.profiles 
  FOR UPDATE USING (
    (SELECT auth.email() = 'josiahglanton@gmail.com')
  );

CREATE POLICY "profiles_admin_delete_all" ON public.profiles 
  FOR DELETE USING (
    (SELECT auth.email() = 'josiahglanton@gmail.com')
  );
