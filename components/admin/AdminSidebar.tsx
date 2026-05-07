'use client';
import React from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Settings, 
  ShieldAlert, LogOut, Activity, BarChart3 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'plans', label: 'Plan Management', icon: CreditCard },
    { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Global Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-[#020617] border-r border-white/5 h-screen flex flex-col sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-xl block">Admin HQ</span>
            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">YoutubeAI Engine</span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                  isActive 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors text-sm font-bold">
          <LogOut className="w-5 h-5" />
          Exit Admin
        </Link>
      </div>
    </aside>
  );
}
