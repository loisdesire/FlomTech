'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Link2 } from 'lucide-react';

type Link = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: string;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
};

const CATEGORIES = [
  { value: 'business',    label: 'Business Tools' },
  { value: 'importation', label: 'Importation Platforms' },
  { value: 'ai',          label: 'AI Tools' },
  { value: 'marketing',   label: 'Marketing' },
  { value: 'websites',    label: 'Website Builders' },
  { value: 'financial',   label: 'Financial Platforms' },
];

const BLANK: Omit<Link, 'id'> = {
  name: '', tagline: '', description: '', url: '',
  category: 'business', featured: false, is_active: true, sort_order: 0,
};

const CAT_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map(c => [c.value, c.label]));

export default function AffiliateAdminPage() {
  const [links,   setLinks]   = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Link | null>(null);
  const [form,    setForm]    = useState<Omit<Link,'id'>>(BLANK);
  const [saving,  setSaving]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [err,     setErr]     = useState('');

  async function load() {
    const res = await fetch('/api/admin/affiliate');
    const d = await res.json() as { data?: Link[] };
    setLinks(d.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(BLANK); setErr(''); setShowForm(true); }

  function openEdit(l: Link) {
    setEditing(l);
    setShowForm(true);
    setForm({ name: l.name, tagline: l.tagline, description: l.description, url: l.url,
      category: l.category, featured: l.featured, is_active: l.is_active, sort_order: l.sort_order });
    setErr('');
  }

  async function save() {
    if (!form.name.trim() || !form.url.trim()) { setErr('Name and URL are required.'); return; }
    setSaving(true); setErr('');
    const method = editing ? 'PATCH' : 'POST';
    const url    = editing ? `/api/admin/affiliate/${editing.id}` : '/api/admin/affiliate';
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d      = await res.json() as { error?: string };
    setSaving(false);
    if (!res.ok) { setErr(d.error ?? 'Save failed.'); return; }
    setEditing(null); setShowForm(false);
    load();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/affiliate/${id}`, { method: 'DELETE' });
    load();
  }

  async function toggle(l: Link) {
    await fetch(`/api/admin/affiliate/${l.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !l.is_active }),
    });
    load();
  }

  const grouped = CATEGORIES.map(c => ({
    ...c,
    items: links.filter(l => l.category === c.value),
  }));

  return (
    <>
      <div className="adm-topbar">
        <span className="adm-topbar-title">Affiliate Links</span>
        <button onClick={openAdd} className="adm-btn adm-btn-primary adm-btn-sm">
          <Plus size={14} /> Add link
        </button>
      </div>

      <div className="adm-page">
        {loading ? (
          <div className="adm-empty"><p>Loading…</p></div>
        ) : (
          grouped.map(({ value, label, items }) => (
            <div key={value} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--adm-muted)', marginBottom: 10 }}>
                {label} ({items.length})
              </div>
              <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                {items.length === 0 ? (
                  <div style={{ padding: '16px 20px', fontSize: 13, color: 'var(--adm-muted)' }}>No links yet.</div>
                ) : (
                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>Tool</th>
                          <th>URL</th>
                          <th>Featured</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(l => (
                          <tr key={l.id} style={{ opacity: l.is_active ? 1 : .5 }}>
                            <td>
                              <div className="adm-table-title">{l.name}</div>
                              {l.tagline && <div style={{ fontSize: 11, color: 'var(--adm-muted)', marginTop: 2 }}>{l.tagline}</div>}
                            </td>
                            <td>
                              <a href={l.url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: 12, color: 'var(--adm-accent)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Link2 size={11} />{l.url}
                              </a>
                            </td>
                            <td>
                              {l.featured && (
                                <span style={{ fontSize: 11, fontWeight: 700, background: '#fff3e0', color: '#e65100', borderRadius: 5, padding: '2px 8px' }}>
                                  Top Pick
                                </span>
                              )}
                            </td>
                            <td>
                              <button onClick={() => toggle(l)} style={{
                                fontSize: 11, fontWeight: 700, borderRadius: 5, padding: '2px 10px', cursor: 'pointer',
                                border: 'none',
                                background: l.is_active ? '#dcfce7' : '#f3f4f6',
                                color:      l.is_active ? '#15803d' : '#9ca3af',
                              }}>
                                {l.is_active ? 'Active' : 'Hidden'}
                              </button>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => openEdit(l)} className="adm-btn adm-btn-ghost adm-btn-sm" title="Edit">
                                  <Pencil size={13} />
                                </button>
                                <a href={l.url} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost adm-btn-sm" title="Preview">
                                  <ExternalLink size={13} />
                                </a>
                                <button onClick={() => remove(l.id, l.name)} className="adm-btn adm-btn-ghost adm-btn-sm" style={{ color: '#ef4444' }} title="Delete">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="adm-modal-backdrop" onClick={() => { setShowForm(false); setEditing(null); }}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="adm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#3b4fe4,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Link2 size={15} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--adm-text)', letterSpacing: '-.02em' }}>
                    {editing ? 'Edit link' : 'Add affiliate link'}
                  </div>
                  {editing && <div style={{ fontSize: 11, color: 'var(--adm-muted)', marginTop: 1 }}>{editing.name}</div>}
                </div>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditing(null); }}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="adm-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {err && <div className="adm-alert adm-alert-error" style={{ marginBottom: 0 }}>{err}</div>}

              {/* Row: name + tagline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="adm-field">
                  <label className="adm-label">Tool name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="adm-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Alibaba" autoFocus />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Tagline</label>
                  <input className="adm-input" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="e.g. Global wholesale" />
                </div>
              </div>

              {/* Affiliate URL */}
              <div className="adm-field">
                <label className="adm-label">Affiliate URL <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="adm-input" type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://your-affiliate-link.com/ref=xxx" />
              </div>

              {/* Description */}
              <div className="adm-field">
                <label className="adm-label">Description</label>
                <textarea
                  className="adm-input"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Why do you recommend this? One or two sentences."
                  style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Row: category + sort order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 12 }}>
                <div className="adm-field">
                  <label className="adm-label">Category</label>
                  <select className="adm-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Order</label>
                  <input className="adm-input" type="number" min={0} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
              </div>

              {/* Toggles */}
              <div className="adm-toggle-group">
                <label className="adm-toggle">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                  ⭐ Mark as Top Pick
                </label>
                <label className="adm-toggle">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                  👁 Visible on site
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="adm-modal-footer">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="adm-btn adm-btn-ghost">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary" style={{ minWidth: 110 }}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add link'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
