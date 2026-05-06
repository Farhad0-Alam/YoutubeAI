import React from 'react';
import { X, ImageIcon, FolderClosed, Layers } from 'lucide-react';

interface ExportModalProps {
  name: string;
  setName: (val: string) => void;
  resolution: string;
  setResolution: (val: string) => void;
  format: string;
  setFormat: (val: string) => void;
  frameRate: string;
  setFrameRate: (val: string) => void;
  isExporting: boolean;
  onExport: () => void;
  onClose: () => void;
  totalDuration: number;
  thumbnail?: string;
}

export function ExportModal({
  name, setName,
  resolution, setResolution,
  format, setFormat,
  frameRate, setFrameRate,
  isExporting,
  onExport,
  onClose,
  totalDuration,
  thumbnail
}: ExportModalProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#242424] w-full max-w-[800px] rounded shadow-2xl overflow-hidden flex flex-col font-sans">
        <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#282828]">
          <span className="text-gray-200 text-[13px] font-medium">Export-{name}</span>
        </div>

        <div className="p-6 flex gap-6 text-[13px]">
           <div className="w-[260px] shrink-0 flex flex-col items-center">
              <div className="w-full aspect-[9/16] bg-[#1a1a1a] rounded-md overflow-hidden relative border border-[#333]">
                 {thumbnail && (
                    <img src={thumbnail} alt="Cover preview" className="w-full h-full object-cover opacity-80" />
                 )}
                 <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[11px] text-white flex items-center gap-1 cursor-pointer hover:bg-black/70">
                   <ImageIcon className="w-3 h-3" /> Edit cover
                 </div>
              </div>
           </div>

           <div className="flex-1 space-y-5 text-gray-300">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                 <span className="text-gray-400">Export timeline</span>
                 <span className="text-gray-500">Timeline 01</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                 <span className="text-gray-400">Name</span>
                 <input 
                   className="bg-[#333] text-gray-200 px-3 py-1.5 rounded outline-none border-none focus:ring-1 focus:ring-cyan-500 w-full"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                 />
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                 <span className="text-gray-400">Export to</span>
                 <div className="flex items-center gap-2">
                   <input className="bg-[#333] text-gray-200 px-3 py-1.5 rounded outline-none border-none w-full truncate" value="G:/MyVideo.mp4" readOnly />
                   <button className="bg-[#333] hover:bg-[#444] p-1.5 rounded transition-colors text-white"><FolderClosed className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="pt-2 border-t border-[#333]">
                 <div className="space-y-3">
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                       <span className="text-gray-400">Resolution</span>
                       <select className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer" value={resolution} onChange={(e) => setResolution(e.target.value)}>
                          <option value="1080p">1080p</option>
                          <option value="4K">4K</option>
                          <option value="720p">720p</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                       <span className="text-gray-400">Format</span>
                       <select className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer" value={format} onChange={(e) => setFormat(e.target.value)}>
                          <option value="mp4">mp4</option>
                          <option value="mov">mov</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                       <span className="text-gray-400">Frame rate</span>
                       <select className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer" value={frameRate} onChange={(e) => setFrameRate(e.target.value)}>
                          <option value="30fps">30fps</option>
                          <option value="60fps">60fps</option>
                          <option value="24fps">24fps</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="h-16 border-t border-[#333] bg-[#282828] px-6 flex items-center justify-between">
           <div className="flex flex-col text-gray-400 text-[11px]">
              <div className="flex items-center gap-1"><Layers className="w-3.5 h-3.5"/> Duration: {Math.floor(totalDuration / 60)}m {Math.floor(totalDuration % 60)}s</div>
           </div>
           <div className="flex items-center gap-3">
             <button onClick={onClose} className="px-6 py-1.5 bg-[#444] hover:bg-[#555] rounded text-gray-200 transition-colors">Cancel</button>
             <button onClick={onExport} disabled={isExporting} className="px-8 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded shadow-lg transition-all disabled:opacity-50">
                {isExporting ? 'Exporting...' : 'Export'}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
