import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'AXIS ARCHITECTURE — Spatial Intelligence & Reconstruction',
  description:
    'High-precision architectural blueprint analysis and 3D spatial reconstruction technology platform.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-axis-bg text-axis-text-primary">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
