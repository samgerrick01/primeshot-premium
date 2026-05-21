-- ============================================================
-- PrimeShot Premium - Fix Orders RLS Policies
-- ============================================================
-- Run this in your Supabase SQL Editor
-- Fixes: Missing INSERT/SELECT policies for authenticated users on orders & order_items tables
-- ============================================================

-- ============================================================
-- Fix 1: Allow authenticated users to INSERT their own orders
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- ============================================================
-- Fix 2: Allow authenticated users to SELECT their own orders
-- ============================================================
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- ============================================================
-- Fix 3: Allow authenticated users to INSERT order_items
-- (They need this when creating an order from the payment session)
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Fix 4: Allow authenticated users to SELECT their own order items
-- ============================================================
DROP POLICY IF EXISTS "Users can read their own order items" ON order_items;
CREATE POLICY "Users can read their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Verify: List all RLS policies for orders & order_items
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
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, cmd;

SELECT '✅ Orders RLS policies fixed successfully!' as result;
