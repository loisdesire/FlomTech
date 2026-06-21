import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Cart' };

export default function CartPage() {
  return (
    <>
      <section style={{ background: 'var(--fd-bg-alt)', borderBottom: '1px solid var(--fd-border)', padding: '48px 0' }}>
        <div className="fd-container">
          <h1 className="fd-section-title" style={{ textAlign: 'left', marginBottom: 0 }}>Your Cart</h1>
        </div>
      </section>
      <section className="fd-section">
        <div className="fd-container">
          <div className="fd-coming-soon">
            <ShoppingCart size={48} color="var(--fd-orange)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h2>Your cart is empty</h2>
            <p>Browse our products and add something you like.</p>
            <Link href="/shop" className="fd-btn fd-btn-primary fd-btn-sm" style={{ marginTop: 20, display: 'inline-flex' }}>
              Go to Shop <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
