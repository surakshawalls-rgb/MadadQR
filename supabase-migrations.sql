-- ============================================================
-- MadadQR – Supabase Database Migrations
-- Run these in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ------------------------------------------------------------
-- 1. Create the 'branding' table
--    Stores organization/school branding info for co-branded QR.
--    Logo file is stored in Supabase Storage bucket 'logos'.
--    Only logo_path (filename) is stored here to save DB space.
--    Naming convention for logos: org-{slug}-{timestamp}.{ext}
--      e.g. org-abc-school-1712345678.png
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branding (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        REFERENCES users(id) ON DELETE CASCADE,
  organization_name TEXT       NOT NULL,
  branding_type    TEXT,                          -- School | Business | Fleet | Other
  logo_path        TEXT,                          -- filename only: org-{slug}-{ts}.ext
  logo_url         TEXT,                          -- full public URL from Supabase Storage
  tagline          TEXT,
  ad_text          TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE branding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read branding"     ON branding FOR SELECT USING (true);
CREATE POLICY "Public insert branding"   ON branding FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update branding"   ON branding FOR UPDATE USING (true);

-- ------------------------------------------------------------
-- 2. Add branding & user_type columns to 'vehicles' table
-- ------------------------------------------------------------
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS user_type   TEXT DEFAULT 'individual',   -- individual | branding
  ADD COLUMN IF NOT EXISTS branding_id UUID REFERENCES branding(id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- 3. Create Supabase Storage Bucket for logos
--    Do this in: Supabase Dashboard → Storage → New Bucket
--    Name: logos
--    Public: true (so logos can be served as public URLs)
--    File size limit: 2MB recommended
--    Allowed MIME types: image/png, image/jpeg, image/webp, image/gif
-- ------------------------------------------------------------
-- (Storage buckets cannot be created via SQL — use the Dashboard or CLI)

-- ------------------------------------------------------------
-- 4. Storage Policy for logos bucket (run after creating bucket)
-- ------------------------------------------------------------
-- CREATE POLICY "Public logo access"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'logos');

-- CREATE POLICY "Authenticated logo upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'logos');
