import type {Metadata} from 'next';
import './globals.css'; // Global styles
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Smart Campus Resource Management',
  description: 'AI-Inspired Intelligent Platform for Campus Resources',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased" suppressHydrationWarning>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
