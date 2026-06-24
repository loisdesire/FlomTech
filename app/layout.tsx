import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Flom Digital — Learn. Build. Automate. Profit.',
    template: '%s | Flom Digital',
  },
  description:
    'Business education, importation training, and free productivity tools for serious business builders.',
  metadataBase: new URL('https://flomdigital.com'),
  openGraph: {
    siteName: 'Flom Digital',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
