-- Add section to platform_products so admin controls which page a product appears on
ALTER TABLE platform_products
  ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT 'academy'
    CHECK (section IN ('academy', 'shop', 'both'));
