'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import FileUpload from '@/app/admin/FileUpload';

const TYPES      = ['course', 'video', 'ebook', 'guide', 'template', 'tool_access', 'bundle'] as const;
const CATEGORIES = ['importation', 'business', 'productivity', 'finance', 'marketing', 'logistics'] as const;
const SECTIONS   = [
  { value: 'academy', label: 'Academy — courses, guides, learning' },
  { value: 'shop',    label: 'Shop — downloadable tools, templates' },
  { value: 'both',    label: 'Both pages' },
] as const;

type Product = {
  id: string; slug: string; title: string; description: string;
  type: string; category: string; section: string; price_usd: number;
  cover_url: string; file_url: string; is_active: boolean; sort_order: number;
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function EditProductPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [form,    setForm]    = useState<Partial<Product>>({});
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const isNew = id === 'new';

  useEffect(() => {
    if (isNew) {
      setForm({ type: 'course', category: 'importation', section: 'academy', is_active: false, sort_order: 99, price_usd: 0, cover_url: '', file_url: '' });
      return;
    }
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then((d: Product) => setForm(d))
      .catch(() => setError('Failed to load product.'));
  }, [id, isNew]);

  function set(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!form.title?.trim()) { setError('Title is required.'); return; }
    if (!form.slug?.trim())  { setError('Slug is required.');  return; }
    setSaving(true); setError(''); setSuccess('');

    const url    = isNew ? '/api/admin/products'    : `/api/admin/products/${id}`;
    const method = isNew ? 'POST'                   : 'PATCH';

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug: slugify(form.slug ?? '') }),
    });
    const data = await res.json() as { id?: string; error?: string };

    if (!res.ok) {
      setError(data.error ?? 'Failed to save.');
    } else if (isNew && data.id) {
      router.replace(`/admin/products/${data.id}`);
    } else {
      setSuccess('Saved.');
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  }

  async function del() {
    if (!confirm('Delete this product permanently?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.push('/admin/products');
  }

  return (
    <>
      <div className="adm-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/products" className="adm-btn adm-btn-ghost adm-btn-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <span className="adm-topbar-title">{isNew ? 'New Product' : 'Edit Product'}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn-primary" disabled={saving} onClick={save}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save'}
          </button>
          {!isNew && (
            <button className="adm-btn adm-btn-danger" onClick={del}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="adm-page">
        {error   && <div className="adm-alert adm-alert-error">{error}</div>}
        {success && <div className="adm-alert adm-alert-success">{success}</div>}

        <div className="adm-form-grid">
          {/* ── Main fields ── */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="adm-field">
                <label>Title</label>
                <input
                  type="text"
                  value={form.title ?? ''}
                  onChange={e => { set('title', e.target.value); if (!form.slug || isNew) set('slug', slugify(e.target.value)); }}
                />
              </div>
              <div className="adm-field">
                <label>Slug</label>
                <input type="text" value={form.slug ?? ''} onChange={e => set('slug', slugify(e.target.value))} />
                <div className="adm-field-hint">URL identifier — auto-filled from title</div>
              </div>
            </div>

            <div className="adm-field">
              <label>Description</label>
              <textarea
                rows={4}
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value)}
                placeholder={`First line = intro paragraph on the product page.\nEach line after = one benefit bullet.\n\nExample:\nLearn to import profitably from China and Dubai.\nFind winning products before spending a penny\nNegotiate with verified suppliers confidently`}
              />
              <div className="adm-field-hint">First line is the intro. Each additional line becomes a benefit bullet on the squeeze page.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div className="adm-field">
                <label>Type</label>
                <select value={form.type ?? 'course'} onChange={e => set('type', e.target.value)}>
                  {TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label>Category</label>
                <select value={form.category ?? 'importation'} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace(/\b\w/g, (l: string) => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label>Price (USD)</label>
                <input type="number" min={0} step={0.01} value={form.price_usd ?? 0} onChange={e => set('price_usd', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="adm-field">
                <label>Sort order</label>
                <input type="number" min={0} value={form.sort_order ?? 99} onChange={e => set('sort_order', parseInt(e.target.value, 10) || 0)} />
                <div className="adm-field-hint">1 shows first, 2 next, etc.</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="adm-field">
                <label>Where to feature</label>
                <select value={form.section ?? 'academy'} onChange={e => set('section', e.target.value)}>
                  {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <div className="adm-field-hint">Controls which page this product appears on</div>
              </div>
              <div className="adm-field">
                <label>Active</label>
                <select value={form.is_active ? 'true' : 'false'} onChange={e => set('is_active', e.target.value === 'true')}>
                  <option value="true">Yes — visible on site</option>
                  <option value="false">No — hidden (draft)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Cover image ── */}
          <div>
            <div className="adm-card">
              <div className="adm-card-title">Cover image</div>
              <FileUpload
                label=""
                type="image"
                folder="products"
                currentUrl={form.cover_url ?? ''}
                onUpload={url => set('cover_url', url)}
              />
            </div>
          </div>

          {/* ── Content file ── */}
          <div>
            <div className="adm-card">
              <div className="adm-card-title">Content</div>
              <FileUpload
                label=""
                type="any"
                folder="content"
                currentUrl={form.file_url ?? ''}
                onUpload={url => set('file_url', url)}
              />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 10, lineHeight: 1.65 }}>
                Any file type — MP4, PDF, Excel, Word, audio, ZIP, etc. Images are public; everything else is delivered via a private secure link. Max 5 GB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
