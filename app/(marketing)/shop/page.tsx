import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Books, courses, and resources from Flom Digital, built for serious business builders.',
};

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  course:      { label: 'Course',      color: '#3B82F6' },
  guide:       { label: 'eBook',       color: '#f97316' },
  template:    { label: 'Template',    color: '#8B5CF6' },
  bundle:      { label: 'Bundle',      color: '#16A34A' },
  tool_access: { label: 'Tool Access', color: '#0EA5E9' },
};

type Product = {
  id: string; slug: string; title: string; description: string;
  type: string; price_usd: number; cover_url: string;
};

export default async function ShopPage() {
  const admin = createAdminClient();
  const { data: products } = await admin
    .from('platform_products')
    .select('id, slug, title, description, type, price_usd, cover_url')
    .eq('is_active', true)
    .in('section', ['shop', 'both'])
    .order('sort_order', { ascending: true });

  const items: Product[] = products ?? [];

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--fd-navy)', color: '#fff', padding: '72px 0 56px' }}>
        <div className="fd-container">
          <div className="fd-section-label">Shop</div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-.025em', margin: '12px 0 16px' }}>
            Invest in your business education
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', maxWidth: 500, lineHeight: 1.7, margin: '0 0 28px' }}>
            Every product here is designed to give you a real, practical advantage as a business builder.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="fd-section">
        <div className="fd-container">
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--fd-muted)', fontSize: 15 }}>
              Products coming soon — check back shortly.
            </p>
          ) : (
            <div className="fd-products-grid">
              {items.map(p => {
                const badge = TYPE_BADGE[p.type] ?? { label: p.type, color: '#f97316' };
                const intro = (p.description ?? '').split('\n')[0];
                return (
                  <Link
                    key={p.id}
                    href={`/academy/${p.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="fd-product-card" style={{ cursor: 'pointer' }}>
                      <div className="fd-product-img" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: 140 }}>
                        {p.cover_url ? (
                          <img
                            src={p.cover_url}
                            alt={p.title}
                            style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: 140, background: 'var(--fd-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 32 }}>📦</span>
                          </div>
                        )}
                        <span
                          className="fd-product-badge"
                          style={{ position: 'absolute', top: 10, left: 10, background: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="fd-product-body">
                        <h2 className="fd-product-title">{p.title}</h2>
                        {intro && <p className="fd-product-desc">{intro}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                          <span className="fd-product-price">
                            {p.price_usd === 0 ? 'Free' : `$${p.price_usd}`}
                          </span>
                          <span className="fd-btn fd-btn-outline fd-btn-sm" style={{ pointerEvents: 'none' }}>
                            View <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="fd-section" style={{ background: 'var(--fd-bg-alt)', borderTop: '1px solid var(--fd-border)' }}>
        <div className="fd-container" style={{ textAlign: 'center' }}>
          <Zap size={28} color="var(--fd-orange)" style={{ marginBottom: 12 }} />
          <h2 className="fd-section-title" style={{ marginBottom: 12 }}>More on the way</h2>
          <p style={{ color: 'var(--fd-muted)', fontSize: 15, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Templates, supplier lists, trackers, and more are being added regularly.
          </p>
          <Link href="/contact" className="fd-btn fd-btn-primary">Get notified <ArrowRight size={14} /></Link>
        </div>
      </section>
    </>
  );
}
