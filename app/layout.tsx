import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClientLayout } from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'YoutubeAI - Create Viral Videos in Seconds',
  description: 'The all-in-one AI production studio for YouTube creators. Generate scripts, visuals, voiceovers, and edits with a single click.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
