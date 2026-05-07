'use client';
import { Layout, Video, History, BarChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  
  const links = [
    { href: '/dashboard', label: 'Home', icon: Layout },
    { href: '/studio', label: 'Studio', icon: Video },
    { href: '/history', label: 'History', icon: History },
    { href: '/analytics', label: 'Stats', icon: BarChart },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between z-[100] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-indigo-600 scale-110' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-50' : ''}`}>
               <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
