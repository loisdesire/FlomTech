'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr || !data.user) {
      setError(authErr?.message ?? 'Invalid email or password.');
      setLoading(false);
      return;
    }

    // Route based on who signed in
    const isAdmin = data.user.email === process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAIL;
    router.push(isAdmin ? '/admin' : '/tracker/dashboard');
    router.refresh();
  }

  return (
    <>
      {/* Brand */}
      <Link href="/" style={{ marginBottom: 28, textDecoration: 'none' }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--fd-navy)', letterSpacing: '-.04em' }}>
          flom<span style={{ color: 'var(--fd-orange)' }}>digital</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{
        background: '#fff',
        border: '1.5px solid var(--fd-border)',
        borderRadius: 16,
        padding: '36px 32px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,0,0,.06)',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fd-navy)', margin: '0 0 6px', letterSpacing: '-.03em' }}>
          Sign in
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--fd-muted)', margin: '0 0 28px' }}>
          Access your dashboard, courses, and tools.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#b91c1c', marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--fd-navy)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--fd-border)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: 'var(--fd-navy)' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fd-navy)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 42px 10px 14px', border: '1.5px solid var(--fd-border)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: 'var(--fd-navy)' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fd-muted)', padding: 0, display: 'flex' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="fd-btn fd-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, fontWeight: 700, opacity: loading ? .7 : 1 }}
          >
            <LogIn size={16} />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: 13, color: 'var(--fd-muted)' }}>
          Want to track your business?{' '}
          <Link href="/tracker/register" style={{ color: 'var(--fd-orange)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: 'var(--fd-muted)' }}>
        <Link href="/" style={{ color: 'var(--fd-muted)', textDecoration: 'none' }}>← Back to site</Link>
      </p>
    </>
  );
}
