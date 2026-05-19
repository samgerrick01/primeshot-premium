-- ============================================================
-- PrimeShot Premium - Categories & Grains Tables SQL Migration
-- ============================================================
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1: Create categories table
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- Allow admins to insert categories
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- Allow admins to delete categories
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Pellets'),
  ('Slugs')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- STEP 2: Create grains table
-- ============================================================
CREATE TABLE IF NOT EXISTS grains (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE grains ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read grains
DROP POLICY IF EXISTS "Anyone can read grains" ON grains;
CREATE POLICY "Anyone can read grains"
  ON grains FOR SELECT
  USING (true);

-- Allow admins to insert grains
DROP POLICY IF EXISTS "Admins can insert grains" ON grains;
CREATE POLICY "Admins can insert grains"
  ON grains FOR INSERT
  WITH CHECK (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- Allow admins to delete grains
DROP POLICY IF EXISTS "Admins can delete grains" ON grains;
CREATE POLICY "Admins can delete grains"
  ON grains FOR DELETE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- Insert default grains
INSERT INTO grains (value) VALUES
  ('16'),
  ('18'),
  ('20'),
  ('22'),
  ('25'),
  ('28'),
  ('32'),
  ('36'),
  ('40'),
  ('50')
ON CONFLICT (value) DO NOTHING;

-- ============================================================
-- STEP 3: Verify
-- ============================================================
SELECT '✅ Categories & Grains tables created successfully!' as result;
SELECT * FROM categories ORDER BY id;
SELECT * FROM grains ORDER BY id;
