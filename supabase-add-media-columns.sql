-- ============================================================
-- PrimeShot Premium - Add media columns to products table
-- ============================================================
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Add videos column (TEXT[]) if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'videos'
  ) THEN
    ALTER TABLE products ADD COLUMN videos TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add thumbnail column (TEXT) if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'thumbnail'
  ) THEN
    ALTER TABLE products ADD COLUMN thumbnail TEXT DEFAULT '';
  END IF;
END $$;

-- ============================================================
-- Create storage bucket if not exists
-- ============================================================
-- Note: You can also create this manually in Supabase Dashboard > Storage > Create bucket
-- Bucket name: primeshot
-- Make it public so images are accessible

INSERT INTO storage.buckets (id, name, public)
VALUES ('primeshot', 'primeshot', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to primeshot bucket
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'primeshot');

-- Allow anyone to view files in primeshot bucket
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;
CREATE POLICY "Anyone can view files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'primeshot');

-- Allow authenticated users to delete their own files
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
CREATE POLICY "Authenticated users can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'primeshot');

SELECT '✅ Media columns and storage policies added successfully!' as result;
