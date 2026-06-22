import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { jsonOk, jsonError } from '@/lib/api-helpers';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from('platform_products')
    .select('*')
    .eq('id', id)
    .single();

  if (dbErr) return jsonError(dbErr.message, 404);
  return jsonOk(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;

  const ALLOWED = new Set(['slug','title','description','type','category','price_usd','stripe_price_id','cover_url','file_url','is_active','sort_order']);
  const safeBody = Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED.has(k)));
  if (!Object.keys(safeBody).length) return jsonError('No valid fields to update.');

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from('platform_products')
    .update(safeBody)
    .eq('id', id)
    .select()
    .single();

  if (dbErr) return jsonError(dbErr.message);
  return jsonOk(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const admin = createAdminClient();
  const { error: dbErr } = await admin.from('platform_products').delete().eq('id', id);
  if (dbErr) return jsonError(dbErr.message);
  return jsonOk({ success: true });
}
