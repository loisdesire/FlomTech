import { getSessionUserWithRole, jsonOk, jsonError } from '@/lib/api-helpers';
import { createAdminClient } from '@/lib/supabase/admin';

const VALID_ROLES = ['Administrator', 'Manager', 'Sales Staff', 'Warehouse Staff'];

export async function POST(request: Request) {
  const session = await getSessionUserWithRole();
  if (!session) return jsonError('Unauthorized', 401);
  if (session.role !== 'Administrator') return jsonError('Forbidden — Administrators only.', 403);

  const { email, full_name, role } = await request.json();
  if (!email)                       return jsonError('Email is required.');
  if (!VALID_ROLES.includes(role))  return jsonError('Invalid role.');

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: full_name ?? '', role },
  });
  if (error) return jsonError(error.message);

  // Upsert profile — trigger may have already run, this ensures the role is correct
  await admin.from('user_profiles').upsert(
    { id: data.user.id, full_name: full_name ?? '', role },
    { onConflict: 'id' },
  );

  return jsonOk({ id: data.user.id, email: data.user.email });
}
