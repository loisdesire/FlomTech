import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Zap, Package } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Books, courses, and resources from Flom Digital, built for serious business builders.',
};

const TYPE_COLORS: Record<string, string> = {
  course:      'linear-gradient(150deg,#1d3060 0%,#3B82F6 55%,#1e293b 100%)',
  guide:       'linear-gradient(150deg,#0F172A 0%,#1e3660 55%,#0F172A 100%)',
  template:    'linear-gradient(150deg,#2d1b69 0%,#7c3aed 55%,#1e1b4b 100%)',
  bundle:      'linear-gradient(150deg,#064e3b 0%,#0f172a 60%,#1a2e22 100%)',
  tool_access: 'linear-gradient(150deg,#0c4a6e 0%,#0369a1 55%,#0f172a 100%)',
};

const TYPE_LABEL: Record<string, string> = {
  course: 'Course', guide: 'eBook / Guide', template: 'Template',
  bundle: 'Bundle', tool_access: 'Tool Access',
};

type Product = {
  id: string; slug: string; title: string; description: string;
  type: string; price_usd: number; cover_url: string;
};

export default async function ShopPage() {
  const admin = createAdminClient();
  const { data: products } = await admin
    .from('platform_products')
    .select('id,slug,title,description,type,price_usd,cover_url')
    .eq('is_active', true)
    .in('section', ['shop', 'both'])
    .order('sort_order', { ascending: true });

  const items: Product[] = products ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="fd-hero">
        <div className="fd-hero-inner">
          <div>
            <span className="fd-hero-eyebrow">Flom Shop</span>
            <h1 className="fd-hero-headline">
              Invest in your<br />
              <span className="accent">business education.</span>
            </h1>
            <p className="fd-hero-sub">
              Every product here is designed to give you a real, practical advantage as a
              business builder. No fluff — just what works.
            </p>
            <div className="fd-hero-ctas">
              <a href="#products" className="fd-btn fd-btn-primary">Shop Now <ArrowRight size={16} /></a>
              <Link href="/academy" className="fd-btn fd-btn-outline-white">View Academy</Link>
            </div>
          </div>

          <div className="fd-hero-visual">
            <div className="fd-hero-visual-inner">
              <div className="fd-hero-card">
                <div className="fd-hero-card-icon"><ShoppingBag size={20} color="#fff" /></div>
                <div>
                  <div className="fd-hero-card-title">Instant digital delivery</div>
                  <div className="fd-hero-card-sub">Download immediately after purchase</div>
                </div>
              </div>
              <div className="fd-hero-card">
                <div className="fd-hero-card-icon" style={{ background: '#7c3aed' }}>
                  <Package size={20} color="#fff" />
                </div>
                <div>
                  <div className="fd-hero-card-title">Lifetime access</div>
                  <div className="fd-hero-card-sub">Buy once, access forever</div>
                </div>
              </div>
              <div className="fd-hero-stat-row">
                <div className="fd-hero-stat">
                  <div className="fd-hero-stat-val"><Zap size={16} color="#f97316" fill="#f97316" /></div>
                  <div className="fd-hero-stat-lbl">Instant</div>
                </div>
                <div className="fd-hero-stat">
                  <div className="fd-hero-stat-val">∞</div>
                  <div className="fd-hero-stat-lbl">Access</div>
                </div>
                <div className="fd-hero-stat">
                  <div className="fd-hero-stat-val">{items.length || '—'}</div>
                  <div className="fd-hero-stat-lbl">Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" className="fd-section">
        <div className="fd-container">
          <div className="fd-section-label">In Stock</div>
          <h2 className="fd-section-title" style={{ textAlign: 'left', marginBottom: 36 }}>All products</h2>

          {items.length === 0 ? (
            <p style={{ color: 'var(--fd-muted)', fontSize: 15 }}>Products coming soon — check back shortly.</p>
          ) : (
            <div className="fd-products-grid">
              {items.map(p => {
                const typeLabel = TYPE_LABEL[p.type] ?? p.type;
                const bg = TYPE_COLORS[p.type] ?? TYPE_COLORS.guide;
                const intro = (p.description ?? '').split('\n')[0];
                return (
                  <Link key={p.id} href={`/academy/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="fd-product-card">
                      <div
                        className="fd-product-cover"
                        style={{ background: p.cover_url ? undefined : bg, padding: 0 }}
                      >
                        {p.cover_url ? (
                          <img
                            src={p.cover_url}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
                          />
                        ) : (
                          <>
                            <div className="fd-product-cover-accent" />
                            <div className="fd-product-cover-label">{typeLabel}</div>
                            <div className="fd-product-cover-title">{p.title}</div>
                          </>
                        )}
                        <span className="fd-product-cover-badge">{typeLabel}</span>
                      </div>

                      <div className="fd-product-body">
                        <h3 className="fd-product-title">{p.title}</h3>
                        {intro && <p className="fd-product-desc">{intro}</p>}
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="fd-product-price" style={{ margin: 0 }}>
                            {p.price_usd === 0 ? 'Free' : `$${p.price_usd}`}
                          </span>
                          <span className="fd-btn fd-btn-primary fd-btn-sm" style={{ pointerEvents: 'none' }}>
                            Buy <ArrowRight size={13} />
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

      {/* ── Bottom CTA ── */}
      <section className="fd-section" style={{ background: 'var(--fd-bg-alt)', borderTop: '1px solid var(--fd-border)' }}>
        <div className="fd-container" style={{ textAlign: 'center' }}>
          <div className="fd-section-label">Coming Soon</div>
          <h2 className="fd-section-title">More products on the way</h2>
          <p style={{ color: 'var(--fd-muted)', fontSize: 15, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Templates, supplier lists, trackers, and more are being added regularly.
          </p>
          <Link href="/contact" className="fd-btn fd-btn-primary">Get notified <ArrowRight size={14} /></Link>
        </div>
      </section>
    </>
  );
}
