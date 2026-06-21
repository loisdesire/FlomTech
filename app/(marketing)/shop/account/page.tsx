import type { Metadata } from 'next';
import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'My Account' };

export default function AccountPage() {
  return (
    <>
      <section style={{ background: 'var(--fd-bg-alt)', borderBottom: '1px solid var(--fd-border)', padding: '48px 0' }}>
        <div className="fd-container">
          <h1 className="fd-section-title" style={{ textAlign: 'left', marginBottom: 0 }}>My Account</h1>
        </div>
      </section>
      <section className="fd-section">
        <div className="fd-container">
          <div className="fd-coming-soon">
            <User size={48} color="var(--fd-orange)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h2>Account portal coming soon</h2>
            <p>You'll be able to access your purchases and downloads here once accounts are live.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              <Link href="/shop" className="fd-btn fd-btn-primary fd-btn-sm">
                Browse Shop <ArrowRight size={14} />
              </Link>
              <Link href="/tracker/login" className="fd-btn fd-btn-outline fd-btn-sm">
                Tracker Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
