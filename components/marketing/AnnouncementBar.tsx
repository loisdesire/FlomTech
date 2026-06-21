'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DISMISS_KEY = 'fd-announce-v1';

interface Props {
  message?: string;
  linkLabel?: string;
  linkHref?: string;
}

export default function AnnouncementBar({
  message    = '🎉 The Mini Importation Mastery Guide is now live!',
  linkLabel  = 'Get your copy →',
  linkHref   = '/shop',
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fd-announce">
      {message}{' '}
      <a href={linkHref}>{linkLabel}</a>
      <button className="fd-announce-close" onClick={dismiss} aria-label="Dismiss announcement">
        <X size={14} />
      </button>
    </div>
  );
}
