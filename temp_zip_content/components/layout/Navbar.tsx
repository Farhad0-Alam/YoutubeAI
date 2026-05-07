import { Video, Settings } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-inner">
          <Video className="w-5 h-5 text-white" />
        </div>
        <span className="text-gray-900 font-bold tracking-tight text-lg">CreatorStudio</span>
      </div>
      <div>
        <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
