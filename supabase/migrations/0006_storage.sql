-- =============================================================
--  MarketGlide — Supabase Storage buckets
--  media:          public  — blog cover images, product thumbnails
--  course-content: private — course videos, PDFs, downloadable files
--                            served via signed URLs to authenticated members
-- =============================================================

-- Create buckets (idempotent — safe to re-run)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES
  ('media',          'media',          true,  52428800),    -- 50 MB per file
  ('course-content', 'course-content', false, 5368709120)   -- 5 GB per file
ON CONFLICT (id) DO NOTHING;


-- ── media (public read, admin-only write) ─────────────────────

-- Anyone can read public media
DROP POLICY IF EXISTS "media_public_read"   ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Only authenticated users can upload (admin check is done in the API route)
DROP POLICY IF EXISTS "media_admin_write"   ON storage.objects;
CREATE POLICY "media_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "media_admin_delete"  ON storage.objects;
CREATE POLICY "media_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');


-- ── course-content (private, signed-URL access) ───────────────

-- Authenticated users can read their own content (member portal will use signed URLs)
DROP POLICY IF EXISTS "course_authenticated_read" ON storage.objects;
CREATE POLICY "course_authenticated_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-content' AND auth.role() = 'authenticated');

-- Only authenticated users can upload
DROP POLICY IF EXISTS "course_admin_write"  ON storage.objects;
CREATE POLICY "course_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'course-content' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "course_admin_delete" ON storage.objects;
CREATE POLICY "course_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'course-content' AND auth.role() = 'authenticated');
