'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="fd-faq-list">
      {items.map((item, i) => (
        <div key={i} className="fd-faq-item">
          <button
            className="fd-faq-trigger"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.question}
            <ChevronDown size={18} />
          </button>
          {open === i && (
            <div className="fd-faq-body">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
