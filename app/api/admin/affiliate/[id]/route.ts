import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { jsonOk, jsonError } from '@/lib/api-helpers';

type Params = { params: Promise<{ id: string }> };

const ALLOWED = ['name','tagline','description','url','category','featured','is_active','sort_order'];

export async function PATCH(req: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json() as Record<string, unknown>;
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED.includes(k)));

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from('affiliate_links')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (dbErr) return jsonError(dbErr.message);
  return jsonOk(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const admin = createAdminClient();
  const { error: dbErr } = await admin.from('affiliate_links').delete().eq('id', id);

  if (dbErr) return jsonError(dbErr.message);
  return jsonOk({ deleted: true });
}
