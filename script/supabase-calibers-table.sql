-- Create calibers table for managing caliber options
CREATE TABLE IF NOT EXISTS calibers (
  id SERIAL PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE calibers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to calibers"
  ON calibers FOR SELECT
  TO public
  USING (true);

-- Allow admin insert/update/delete
CREATE POLICY "Allow admin insert calibers"
  ON calibers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.uuid::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update calibers"
  ON calibers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.uuid::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin delete calibers"
  ON calibers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.uuid::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Insert some default caliber values
INSERT INTO calibers (value) VALUES
  ('.177'),
  ('.22'),
  ('.25'),
  ('4.5mm'),
  ('5.5mm'),
  ('6.35mm')
ON CONFLICT (value) DO NOTHING;
