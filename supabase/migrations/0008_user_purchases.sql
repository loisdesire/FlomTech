CREATE TABLE IF NOT EXISTS user_purchases (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id            UUID NOT NULL REFERENCES platform_products(id) ON DELETE RESTRICT,
  email                 TEXT NOT NULL,
  amount_usd            NUMERIC(10,2) NOT NULL,
  payment_provider      TEXT NOT NULL DEFAULT 'stripe',
  stripe_session_id     TEXT UNIQUE,
  stripe_payment_intent TEXT,
  status                TEXT NOT NULL DEFAULT 'completed'
                          CHECK (status IN ('pending','completed','refunded')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Users can only see their own purchases
CREATE POLICY "users_own_purchases" ON user_purchases
  FOR SELECT USING (user_id = auth.uid());

-- Service role (admin client) bypasses RLS — no insert policy needed
