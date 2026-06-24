'use client';

import { useEffect, useState } from 'react';
import { Users, Mail } from 'lucide-react';

type Subscriber = {
  id: string;
  email: string;
  first_name: string;
  source: string;
  subscribed_at: string;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const SOURCE_LABEL: Record<string, string> = {
  homepage:  'Homepage',
  resources: 'Resources',
  blog:      'Blog',
  academy:   'Academy',
  contact:   'Contact',
  manual:    'Manual',
};

export default function SubscribersPage() {
  const [subs,    setSubs]    = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState('');

  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then(r => r.json())
      .then((d: Subscriber[]) => { setSubs(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = query.trim()
    ? subs.filter(s => s.email.toLowerCase().includes(query.toLowerCase()) || s.first_name.toLowerCase().includes(query.toLowerCase()))
    : subs;

  return (
    <>
      <div className="adm-topbar">
        <span className="adm-topbar-title">Subscribers</span>
        {subs.length > 0 && (
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            <strong style={{ color: 'var(--adm-text)' }}>{subs.length}</strong> active subscribers
          </span>
        )}
      </div>

      <div className="adm-page">
        {subs.length > 5 && (
          <div style={{ marginBottom: 16 }}>
            <input
              type="search"
              placeholder="Search by email or name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="adm-input"
              style={{ maxWidth: 320 }}
            />
          </div>
        )}

        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="adm-empty"><p>Loading…</p></div>
          ) : subs.length === 0 ? (
            <div className="adm-empty">
              <Users size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: .3 }} />
              <p>No subscribers yet. The newsletter strip in the footer and resources page collect them.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Source</th>
                    <th>Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <a href={`mailto:${s.email}`} style={{ color: 'var(--adm-text)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Mail size={13} style={{ opacity: .4 }} />
                          {s.email}
                        </a>
                      </td>
                      <td style={{ color: '#6b7280' }}>{s.first_name || '—'}</td>
                      <td>
                        <span style={{
                          fontSize: 11, fontWeight: 700, borderRadius: 5, padding: '2px 8px',
                          background: '#f0f4ff', color: '#3b4fe4',
                        }}>
                          {SOURCE_LABEL[s.source] ?? s.source}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{fmt(s.subscribed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && query && (
                <div className="adm-empty"><p>No results for &ldquo;{query}&rdquo;</p></div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
