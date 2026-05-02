import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'CreatorStudio - Faceless Videos',
  description: 'Production tool for high-cpm niches',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="bg-gray-50 text-gray-900 font-sans antialiased h-screen overflow-hidden flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)] relative">
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full relative">
            <div className="relative z-10 w-full min-h-full">
              {children}
            </div>
          </main>
        </div>
        <Toaster theme="light" position="bottom-right" />
      </body>
    </html>
  );
}
