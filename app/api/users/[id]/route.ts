import { getSessionUserWithRole, jsonOk, jsonError } from '@/lib/api-helpers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUserWithRole();
  if (!session) return jsonError('Unauthorized', 401);
  if (session.role !== 'Administrator') return jsonError('Forbidden — Administrators only.', 403);

  const { id } = await params;

  if (id === session.userId) return jsonError('You cannot remove your own account.');

  const admin = createAdminClient();

  // Guard: cannot remove the last Administrator
  const { data: target } = await admin.from('user_profiles').select('role').eq('id', id).single();
  if (target?.role === 'Administrator') {
    const { count } = await admin.from('user_profiles').select('id', { count: 'exact', head: true }).eq('role', 'Administrator');
    if ((count ?? 0) <= 1) return jsonError('Cannot remove the last Administrator.');
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return jsonError(error.message);

  return jsonOk({ success: true });
}
