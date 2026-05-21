-- Add tracking_number and courier_service columns if they don't exist
-- This migration adds tracking support to the orders table

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS courier_service TEXT;
