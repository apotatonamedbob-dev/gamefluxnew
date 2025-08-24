-- Set josiahglanton@gmail.com as owner and head admin
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "owner"}'::jsonb
WHERE email = 'josiahglanton@gmail.com';

-- Update or insert profile for the owner
INSERT INTO public.profiles (id, username, display_name, is_admin, created_at, updated_at)
SELECT 
  id,
  'josiahglanton',
  'Josiah Glanton',
  true,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'josiahglanton@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  is_admin = true,
  updated_at = NOW();
