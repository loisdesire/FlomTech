import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { FileText, Package, MessageSquare, ArrowRight, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

async function getStats() {
  const admin = createAdminClient();
  const [posts, products, enquiries] = await Promise.all([
    admin.from('blog_posts').select('id, title, status'),
    admin.from('platform_products').select('id, title, is_active'),
    admin.from('service_enquiries').select('status'),
  ]);

  const postRows      = (posts.data      ?? []) as { id: string; title: string; status: string }[];
  const productRows   = (products.data   ?? []) as { id: string; title: string; is_active: boolean }[];
  const enquiryRows   = (enquiries.data  ?? []) as { status: string }[];

  return {
    posts:      { total: postRows.length, published: postRows.filter(p => p.status === 'published').length, drafts: postRows.filter(p => p.status === 'draft').length, draftList: postRows.filter(p => p.status === 'draft').slice(0, 4) },
    products:   { total: productRows.length, active: productRows.filter(p => p.is_active).length, inactiveCount: productRows.filter(p => !p.is_active).length },
    enquiries:  { total: enquiryRows.length, newCount: enquiryRows.filter(e => e.status === 'new').length },
  };
}

async function getRecentEnquiries() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('service_enquiries')
    .select('id, name, email, service_type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  return (data ?? []) as { id: string; name: string; email: string; service_type: string; status: string; created_at: string }[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function AdminDashboard() {
  const [stats, recentEnquiries] = await Promise.all([getStats(), getRecentEnquiries()]);

  return (
    <>
      <div className="adm-topbar">
        <span className="adm-topbar-title">Dashboard</span>
        <span className="adm-topbar-meta">
          {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
        </span>
      </div>

      <div className="adm-page">
        {/* Stats */}
        <div className="adm-stat-grid">
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><FileText size={16} /></div>
            <div className="adm-stat-value">{stats.posts.total}</div>
            <div className="adm-stat-label">Blog Posts</div>
            <div className="adm-stat-sub">{stats.posts.published} published · {stats.posts.drafts} drafts</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}><Package size={16} /></div>
            <div className="adm-stat-value">{stats.products.active}</div>
            <div className="adm-stat-label">Active Products</div>
            <div className="adm-stat-sub">{stats.products.total} total</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: stats.enquiries.newCount > 0 ? '#fef3c7' : '#f3f4f6', color: stats.enquiries.newCount > 0 ? '#b45309' : '#9ca3af' }}>
              <MessageSquare size={16} />
            </div>
            <div className="adm-stat-value" style={{ color: stats.enquiries.newCount > 0 ? '#b45309' : undefined }}>
              {stats.enquiries.newCount}
            </div>
            <div className="adm-stat-label">New Enquiries</div>
            <div className="adm-stat-sub">{stats.enquiries.total} total</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><TrendingUp size={16} /></div>
            <div className="adm-stat-value" style={{ color: '#16a34a' }}>—</div>
            <div className="adm-stat-label">Revenue</div>
            <div className="adm-stat-sub">Stripe not connected</div>
          </div>
        </div>

        {/* Needs attention */}
        <div className="adm-card">
          <div className="adm-card-title">Needs attention</div>
          {stats.posts.drafts === 0 && stats.products.inactiveCount === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontSize: 13 }}>
              <CheckCircle size={15} /> Everything is published and active — nothing to action.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {stats.posts.drafts > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 8 }}>
                    <AlertCircle size={13} /> {stats.posts.drafts} unpublished {stats.posts.drafts === 1 ? 'post' : 'posts'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {stats.posts.draftList.map(p => (
                      <Link key={p.id} href={`/admin/blog/${p.id}`} style={{ fontSize: 13, color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#fef3c7', borderRadius: 6 }}>
                        <span>{p.title}</span>
                        <span style={{ fontSize: 11, color: '#b45309', fontWeight: 600 }}>Publish →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {stats.products.inactiveCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#fee2e2', borderRadius: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#b91c1c' }}>
                    <AlertCircle size={13} /> {stats.products.inactiveCount} inactive {stats.products.inactiveCount === 1 ? 'product' : 'products'} hidden from the site
                  </div>
                  <Link href="/admin/products" style={{ fontSize: 11, fontWeight: 600, color: '#b91c1c', textDecoration: 'none' }}>Review →</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent enquiries */}
        <div className="adm-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="adm-card-title" style={{ margin: 0 }}>Recent enquiries</div>
            <Link href="/admin/enquiries" className="adm-btn adm-btn-ghost adm-btn-sm">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <div className="adm-empty">
              <MessageSquare size={32} className="adm-empty-icon" />
              <p>No enquiries yet</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div className="adm-table-title">{e.name}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{e.email}</div>
                      </td>
                      <td style={{ color: '#6b7280' }}>{e.service_type || 'General'}</td>
                      <td><span className={`adm-badge adm-badge-${e.status}`}>{e.status}</span></td>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9ca3af', fontSize: 12 }}>
                        <Clock size={12} />{timeAgo(e.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
