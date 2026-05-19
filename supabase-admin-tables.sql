-- ============================================================
-- PrimeShot Premium - Admin Tables SQL Migration
-- ============================================================
-- Run this in your Supabase SQL Editor
-- Creates: diameters, products, orders, order_items tables
-- ============================================================

-- ============================================================
-- STEP 1: Create diameters table (for dropdown in Add Products)
-- ============================================================
CREATE TABLE IF NOT EXISTS diameters (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE diameters ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read diameters
DROP POLICY IF EXISTS "Anyone can read diameters" ON diameters;
CREATE POLICY "Anyone can read diameters"
  ON diameters FOR SELECT
  USING (true);

-- Allow admins to insert diameters
DROP POLICY IF EXISTS "Admins can insert diameters" ON diameters;
CREATE POLICY "Admins can insert diameters"
  ON diameters FOR INSERT
  WITH CHECK (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- Insert default diameters
INSERT INTO diameters (value) VALUES
  ('.177'),
  ('.20'),
  ('.22'),
  ('.25'),
  ('.30'),
  ('.357'),
  ('.45')
ON CONFLICT (value) DO NOTHING;

-- ============================================================
-- STEP 2: Create products table
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  stocks INTEGER NOT NULL DEFAULT 0,
  caliber TEXT DEFAULT '',
  grains DECIMAL(8,2) DEFAULT 0,
  diameter TEXT NOT NULL REFERENCES diameters(value),
  images TEXT[] DEFAULT '{}',
  category TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (for the shop)
DROP POLICY IF EXISTS "Anyone can read products" ON products;
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

-- Allow admins to insert/update/delete products
DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- ============================================================
-- STEP 3: Create orders table
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all orders
DROP POLICY IF EXISTS "Admins can read orders" ON orders;
CREATE POLICY "Admins can read orders"
  ON orders FOR SELECT
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- Allow admins to update orders
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- ============================================================
-- STEP 4: Create order_items table
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read order_items" ON order_items;
CREATE POLICY "Admins can read order_items"
  ON order_items FOR SELECT
  USING (auth.uid()::text IN (
    SELECT uuid FROM profiles WHERE role = 'admin'
  ));

-- ============================================================
-- STEP 5: Verify everything
-- ============================================================
SELECT '✅ Tables created successfully!' as result;

-- Check diameters
SELECT * FROM diameters ORDER BY id;

-- Check products
SELECT * FROM products LIMIT 5;

-- Check orders
SELECT * FROM orders LIMIT 5;
