-- Create Products and System Settings Tables
--
-- 1. New Tables
--    - products: Stores product catalog with stockholding configuration
--    - product_barcodes: Stores CASE and UNIT barcodes for products
--    - system_settings: Stores system-wide configuration values
--
-- 2. Security
--    - Enable RLS on all tables
--    - Add policies for authenticated users to manage data
--
-- 3. Data Seeding
--    - Insert default system settings for stockholding configuration

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_alias text UNIQUE NOT NULL,
  principal_company text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  case_size text NOT NULL DEFAULT '',
  pack_size text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  pack_count integer NOT NULL DEFAULT 0,
  container text NOT NULL DEFAULT '',
  stockholding_weeks numeric NOT NULL DEFAULT 8,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_barcodes table
CREATE TABLE IF NOT EXISTS product_barcodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  barcode text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('CASE', 'UNIT')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for product_barcodes
CREATE INDEX IF NOT EXISTS idx_product_barcodes_product_id ON product_barcodes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_barcodes_barcode ON product_barcodes(barcode);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  description text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_barcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Allow authenticated users to read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for product_barcodes table
CREATE POLICY "Allow authenticated users to read product_barcodes"
  ON product_barcodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert product_barcodes"
  ON product_barcodes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product_barcodes"
  ON product_barcodes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete product_barcodes"
  ON product_barcodes FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for system_settings table
CREATE POLICY "Allow authenticated users to read system_settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert system_settings"
  ON system_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update system_settings"
  ON system_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete system_settings"
  ON system_settings FOR DELETE
  TO authenticated
  USING (true);

-- Seed default system settings
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES 
  ('default_stockholding_weeks', '8', 'Default stockholding duration in weeks for products without a specified value'),
  ('min_stockholding_weeks', '1', 'Minimum allowed stockholding duration in weeks'),
  ('max_stockholding_weeks', '52', 'Maximum allowed stockholding duration in weeks')
ON CONFLICT (setting_key) DO NOTHING;