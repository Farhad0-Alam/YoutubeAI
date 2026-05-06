import React from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface EditorHeaderProps {
  projectTitle: string;
  onSave: () => void;
  onExportClick: () => void;
  onClose: () => void;
}

export function EditorHeader({ projectTitle, onSave, onExportClick, onClose }: EditorHeaderProps) {
  return (
    <div className="h-12 border-b border-[#2a2a2a] bg-[#181818] flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 hover:bg-[#2a2a2a] rounded cursor-pointer transition-colors text-gray-300">
           <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
           <span className="text-[12px] font-medium">Menu</span>
           <ChevronLeft className="w-3 h-3 -rotate-90" />
        </div>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 text-gray-300 font-medium text-[13px]">
         {projectTitle}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-1 rounded text-[11px] font-semibold text-gray-300 cursor-pointer hover:bg-[#333]">
           <span className="w-3 h-3 text-cyan-500">✦</span> Pro
        </div>
        <button 
           onClick={onSave} 
           className="px-4 py-1.5 border border-[#333] hover:bg-[#222] text-gray-300 rounded font-medium transition-colors text-[12px]"
        >
          Share
        </button>
        <button 
          onClick={onExportClick} 
          className="px-5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium shadow-sm transition-all flex items-center gap-2 text-[12px]"
        >
          Export
        </button>
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#333]">
           <div className="w-3 h-px bg-gray-400"></div>
           <div className="w-3 h-3 border border-gray-400"></div>
           <X onClick={onClose} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
}
