import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Flom Digital — Learn. Build. Automate. Profit.',
    template: '%s | Flom Digital',
  },
  description:
    'Business education, importation training, and free productivity tools for serious business builders.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
