CREATE TABLE affiliate_links (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT    NOT NULL,
  tagline     TEXT    NOT NULL DEFAULT '',
  description TEXT    NOT NULL DEFAULT '',
  url         TEXT    NOT NULL,
  category    TEXT    NOT NULL DEFAULT 'business'
                CHECK (category IN ('business','importation','ai','marketing','websites','financial')),
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No RLS needed — public reads go through admin client, writes are admin-only API routes
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- Public can read active links
CREATE POLICY "affiliate_links_public_read" ON affiliate_links
  FOR SELECT USING (is_active = TRUE);

-- Seed with existing hardcoded tools
INSERT INTO affiliate_links (name, tagline, description, url, category, featured, sort_order) VALUES
  ('Canva',              'Design made easy',             'Create professional flyers, social media posts, invoices, and presentations — no design skills needed.',           'https://canva.com',              'business',    TRUE,  1),
  ('Notion',             'All-in-one workspace',         'Track orders, manage clients, write SOPs, and run your whole business in one place.',                              'https://notion.so',              'business',    FALSE, 2),
  ('Google Workspace',   'Professional email + docs',    'Get a business email (you@yourcompany.com), Drive storage, and the full Google suite.',                            'https://workspace.google.com',   'business',    FALSE, 3),
  ('Alibaba',            'Global wholesale marketplace', 'Source products directly from verified manufacturers and suppliers worldwide. Best for bulk orders.',              'https://alibaba.com',            'importation', TRUE,  1),
  ('AliExpress',         'Small-quantity imports',       'Order smaller quantities with no minimum order requirement. Great for testing new products.',                      'https://aliexpress.com',         'importation', FALSE, 2),
  ('DHgate',             'Wholesale, lower MOQ',         'Good middle ground between AliExpress and Alibaba — lower minimums than Alibaba, more variety.',                  'https://dhgate.com',             'importation', FALSE, 3),
  ('ChatGPT Plus',       'AI business assistant',        'Write product descriptions, reply to customer messages, create marketing copy — 10× faster.',                     'https://chat.openai.com',        'ai',          TRUE,  1),
  ('Grammarly',          'Professional writing',         'Ensures every email, proposal, and message you send is clear, professional, and error-free.',                     'https://grammarly.com',          'ai',          FALSE, 2),
  ('Claude',             'AI for longer tasks',          'Great for long-form writing, business plan drafting, and analysing documents and spreadsheets.',                  'https://claude.ai',              'ai',          FALSE, 3),
  ('Mailchimp',          'Email marketing',              'Build your email list and send newsletters, promotions, and automated follow-ups to customers.',                   'https://mailchimp.com',          'marketing',   TRUE,  1),
  ('Buffer',             'Social media scheduling',      'Schedule posts across Instagram, Facebook, and X from one dashboard. Save hours every week.',                     'https://buffer.com',             'marketing',   FALSE, 2),
  ('Meta Ads Manager',   'Facebook & Instagram ads',     'Run targeted ads to reach buyers in Nigeria and across Africa. Best ROI for product businesses.',                 'https://business.facebook.com',  'marketing',   FALSE, 3),
  ('Shopify',            'Ecommerce store builder',      'The easiest way to launch an online store for your imported products. Handles payments, inventory, and shipping.','https://shopify.com',            'websites',    TRUE,  1),
  ('WordPress + Hostinger','Full website control',       'Build a full business website with total flexibility. Best for service businesses and blogs.',                    'https://hostinger.com',          'websites',    FALSE, 2),
  ('Carrd',              'Quick one-page sites',         'Launch a professional landing page in 30 minutes. Perfect for lead capture and product promos.',                  'https://carrd.co',               'websites',    FALSE, 3),
  ('Paystack',           'Nigerian payments',            'Accept card, bank transfer, and USSD payments from Nigerian customers. Easy to set up.',                          'https://paystack.com',           'financial',   TRUE,  1),
  ('Wise',               'Cheap international transfers','Send money abroad to pay suppliers at the real exchange rate — far cheaper than bank wire fees.',                 'https://wise.com',               'financial',   FALSE, 2),
  ('Flutterwave',        'Africa-wide payments',         'Accept payments from customers across Africa. Good alternative or complement to Paystack.',                       'https://flutterwave.com',        'financial',   FALSE, 3);
