'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';
import { BottomNav } from './BottomNav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isAdminPage = pathname === '/admin';
  const hideShell = isLandingPage || isLoginPage || isAdminPage;

  return (
    <body suppressHydrationWarning className={`${isAdminPage ? 'bg-[#020617] text-white' : 'bg-gray-50 text-gray-900'} font-sans antialiased h-screen overflow-hidden flex flex-col selection:bg-indigo-100 selection:text-indigo-900`}>
      {!hideShell && <Navbar />}
      <div className={`flex ${!hideShell ? 'h-[calc(100vh-4rem)]' : 'h-screen'} relative`}>
        {!hideShell && <Sidebar />}
        <main className={`flex-1 overflow-y-auto w-full relative ${!hideShell ? 'pb-20 md:pb-0' : ''}`}>
          <div className="relative z-10 w-full min-h-full">
            {children}
          </div>
        </main>
      </div>
      {!hideShell && <BottomNav />}
      <Toaster theme="light" position="bottom-right" />
    </body>
  );
}
