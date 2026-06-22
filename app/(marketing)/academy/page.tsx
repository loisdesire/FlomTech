import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Academy',
  description: 'Practical importation education and business courses from Flom Digital. Learn to import, sell, and profit.',
};

const WHY = [
  'Practical, not theoretical — built by someone who actually does this',
  'Nigeria and Africa-focused importation strategies',
  'Step-by-step frameworks you can apply immediately',
  'Lifetime access to all purchased content',
];

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

export default async function AcademyPage() {
  const admin = createAdminClient();
  const { data: products } = await admin
    .from('platform_products')
    .select('id, slug, title, description, type, price_usd, cover_url')
    .eq('is_active', true)
    .in('section', ['academy', 'both'])
    .order('sort_order', { ascending: true });

  const items: Product[] = products ?? [];

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--fd-navy)', color: '#fff', padding: '80px 0 64px' }}>
        <div className="fd-container">
          <div className="fd-section-label" style={{ color: 'var(--fd-orange)' }}>Flom Academy</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-.03em', margin: '14px 0 18px', maxWidth: 640 }}>
            Learn the business of importation
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', maxWidth: 520, lineHeight: 1.75, margin: '0 0 32px' }}>
            Courses and guides built for Nigerian and African entrepreneurs who want real, actionable knowledge on importation, trade, and business growth.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#products" className="fd-btn fd-btn-primary">Browse Products <ArrowRight size={14} /></a>
            <Link href="/resources" className="fd-btn fd-btn-outline-white">Free Resources</Link>
          </div>
        </div>
      </section>

      {/* Why */}
      <section style={{ background: 'var(--fd-bg-alt)', borderBottom: '1px solid var(--fd-border)', padding: '40px 0' }}>
        <div className="fd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {WHY.map(point => (
              <div key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle size={17} color="var(--fd-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: 'var(--fd-navy)', lineHeight: 1.6 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="fd-section">
        <div className="fd-container">
          <div className="fd-section-label">Available Now</div>
          <h2 className="fd-section-title">Courses &amp; guides</h2>

          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--fd-muted)', fontSize: 15 }}>
              Products coming soon — check back shortly.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28, maxWidth: 960, margin: '0 auto' }}>
              {items.map(p => {
                const badge = TYPE_BADGE[p.type] ?? { label: p.type, color: '#f97316' };
                const intro = (p.description ?? '').split('\n')[0];
                return (
                  <Link
                    key={p.id}
                    href={`/academy/${p.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="fd-product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
                      {/* Cover */}
                      <div className="fd-product-img" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: 160 }}>
                        {p.cover_url ? (
                          <img
                            src={p.cover_url}
                            alt={p.title}
                            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: 160, background: 'var(--fd-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 36 }}>📦</span>
                          </div>
                        )}
                        <span
                          className="fd-product-badge"
                          style={{ position: 'absolute', top: 12, left: 12, background: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="fd-product-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h2 className="fd-product-title">{p.title}</h2>
                        {intro && <p className="fd-product-desc">{intro}</p>}
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
                          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--fd-navy)' }}>
                            {p.price_usd === 0 ? 'Free' : `$${p.price_usd}`}
                          </span>
                          <span className="fd-btn fd-btn-primary fd-btn-sm" style={{ pointerEvents: 'none' }}>
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

      {/* Coming soon */}
      <section className="fd-section" style={{ background: 'var(--fd-bg-alt)', borderTop: '1px solid var(--fd-border)' }}>
        <div className="fd-container" style={{ textAlign: 'center' }}>
          <div className="fd-section-label">Coming Soon</div>
          <h2 className="fd-section-title">More courses on the way</h2>
          <p style={{ color: 'var(--fd-muted)', fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Business startup guides, marketing strategy, AI for business, and financial literacy courses are in development.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="fd-btn fd-btn-primary">Join the waiting list <ArrowRight size={14} /></Link>
            <Link href="/blog" className="fd-btn fd-btn-outline">Read free articles</Link>
          </div>
        </div>
      </section>

      {/* Business tools CTA */}
      <section className="fd-section">
        <div className="fd-container">
          <div style={{ background: 'var(--fd-navy)', borderRadius: 16, padding: '48px 40px', display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Clock size={16} color="var(--fd-orange)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fd-orange)', textTransform: 'uppercase', letterSpacing: '.08em' }}>While you learn</span>
              </div>
              <h3 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
                Use our business tools for free
              </h3>
              <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, margin: 0, lineHeight: 1.7, maxWidth: 400 }}>
                The Landed Cost Calculator, Invoice Generator, and Currency Converter are available to use right now.
              </p>
            </div>
            <Link href="/business-tools" className="fd-btn fd-btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Explore Tools <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
