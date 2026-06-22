import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { marked } from 'marked';
import { createAdminClient } from '@/lib/supabase/admin';

type Props = { params: Promise<{ slug: string }> };

const CAT_LABEL: Record<string, string> = {
  importation:         'Importation',
  entrepreneurship:    'Entrepreneurship',
  'business-ideas':    'Business Ideas',
  'ai-automation':     'AI & Automation',
  marketing:           'Marketing',
  sales:               'Sales',
  'financial-literacy':'Financial Literacy',
  'wealth-building':   'Wealth Building',
  productivity:        'Productivity',
};

function fmt(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!data) return { title: 'Blog | Flom Digital' };
  return {
    title:       `${data.title} | Flom Digital`,
    description: data.excerpt ?? '',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: post } = await admin
    .from('blog_posts')
    .select('title, excerpt, content, cover_url, category, read_time_min, published_at, tags')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) notFound();

  const html = await marked(post.content ?? '', { breaks: true });

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: 'var(--fd-bg-alt)', borderBottom: '1px solid var(--fd-border)', padding: '48px 0 40px' }}>
        <div className="fd-container" style={{ maxWidth: 760 }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fd-muted)', textDecoration: 'none', marginBottom: 24 }}>
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fd-orange)', marginBottom: 14 }}>
            {CAT_LABEL[post.category] ?? post.category}
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 800, color: 'var(--fd-navy)', letterSpacing: '-.03em', margin: '0 0 16px', lineHeight: 1.2 }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ fontSize: 17, color: 'var(--fd-muted)', lineHeight: 1.7, margin: '0 0 20px' }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--fd-muted)' }}>
            <span>{fmt(post.published_at)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> {post.read_time_min} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── Cover image ── */}
      {post.cover_url && (
        <div style={{ background: 'var(--fd-bg-alt)', paddingBottom: 32 }}>
          <div className="fd-container" style={{ maxWidth: 760 }}>
            <img
              src={post.cover_url}
              alt={post.title}
              style={{ width: '100%', borderRadius: 14, objectFit: 'cover', maxHeight: 420, display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <section className="fd-section">
        <div className="fd-container" style={{ maxWidth: 760 }}>
          {post.content
            ? <div className="fd-prose" dangerouslySetInnerHTML={{ __html: html }} />
            : (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--fd-muted)' }}>
                <BookOpen size={36} style={{ marginBottom: 12 }} />
                <p>Content coming soon.</p>
              </div>
            )
          }

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--fd-border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {post.tags.map((t: string) => (
                <span key={t} style={{ fontSize: 12, fontWeight: 600, background: 'var(--fd-bg-alt)', border: '1px solid var(--fd-border)', borderRadius: 6, padding: '4px 10px', color: 'var(--fd-muted)' }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Footer nav */}
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fd-muted)', textDecoration: 'none', fontWeight: 600 }}>
              <ArrowLeft size={14} /> All articles
            </Link>
            <Link href="/academy" className="fd-btn fd-btn-primary fd-btn-sm">
              Explore courses &amp; guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
