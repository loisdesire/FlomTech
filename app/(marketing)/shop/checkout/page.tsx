import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <>
      <section style={{ background: 'var(--fd-bg-alt)', borderBottom: '1px solid var(--fd-border)', padding: '48px 0' }}>
        <div className="fd-container">
          <h1 className="fd-section-title" style={{ textAlign: 'left', marginBottom: 0 }}>Checkout</h1>
        </div>
      </section>
      <section className="fd-section">
        <div className="fd-container">
          <div className="fd-coming-soon">
            <CreditCard size={48} color="var(--fd-orange)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h2>Checkout coming soon</h2>
            <p>Our payment system is being set up. <Link href="/contact" style={{ color: 'var(--fd-orange)', fontWeight: 600 }}>Contact us</Link> to pre-order.</p>
            <Link href="/shop" className="fd-btn fd-btn-outline fd-btn-sm" style={{ marginTop: 20, display: 'inline-flex' }}>
              Back to Shop <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
