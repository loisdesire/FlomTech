'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSignOut() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <button
      onClick={signOut}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,.35)', fontSize: 12, padding: 0,
        marginTop: 10, transition: 'color .15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#f97316')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
    >
      <LogOut size={12} /> Sign out
    </button>
  );
}
