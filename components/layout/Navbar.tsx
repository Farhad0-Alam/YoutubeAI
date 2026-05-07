import { Video, Settings, Zap, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-gray-900 font-bold tracking-tight text-xl font-outfit">YoutubeAI</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/dashboard" className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
           <User className="w-5 h-5" />
        </Link>
        <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />
        <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
