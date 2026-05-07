'use client';
import { Home, History, Video, BarChart, Bot } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Studio', icon: Video },
    { href: '/engine', label: 'Engine', icon: Bot },
    { href: '/history', label: 'History', icon: History },
    { href: '/analytics', label: 'Analytics', icon: BarChart },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-[calc(100vh-4rem)] sticky top-16 hidden md:block">
      <div className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
