import React from 'react';
import { Download, RefreshCcw, Loader2, Video, Image as ImageIcon } from 'lucide-react';
import { LazyImage } from '../LazyImage';

interface SceneMediaCardProps {
  scene: any;
  index: number;
  isRegenerating: boolean;
  onDownload: (path: string, type: string, optIdx?: number) => void;
  onRegenerate: () => void;
}

export function SceneMediaCard({
  scene,
  index,
  isRegenerating,
  onDownload,
  onRegenerate
}: SceneMediaCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-0 shadow-sm relative overflow-hidden flex flex-col">
      <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white font-medium px-2 py-1 rounded text-xs border border-white/20">
        #{scene.scene_number.toString().padStart(2, '0')}
      </div>
      
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center relative">
        {scene.media_path ? (
          scene.media_type === 'video' ? (
            <video src={scene.media_path} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <LazyImage src={scene.media_path} alt={scene.search_keyword} delayMs={index * 600} />
          )
        ) : (
          <div className="text-gray-400 p-4 text-center text-sm">Failed to fetch match for "{scene.search_keyword}"</div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3 block truncate" title={scene.search_keyword}>
          Query: <span className="text-indigo-600">{scene.search_keyword}</span>
        </div>
        
        {scene.media_options && scene.media_options.length > 1 && (
          <div className="mb-3 space-y-2 pr-1">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">More options for this scene:</div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {scene.media_options.map((opt: any, optIdx: number) => (
                <div key={optIdx} className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    {opt.thumbnail_url ? (
                      <img src={opt.thumbnail_url} alt={opt.keyword} className="w-16 h-9 object-cover rounded shadow-sm bg-gray-200" />
                    ) : (
                      <div className="w-16 h-9 flex items-center justify-center bg-gray-200 rounded shadow-sm">
                        {opt.media_type === 'video' ? <Video className="w-4 h-4 text-gray-400" /> : <ImageIcon className="w-4 h-4 text-gray-400" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs text-gray-700 font-medium" title={opt.keyword || 'Alternative'}>
                        {opt.keyword || `Alternative ${optIdx + 1}`}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase mt-0.5">{opt.media_type} Option {optIdx + 1}</div>
                    </div>
                    <button
                     onClick={() => onDownload(opt.media_path, opt.media_type, optIdx)}
                     className="text-white bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded-md flex-shrink-0 transition-colors shadow-sm"
                     title="Download this option"
                    >
                     <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-3 flex gap-2 justify-between items-center border-t border-gray-100">
           <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
             {scene.media_type === 'video' ? 'HD Video' : 'Generated Image'}
           </span>
           
           <div className="flex items-center gap-2">
             {scene.media_path && (
               <button
                  onClick={() => onDownload(scene.media_path, scene.media_type)}
                  className="text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 p-1.5 rounded transition-colors"
                  title="Download Media"
               >
                 <Download className="w-4 h-4" />
               </button>
             )}
             <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
             >
               {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin"/> : <RefreshCcw className="w-3 h-3" />}
               Change Media
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
