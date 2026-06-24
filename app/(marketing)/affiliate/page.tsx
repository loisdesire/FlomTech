import type { Metadata } from 'next';
import { ExternalLink, Wrench, Ship, Cpu, Megaphone, Globe, DollarSign } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Affiliate Picks — Tools We Recommend',
  description: 'Curated tools and platforms recommended by Flom Digital for importers, entrepreneurs, and business builders.',
  openGraph: {
    title: 'Affiliate Picks — Tools We Recommend | Flom Digital',
    description: 'Curated tools and platforms recommended by Flom Digital for importers, entrepreneurs, and business builders.',
  },
};

type AffiliateLink = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: string;
  featured: boolean;
};

const SECTIONS = [
  { id: 'business',    Icon: Wrench,     title: 'Business Tools',        desc: 'Run your operations efficiently.' },
  { id: 'importation', Icon: Ship,       title: 'Importation Platforms', desc: 'Source and import products safely.' },
  { id: 'ai',          Icon: Cpu,        title: 'AI Tools',              desc: 'Work smarter, not harder.' },
  { id: 'marketing',   Icon: Megaphone,  title: 'Marketing',             desc: 'Grow your audience and sales.' },
  { id: 'websites',    Icon: Globe,      title: 'Website Builders',      desc: 'Get your business online.' },
  { id: 'financial',   Icon: DollarSign, title: 'Financial Platforms',   desc: 'Get paid and pay suppliers.' },
];

export default async function AffiliatePage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('affiliate_links')
    .select('id, name, tagline, description, url, category, featured')
    .eq('is_active', true)
    .order('category')
    .order('sort_order');

  const tools: AffiliateLink[] = data ?? [];

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--fd-navy)', color: '#fff', padding: '72px 0 56px' }}>
        <div className="fd-container">
          <div className="fd-section-label" style={{ color: 'var(--fd-orange)', marginBottom: 14 }}>
            Recommended Tools
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-.03em', margin: '0 0 18px', maxWidth: 560, lineHeight: 1.12 }}>
            Tools and platforms we actually use
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', maxWidth: 520, lineHeight: 1.8, margin: '0 0 28px' }}>
            Every recommendation here is something we have personally used or thoroughly evaluated.
            Some links are affiliate links — we earn a small commission at no extra cost to you.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {SECTIONS.filter(s => tools.some(t => t.category === s.id)).map(s => (
              <a key={s.id} href={`#${s.id}`} style={{
                fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)',
                textDecoration: 'none', border: '1px solid rgba(255,255,255,.15)',
              }}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.map(({ id, Icon, title, desc }) => {
        const sectionTools = tools.filter(t => t.category === id);
        if (sectionTools.length === 0) return null;
        return (
          <section key={id} id={id} style={{ padding: '56px 0', borderBottom: '1px solid var(--fd-border)' }}>
            <div className="fd-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(255,107,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={22} color="var(--fd-orange)" />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--fd-navy)', margin: 0, letterSpacing: '-.02em' }}>{title}</h2>
                  <p style={{ fontSize: 13.5, color: 'var(--fd-muted)', margin: 0, marginTop: 3 }}>{desc}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
                {sectionTools.map(tool => (
                  <div key={tool.id} style={{
                    background: '#fff',
                    border: tool.featured ? '2px solid var(--fd-orange)' : '1.5px solid var(--fd-border)',
                    borderRadius: 14, padding: '22px 20px',
                    display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
                  }}>
                    {tool.featured && (
                      <span style={{
                        position: 'absolute', top: -1, right: 16,
                        fontSize: 10, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase',
                        background: 'var(--fd-orange)', color: '#fff',
                        padding: '3px 10px', borderRadius: '0 0 8px 8px',
                      }}>
                        Top Pick
                      </span>
                    )}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--fd-navy)' }}>{tool.name}</div>
                      {tool.tagline && <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fd-orange)', marginTop: 2 }}>{tool.tagline}</div>}
                    </div>
                    {tool.description && (
                      <p style={{ fontSize: 13.5, color: 'var(--fd-muted)', lineHeight: 1.7, margin: 0, flex: 1 }}>
                        {tool.description}
                      </p>
                    )}
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 13, fontWeight: 700, color: 'var(--fd-navy)',
                      textDecoration: 'none', marginTop: 4,
                      padding: '8px 14px', borderRadius: 8,
                      background: 'var(--fd-bg-alt)', border: '1.5px solid var(--fd-border)',
                      width: 'fit-content',
                    }}>
                      Visit {tool.name} <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Disclaimer */}
      <section style={{ padding: '32px 0 56px' }}>
        <div className="fd-container">
          <p style={{ fontSize: 12.5, color: 'var(--fd-muted)', textAlign: 'center', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Affiliate disclosure: Some links on this page may earn Flom Digital a commission if you sign up or make a purchase.
            This never affects our recommendations — we only list tools we genuinely believe in.
          </p>
        </div>
      </section>
    </>
  );
}
