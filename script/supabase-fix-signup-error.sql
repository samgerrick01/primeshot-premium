-- ============================================================
-- PrimeShot Premium - Fix "Database error saving new user"
-- ============================================================
-- Run this in your Supabase SQL Editor
-- Root causes:
--   1. The DB trigger uses ON CONFLICT (uuid) but uuid has no UNIQUE constraint
--   2. After signup, auth.uid() doesn't match yet, so RLS blocks the app's upsert
--   3. The trigger creates profile with only metadata, but the app needs
--      to also store firstname, lastname, address, etc.
-- ============================================================
-- This script is idempotent - safe to run multiple times
-- ============================================================

-- ============================================================
-- STEP 1: Add unique constraint on uuid column (if not exists)
-- Required for ON CONFLICT clause in trigger to work
-- ============================================================
-- First, clean up any duplicate uuid values (keep the first one)
DELETE FROM profiles a USING profiles b
WHERE a.id > b.id AND a.uuid = b.uuid;

-- Add constraint if it doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_uuid_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_uuid_key UNIQUE (uuid);
  END IF;
END $$;

-- ============================================================
-- STEP 2: Add unique constraint on email column (if not exists)
-- ============================================================
DELETE FROM profiles a USING profiles b
WHERE a.id > b.id AND a.email = b.email;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- ============================================================
-- STEP 3: Create a SECURITY DEFINER function that bypasses RLS
-- This allows the app to upsert a profile right after signup
-- even when the session isn't fully established yet.
-- SECURITY DEFINER = runs with owner privileges, bypasses RLS
-- ============================================================
CREATE OR REPLACE FUNCTION public.upsert_profile(
  p_uuid TEXT,
  p_email TEXT,
  p_role TEXT,
  p_firstname TEXT,
  p_lastname TEXT,
  p_nickname TEXT,
  p_full_address TEXT,
  p_street TEXT,
  p_barangay TEXT,
  p_city TEXT,
  p_province TEXT,
  p_zipcode TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    uuid, email, role,
    firstname, lastname, nickname,
    full_address, street, barangay, city, province, zipcode
  )
  VALUES (
    p_uuid, p_email, p_role,
    p_firstname, p_lastname, p_nickname,
    p_full_address, p_street, p_barangay, p_city, p_province, p_zipcode
  )
  ON CONFLICT (uuid)
  DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    firstname = EXCLUDED.firstname,
    lastname = EXCLUDED.lastname,
    nickname = EXCLUDED.nickname,
    full_address = EXCLUDED.full_address,
    street = EXCLUDED.street,
    barangay = EXCLUDED.barangay,
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    zipcode = EXCLUDED.zipcode;
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.upsert_profile TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_profile TO service_role;

-- ============================================================
-- STEP 4: Update the trigger to extract ALL fields from metadata
-- The app now passes firstname, lastname, nickname, address, etc.
-- as user_metadata during signUp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  meta_firstname text;
  meta_lastname text;
  meta_nickname text;
  meta_full_address text;
  meta_street text;
  meta_barangay text;
  meta_city text;
  meta_province text;
  meta_zipcode text;
BEGIN
  -- Extract all fields from user_metadata
  meta_firstname := COALESCE(NEW.raw_user_meta_data ->> 'firstname', '');
  meta_lastname := COALESCE(NEW.raw_user_meta_data ->> 'lastname', '');
  meta_nickname := COALESCE(NEW.raw_user_meta_data ->> 'nickname', '');
  meta_full_address := COALESCE(NEW.raw_user_meta_data ->> 'full_address', '');
  meta_street := COALESCE(NEW.raw_user_meta_data ->> 'street', '');
  meta_barangay := COALESCE(NEW.raw_user_meta_data ->> 'barangay', '');
  meta_city := COALESCE(NEW.raw_user_meta_data ->> 'city', '');
  meta_province := COALESCE(NEW.raw_user_meta_data ->> 'province', '');
  meta_zipcode := COALESCE(NEW.raw_user_meta_data ->> 'zipcode', '');

  INSERT INTO public.profiles (
    uuid, email, role,
    firstname, lastname, nickname,
    full_address, street, barangay, city, province, zipcode
  )
  VALUES (
    NEW.id::text, NEW.email, 'user',
    meta_firstname, meta_lastname, meta_nickname,
    meta_full_address, meta_street, meta_barangay, meta_city, meta_province, meta_zipcode
  )
  ON CONFLICT (uuid) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ============================================================
-- Verify: Check constraints
-- ============================================================
SELECT
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints
WHERE table_name = 'profiles'
  AND constraint_type = 'UNIQUE';
