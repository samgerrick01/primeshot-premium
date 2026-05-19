-- ============================================================
-- PrimeShot Premium - Fix Missing DELETE RLS Policies
-- ============================================================
-- Run this in your Supabase SQL Editor
-- Fixes: diameters table missing DELETE policy
-- Fixes: profiles table missing DELETE policy
-- ============================================================

-- ============================================================
-- Fix 1: Add DELETE policy for diameters table
-- ============================================================
DROP POLICY IF EXISTS "Admins can delete diameters" ON diameters;
CREATE POLICY "Admins can delete diameters"
  ON diameters FOR DELETE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- ============================================================
-- Fix 2: Add DELETE policy for profiles table
-- Only admins can delete profiles
-- ============================================================
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- ============================================================
-- Verify: List all RLS policies for these tables
-- ============================================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('diameters', 'profiles', 'products')
ORDER BY tablename, cmd;
