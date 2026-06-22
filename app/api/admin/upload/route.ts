import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { jsonOk, jsonError } from '@/lib/api-helpers';

// 50 MB for images, 5 GB for videos/PDFs — enforced at bucket level too
const MAX_BYTES = 5 * 1024 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  // images
  'image/jpeg': 'media',
  'image/png':  'media',
  'image/webp': 'media',
  'image/gif':  'media',
  'image/svg+xml': 'media',
  // documents
  'application/pdf': 'course-content',
  // video
  'video/mp4':       'course-content',
  'video/webm':      'course-content',
  'video/quicktime': 'course-content',
};

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData().catch(() => null);
  if (!formData) return jsonError('Expected multipart/form-data.');

  const file   = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string | null) ?? '';

  if (!file || file.size === 0) return jsonError('No file provided.');
  if (file.size > MAX_BYTES)    return jsonError('File exceeds 5 GB limit.');

  const bucket = ALLOWED_TYPES[file.type];
  if (!bucket) return jsonError(`File type "${file.type}" is not allowed.`);

  // Build a unique, collision-proof storage path
  const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '-').toLowerCase();
  const path     = [folder, `${Date.now()}-${safeName}`].filter(Boolean).join('/');

  const admin = createAdminClient();
  const bytes = await file.arrayBuffer();

  const { data, error: storageErr } = await admin.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (storageErr) return jsonError(storageErr.message);

  // Public URL for media bucket; signed URL (1 year) for course-content
  let url: string;
  if (bucket === 'media') {
    const { data: pub } = admin.storage.from(bucket).getPublicUrl(data.path);
    url = pub.publicUrl;
  } else {
    const { data: signed, error: signErr } = await admin.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 year
    if (signErr || !signed) return jsonError('Uploaded but failed to create signed URL.');
    url = signed.signedUrl;
  }

  return jsonOk({ url, path: data.path, bucket, size: file.size, type: file.type });
}
