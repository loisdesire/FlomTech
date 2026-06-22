import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const body = await request.json() as {
    first_name: string;
    last_name:  string;
    email:      string;
    subject:    string;
    message:    string;
    phone?:     string;
  };

  const { first_name, last_name, email, subject, message, phone } = body;

  if (!email?.trim() || !message?.trim()) {
    return Response.json({ error: 'Email and message are required.' }, { status: 400 });
  }

  const name = [first_name, last_name].filter(Boolean).join(' ').trim() || 'Unknown';

  const admin = createAdminClient();
  const { error } = await admin.from('service_enquiries').insert({
    name,
    email:        email.trim(),
    phone:        phone?.trim() ?? '',
    service_type: subject ?? 'general',
    message:      message.trim(),
    status:       'new',
  });

  if (error) {
    console.error('enquiry insert failed:', error.message);
    return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
