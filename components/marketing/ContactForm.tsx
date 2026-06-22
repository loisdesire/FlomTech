'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

type FormState = {
  first_name: string;
  last_name:  string;
  email:      string;
  subject:    string;
  message:    string;
};

export default function ContactForm() {
  const [form, setForm]     = useState<FormState>({ first_name: '', last_name: '', email: '', subject: 'general', message: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.message.trim()) {
      setError('Email and message are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) { setError(data.error ?? 'Something went wrong. Please try again.'); return; }
      setSent(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#16a34a' }}>
        <CheckCircle size={44} style={{ marginBottom: 14 }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fd-navy)', marginBottom: 8 }}>Message sent!</h3>
        <p style={{ fontSize: 14, color: 'var(--fd-muted)' }}>We'll get back to you within 24–48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: '#dc2626', fontSize: 13.5, marginBottom: 16, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <div className="fd-contact-form-grid">
        <div className="fd-contact-field">
          <label htmlFor="first_name">First name</label>
          <input id="first_name" value={form.first_name} onChange={set('first_name')} placeholder="Jane" />
        </div>
        <div className="fd-contact-field">
          <label htmlFor="last_name">Last name</label>
          <input id="last_name" value={form.last_name} onChange={set('last_name')} placeholder="Smith" />
        </div>
        <div className="fd-contact-field span2">
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
        </div>
        <div className="fd-contact-field span2">
          <label htmlFor="subject">What's this about?</label>
          <select id="subject" value={form.subject} onChange={set('subject')}>
            <option value="general">General enquiry</option>
            <option value="course">The Course</option>
            <option value="book">The Book</option>
            <option value="tools">Business Tools</option>
            <option value="shop">Shop / Order</option>
            <option value="partnership">Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="fd-contact-field span2">
          <label htmlFor="message">Message *</label>
          <textarea id="message" value={form.message} onChange={set('message')} placeholder="Tell us what's on your mind…" required />
        </div>
      </div>

      <button
        type="submit"
        className="fd-btn fd-btn-primary"
        style={{ marginTop: 8 }}
        disabled={loading}
      >
        {loading ? 'Sending…' : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
