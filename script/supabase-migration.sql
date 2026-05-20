-- ============================================================
-- PrimeShot Premium - Supabase SQL Migration
-- ============================================================
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- This script fixes the profiles table schema and adds a trigger
-- to auto-create profiles for existing and new users.
-- ============================================================

-- STEP 1: Add uuid column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS uuid TEXT;

-- STEP 2: Create index on uuid for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_uuid ON profiles (uuid);

-- STEP 3: Add email column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- STEP 4: Add role column with default if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- STEP 5: Add missing profile columns if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS firstname TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS lastname TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS nickname TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS full_address TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS street TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS barangay TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS province TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS zipcode TEXT DEFAULT '';

-- STEP 6: Update existing profiles to set uuid from auth.users
-- This syncs existing profiles with the auth.users table
UPDATE profiles p
SET uuid = au.id::text
FROM auth.users au
WHERE p.email = au.email
  AND p.uuid IS NULL;

-- STEP 7: Create or replace the function to auto-create profiles
-- for new users who sign up (in case the application code fails)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    uuid,
    email,
    role,
    firstname,
    lastname,
    nickname,
    full_address,
    street,
    barangay,
    city,
    province,
    zipcode
  )
  VALUES (
    NEW.id::text,
    NEW.email,
    'user',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (uuid) DO NOTHING;
  RETURN NEW;
END;
$$;

-- STEP 8: Create the trigger to run on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 9: Also add a trigger to update profile UUID when email matches
-- This handles cases where profiles were created before the uuid fix
CREATE OR REPLACE FUNCTION public.sync_profile_uuid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles
  SET uuid = NEW.id::text
  WHERE email = NEW.email AND uuid IS NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_uuid();

-- ============================================================
-- STEP 10: FIX ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS and add policies so the app can read profiles
-- NOTE: uuid is TEXT type, so we cast auth.uid()::text
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile (by uuid - cast to text!)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (uuid = auth.uid()::text);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (uuid = auth.uid()::text)
  WITH CHECK (uuid = auth.uid()::text);

-- Allow users to insert their own profile during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (uuid = auth.uid()::text);

-- ============================================================
-- STEP 11: SET YOURSELF AS ADMIN
-- ============================================================

-- Check what profiles exist:
SELECT id, uuid, email, role FROM profiles;

-- Set your email as admin:
UPDATE profiles SET role = 'admin'
WHERE email = 'desilva.sam17.sgds@gmail.com';

-- Verify:
SELECT id, uuid, email, role FROM profiles;
