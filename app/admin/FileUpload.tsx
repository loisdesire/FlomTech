'use client';

import { useRef, useState } from 'react';
import { Upload, X, FileVideo, FileText, Image, Loader2 } from 'lucide-react';

type FileType = 'image' | 'video' | 'pdf' | 'any';

const ACCEPT: Record<FileType, string> = {
  image: 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
  video: 'video/mp4,video/webm,video/quicktime',
  pdf:   'application/pdf',
  any:   '*',  // any file type
};

const LABELS: Record<FileType, string> = {
  image: 'image (JPG, PNG, WebP)',
  video: 'video (MP4, WebM)',
  pdf:   'PDF document',
  any:   'any file — PDF, Excel, Word, audio, MP4, ZIP…',
};

function FileIcon({ type }: { type: FileType }) {
  if (type === 'video') return <FileVideo size={20} color="#f97316" />;
  if (type === 'pdf')   return <FileText  size={20} color="#f97316" />;
  return <Image size={20} color="#f97316" />;
}

function fmtSize(bytes: number) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}

type Props = {
  label:       string;
  type:        FileType;
  folder?:     string;
  currentUrl?: string;
  onUpload:    (url: string) => void;
};

export default function FileUpload({ label, type, folder = '', currentUrl, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState('');
  const [error,     setError]     = useState('');
  const [preview,   setPreview]   = useState(currentUrl ?? '');

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    setProgress(`Uploading ${fmtSize(file.size)}…`);

    const fd = new FormData();
    fd.append('file',   file);
    fd.append('folder', folder);

    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json() as { url?: string; error?: string };

    if (!res.ok || !data.url) {
      setError(data.error ?? 'Upload failed.');
    } else {
      setPreview(data.url);
      onUpload(data.url);
      setProgress('');
    }
    setUploading(false);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function clear() {
    setPreview('');
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  }

  const isImage = preview && /\.(jpe?g|png|webp|gif|svg)/i.test(preview.split('?')[0]);
  const isVideo = preview && /\.(mp4|webm|mov)/i.test(preview.split('?')[0]);

  return (
    <div className="adm-field">
      <label>{label}</label>

      {/* Preview */}
      {preview && (
        <div style={{ position: 'relative', marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e5e7eb', maxWidth: 320 }}>
          {isImage && (
            <img src={preview} alt="" style={{ width: '100%', display: 'block', maxHeight: 200, objectFit: 'cover' }} />
          )}
          {isVideo && (
            <video src={preview} controls style={{ width: '100%', maxHeight: 200 }} />
          )}
          {!isImage && !isVideo && (
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
              <FileText size={18} color="#f97316" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {preview.split('/').pop()?.split('?')[0] ?? 'File'}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={clear}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!preview && (
        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            border: '2px dashed #e5e7eb',
            borderRadius: 8,
            padding: '24px 16px',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            background: '#fafafa',
            transition: 'border-color .15s',
          }}
          onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLElement).style.borderColor = '#f97316'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Loader2 size={24} color="#f97316" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 12, color: '#6b7280' }}>{progress}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <FileIcon type={type} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f97316' }}>Click to upload</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}> or drag & drop</span>
              </div>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                {LABELS[type]} · max {type === 'video' ? '5 GB' : '50 MB'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Replace link when preview exists */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="adm-btn adm-btn-outline adm-btn-sm"
          style={{ marginTop: 6 }}
        >
          <Upload size={12} /> Replace file
        </button>
      )}

      {error && (
        <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 6 }}>{error}</div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[type]}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
