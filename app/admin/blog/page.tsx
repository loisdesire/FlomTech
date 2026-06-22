'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

type Post = {
  id: string; slug: string; title: string; category: string;
  status: string; read_time_min: number; published_at: string | null; created_at: string;
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminBlogPage() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);
  const [msg, setMsg]         = useState('');

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(d => { setPosts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function toggleStatus(id: string, current: string) {
    setSaving(id);
    const next = current === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: next, published_at: next === 'published' ? new Date().toISOString() : p.published_at } : p));
      setMsg(`Post ${next === 'published' ? 'published' : 'unpublished'}.`);
      setTimeout(() => setMsg(''), 3000);
    }
    setSaving(null);
  }

  return (
    <>
      <div className="adm-topbar">
        <span className="adm-topbar-title">Blog Posts</span>
        <Link href="/admin/blog/new" className="adm-btn adm-btn-primary adm-btn-sm">
          <Plus size={14} /> New Post
        </Link>
      </div>

      <div className="adm-page">
        {msg && <div className="adm-alert adm-alert-success">{msg}</div>}

        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="adm-empty"><p>Loading...</p></div>
          ) : posts.length === 0 ? (
            <div className="adm-empty">
              <FileText size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: .3 }} />
              <p style={{ margin: '0 0 16px' }}>No blog posts yet</p>
              <Link href="/admin/blog/new" className="adm-btn adm-btn-primary">
                <Plus size={14} /> Write your first post
              </Link>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Read time</th>
                    <th>Published</th>
                    <th>Toggle</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td>
                        <div className="adm-table-title">{post.title}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{post.slug}</div>
                      </td>
                      <td style={{ color: '#6b7280', textTransform: 'capitalize' }}>{post.category.replace(/-/g, ' ')}</td>
                      <td><span className={`adm-badge adm-badge-${post.status}`}>{post.status}</span></td>
                      <td style={{ color: '#6b7280' }}>{post.read_time_min} min</td>
                      <td style={{ color: '#6b7280', fontSize: 12 }}>{fmtDate(post.published_at)}</td>
                      <td>
                        <button
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                          disabled={saving === post.id}
                          onClick={() => toggleStatus(post.id, post.status)}
                          title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {post.status === 'published'
                            ? <ToggleRight size={20} color="#15803d" />
                            : <ToggleLeft  size={20} color="#9ca3af" />}
                        </button>
                      </td>
                      <td>
                        <Link href={`/admin/blog/${post.id}`} className="adm-btn adm-btn-ghost adm-btn-sm">
                          <Edit size={13} /> Edit
                        </Link>
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
