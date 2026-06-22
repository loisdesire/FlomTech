import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { jsonOk, jsonError } from '@/lib/api-helpers';

const MAX_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB hard cap

// Dangerous executable types that should never be stored
const BLOCKED = new Set([
  'application/x-msdownload', 'application/x-executable',
  'application/x-sh', 'application/x-bat',
  'application/x-msdos-program',
]);

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData().catch(() => null);
  if (!formData) return jsonError('Expected multipart/form-data.');

  const file   = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string | null) ?? '';

  if (!file || file.size === 0) return jsonError('No file provided.');
  if (file.size > MAX_BYTES)    return jsonError('File exceeds the 5 GB limit.');
  if (BLOCKED.has(file.type))   return jsonError('This file type is not allowed.');

  // Images go to the public media bucket; everything else is private course-content
  const isImage = file.type.startsWith('image/');
  const bucket  = isImage ? 'media' : 'course-content';

  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '-').toLowerCase();
  const path     = [folder, `${Date.now()}-${safeName}`].filter(Boolean).join('/');

  const admin = createAdminClient();
  const bytes = await file.arrayBuffer();

  const { data, error: storageErr } = await admin.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (storageErr) return jsonError(storageErr.message);

  let url: string;
  if (bucket === 'media') {
    const { data: pub } = admin.storage.from(bucket).getPublicUrl(data.path);
    url = pub.publicUrl;
  } else {
    const { data: signed, error: signErr } = await admin.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365);
    if (signErr || !signed) return jsonError('Uploaded but could not create signed URL.');
    url = signed.signedUrl;
  }

  return jsonOk({ url, path: data.path, bucket, size: file.size, type: file.type });
}
