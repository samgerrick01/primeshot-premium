-- ============================================================
-- Create the 'primeshot' storage bucket and set up policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create the bucket (idempotent - will not error if exists)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'primeshot',
  'primeshot',
  true,                       -- public bucket (anyone can read files)
  false,
  5242880,                    -- 5 MB file size limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[];

-- 2. Allow public read access to any file in the bucket
CREATE POLICY "Anyone can view receipts" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'primeshot');

-- 3. Allow authenticated users to upload files (receipts)
CREATE POLICY "Authenticated users can upload receipts" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'primeshot'
    AND auth.role() = 'authenticated'
  );

-- 4. Allow users to update their own uploads
CREATE POLICY "Users can update own receipts" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'primeshot'
    AND auth.uid() = owner
  );

-- 5. Allow users to delete their own uploads
CREATE POLICY "Users can delete own receipts" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'primeshot'
    AND auth.uid() = owner
  );
