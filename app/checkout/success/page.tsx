import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutSuccess() {
  return (
    <>
      <Link href="/" style={{ marginBottom: 28, textDecoration: 'none' }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--fd-navy)', letterSpacing: '-.04em' }}>
          flom<span style={{ color: 'var(--fd-orange)' }}>digital</span>
        </span>
      </Link>

      <div style={{
        background: '#fff',
        border: '1.5px solid var(--fd-border)',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,0,0,.06)',
        textAlign: 'center',
      }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={32} color="#16a34a" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--fd-navy)', margin: '0 0 12px', letterSpacing: '-.03em' }}>
          Payment confirmed!
        </h1>

        <p style={{ fontSize: 14, color: 'var(--fd-muted)', lineHeight: 1.75, margin: '0 0 32px' }}>
          Your purchase is complete. Head to your account to access your content — it&apos;s ready now.
        </p>

        <Link href="/members" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--fd-navy)', color: '#fff', fontWeight: 700,
          fontSize: 14, padding: '13px 24px', borderRadius: 10,
          textDecoration: 'none', marginBottom: 16,
        }}>
          Go to my account <ArrowRight size={15} />
        </Link>

        <div>
          <Link href="/academy" style={{ fontSize: 13, color: 'var(--fd-muted)', textDecoration: 'none' }}>
            Back to Academy
          </Link>
        </div>
      </div>
    </>
  );
}
