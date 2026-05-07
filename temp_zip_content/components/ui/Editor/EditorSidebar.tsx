import React from 'react';
import { Image as ImageIcon, Music, Type, Layers, Download } from 'lucide-react';
import { toast } from 'sonner';

interface EditorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scenes: any[];
  selectedIdx: number | null;
  setSelectedIdx: (idx: number) => void;
}

export function EditorSidebar({
  activeTab,
  setActiveTab,
  scenes,
  selectedIdx,
  setSelectedIdx
}: EditorSidebarProps) {
  
  const handleDownloadMedia = async (e: React.MouseEvent, url: string, sceneNumber: number, mediaType: string) => {
    e.stopPropagation();
    try {
      toast.info(`Downloading media ${sceneNumber}...`);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const extension = mediaType === 'video' ? 'mp4' : 'png';
      a.download = `Scene_${sceneNumber}_Media.${extension}`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-[340px] border-r border-[#2a2a2a] bg-[#181818] flex shrink-0">
      <div className="w-16 border-r border-[#2a2a2a] flex flex-col items-center py-2 space-y-4">
          {[
            { id: 'media', icon: ImageIcon, label: 'Media' },
            { id: 'audio', icon: Music, label: 'Audio' },
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'transitions', icon: Layers, label: 'Transition' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 w-full py-2 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          ))}
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="px-2 py-3 border-b border-[#2a2a2a] space-y-1">
           {['Import', 'Yours', 'AI media', 'Spaces', 'Library'].map((sub, idx) => (
             <button key={sub} className={`block w-full text-left px-2 py-1 rounded text-xs ${idx === 0 ? 'bg-[#2a2a2a] text-white font-medium' : 'text-gray-400 hover:bg-[#222]'}`}>
                {sub}
             </button>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-1.5 rounded transition-colors mx-auto w-full justify-center">
               <span className="w-4 h-4 bg-cyan-600 rounded-full flex items-center justify-center text-[10px]">+</span>
               Import
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             {scenes.map((scene, i) => (
               <div key={i} onClick={() => setSelectedIdx(i)} className={`aspect-video bg-[#222] rounded overflow-hidden relative group border ${selectedIdx === i ? 'border-cyan-500' : 'border-[#333] hover:border-[#666]'} cursor-pointer transition-colors`}>
                 {scene.media_type === 'video' ? (
                   <video src={scene.media_path} className="w-full h-full object-cover" />
                 ) : (
                    <img src={scene.media_path} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                 )}
                 <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent flex justify-between">
                   <span className="text-[9px] text-white/80">#{i + 1}</span>
                   <span className="text-[9px] text-white/80">{scene.duration_seconds}s</span>
                 </div>
                 <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => scene.media_path && handleDownloadMedia(e, scene.media_path, i + 1, scene.media_type || 'image')}
                      className="bg-black/70 hover:bg-black p-1 rounded backdrop-blur text-white shadow-sm"
                    >
                       <Download className="w-3 h-3" />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
