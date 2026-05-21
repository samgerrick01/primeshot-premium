-- Add grains, diameter, and caliber columns to order_items table
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS grains TEXT,
  ADD COLUMN IF NOT EXISTS diameter TEXT,
  ADD COLUMN IF NOT EXISTS caliber TEXT;
