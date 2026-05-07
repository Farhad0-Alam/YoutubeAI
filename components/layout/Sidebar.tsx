'use client';
import { 
  History, Video, BarChart, Bot, 
  Layout, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Layout },
    { href: '/studio', label: 'Studio', icon: Video },
    { href: '/history', label: 'History', icon: History },
    { href: '/analytics', label: 'Analytics', icon: BarChart },
    { href: '/admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 border-r border-gray-100 bg-white h-[calc(100vh-4rem)] sticky top-16 hidden md:block z-50">
      <div className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${
                isActive 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : ''}`} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
