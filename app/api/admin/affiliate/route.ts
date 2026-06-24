import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { jsonOk, jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from('affiliate_links')
    .select('*')
    .order('category')
    .order('sort_order');

  if (dbErr) return jsonError(dbErr.message);
  return jsonOk(data ?? []);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json() as Record<string, unknown>;
  const { name, tagline, description, url, category, featured, is_active, sort_order } = body;

  if (!name || !url || !category) return jsonError('name, url and category are required.', 400);

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from('affiliate_links')
    .insert({ name, tagline, description, url, category, featured, is_active, sort_order })
    .select()
    .single();

  if (dbErr) return jsonError(dbErr.message);
  return jsonOk(data, 201);
}
