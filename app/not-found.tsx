import Link from 'next/link';
import './marketing.css';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '32px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: 'var(--fd-bg-alt)',
    }}>
      <Link href="/" style={{ textDecoration: 'none', marginBottom: 40 }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--fd-navy)', letterSpacing: '-.04em' }}>
          flom<span style={{ color: 'var(--fd-orange)' }}>digital</span>
        </span>
      </Link>

      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: 'var(--fd-navy)', lineHeight: 1, letterSpacing: '-.05em', marginBottom: 16 }}>
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fd-navy)', margin: '0 0 12px', letterSpacing: '-.03em' }}>
          Page not found
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--fd-muted)', lineHeight: 1.75, margin: '0 0 32px' }}>
          This page doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'var(--fd-navy)', color: '#fff', fontWeight: 700,
            fontSize: 14, padding: '11px 22px', borderRadius: 10, textDecoration: 'none',
          }}>
            Go home
          </Link>
          <Link href="/academy" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#fff', color: 'var(--fd-navy)', fontWeight: 700,
            fontSize: 14, padding: '11px 22px', borderRadius: 10, textDecoration: 'none',
            border: '1.5px solid var(--fd-border)',
          }}>
            Browse Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
