import React from 'react';
import { MousePointer2, SplitSquareHorizontal, SlidersHorizontal, Undo, Redo, Trash2, Volume2, ZoomOut, ZoomIn, ImageIcon, Music, Layers } from 'lucide-react';

interface EditorTimelineProps {
  scenes: any[];
  selectedIdx: number | null;
  setSelectedIdx: (idx: number | null) => void;
  zoom: number;
  setZoom: (z: number) => void;
  pxPerSec: number;
  totalDuration: number;
  playheadRef: React.RefObject<HTMLDivElement | null>;
  onSplit: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  commitScenes: (newScenes: any[]) => void;
}

export function EditorTimeline({
  scenes,
  selectedIdx,
  setSelectedIdx,
  zoom,
  setZoom,
  pxPerSec,
  totalDuration,
  playheadRef,
  onSplit,
  onDelete,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  commitScenes
}: EditorTimelineProps) {
  return (
    <div className="h-[35%] min-h-[250px] border-t border-[#2a2a2a] bg-[#121212] flex flex-col shrink-0 overflow-hidden relative">
       {/* Toolbar */}
       <div className="h-10 border-b border-[#2a2a2a] bg-[#181818] flex items-center justify-between px-4 shrink-0">
          <div className="flex gap-2 isolate relative z-20">
             <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors"><MousePointer2 className="w-3.5 h-3.5" /></button>
             <button onClick={onSplit} disabled={selectedIdx === null} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><SplitSquareHorizontal className="w-3.5 h-3.5" /></button>
             <div className="w-px h-4 bg-[#333] my-auto mx-1" />
             <button 
               disabled={selectedIdx === null} 
               onClick={() => {
                  if (selectedIdx === null) return;
                  const newScenes = [...scenes];
                  newScenes[selectedIdx] = { 
                    ...newScenes[selectedIdx], 
                    brightness: (newScenes[selectedIdx].brightness || 100) + 10,
                    contrast: (newScenes[selectedIdx].contrast || 100) + 10
                  };
                  commitScenes(newScenes);
               }}
               className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-indigo-400 transition-colors disabled:opacity-30 disabled:text-gray-500" 
             >
               <SlidersHorizontal className="w-3.5 h-3.5" />
             </button>
             <div className="w-px h-4 bg-[#333] my-auto mx-1" />
             <button onClick={onUndo} disabled={!canUndo} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><Undo className="w-3.5 h-3.5" /></button>
             <button onClick={onRedo} disabled={!canRedo} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><Redo className="w-3.5 h-3.5" /></button>
             <div className="w-px h-4 bg-[#333] my-auto mx-1" />
             <button onClick={onDelete} disabled={selectedIdx === null} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
             <Volume2 className="w-4 h-4" />
             <div className="flex items-center gap-2 bg-[#1e1e1e] rounded-full px-2 py-1">
                <ZoomOut className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => setZoom(Math.max(1, zoom-1))} />
                <input 
                   type="range" min="1" max="20" value={zoom} onChange={e => setZoom(parseInt(e.target.value))}
                   className="w-24 h-1 bg-[#333] rounded-full appearance-none accent-gray-500 cursor-pointer"
                />
                <ZoomIn className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => setZoom(Math.min(20, zoom+1))} />
             </div>
          </div>
       </div>

       {/* Tracks Container */}
       <div className="flex-1 overflow-auto relative p-4 pl-8 custom-scrollbar bg-[#121212]">
          
          {/* Time Ruler */}
          <div className="mb-4 h-4 border-b border-[#2a2a2a] relative pointer-events-none sticky top-0 bg-[#121212] z-20" style={{ width: Math.max(totalDuration * pxPerSec, 800) }}>
             {Array.from({ length: Math.ceil(Math.max(totalDuration, 60)) }).map((_, i) => (
                i % 5 === 0 ? (
                   <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: i * pxPerSec }}>
                     <span className="text-[9px] text-gray-500 -mt-1">{i}s</span>
                     <div className="h-2 w-px bg-gray-600 mt-1" />
                   </div>
                ) : (
                   <div key={i} className="absolute top-2 w-px h-1 bg-[#333]" style={{ left: i * pxPerSec }} />
                )
             ))}
          </div>

          <div className="min-w-max space-y-2 relative pb-8">
             {/* Playhead Guide */}
             <div ref={playheadRef} className="absolute top-[-24px] bottom-0 w-px bg-cyan-500 z-10 pointer-events-none left-4 shadow-[0_0_8px_rgba(6,182,212,1)] flex flex-col items-center sticky-playhead">
               <div className="w-2 h-2 bg-cyan-500 rotate-45 -mt-1"></div>
             </div>

             {scenes.length === 0 ? (
               <div className="flex items-center justify-center h-20 text-gray-500 text-sm border border-dashed border-[#333] rounded mx-4">
                  Drag material here and start to create
               </div>
             ) : (
               <>
                 {/* Video Track */}
                 <div className="flex relative items-center min-w-full group">
                    <div className="absolute left-[-2rem] w-6 flex justify-center text-gray-600"><ImageIcon className="w-3.5 h-3.5" /></div>
                    <div className="flex items-center h-[56px] bg-[#1a1a1a] rounded ring-1 ring-[#333] overflow-hidden ml-4">
                       {scenes.map((scene, i) => {
                          const hasTransition = scene.transition && scene.transition !== 'none';
                          const transitionWidth = hasTransition ? Math.max((scene.transition_duration || 0.5) * pxPerSec, 8) : 0;
                          return (
                             <div 
                               key={`vid-${i}`}
                               onClick={() => setSelectedIdx(i)}
                               className={`h-full border-r border-[#111] relative overflow-hidden flex-shrink-0 cursor-pointer bg-slate-800 transition-all ${selectedIdx === i ? 'ring-1 ring-cyan-500 z-10 brightness-110' : 'hover:brightness-110'}`}
                               style={{ width: Math.max((scene.duration_seconds || 15) * pxPerSec, 20) }}
                             >
                                {scene.media_type === 'video' ? (
                                   <video src={scene.media_path} className="w-full h-full object-cover opacity-60" />
                                ) : (
                                   <img src={scene.media_path} alt={`Scene ${i + 1}`} className="w-full h-full object-cover opacity-60 pointer-events-none" />
                                )}
                                <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/80 pt-1 px-1 text-[9px] text-white truncate pointer-events-none">
                                   {scene.search_keyword}
                                </div>
                                {hasTransition && (
                                   <div 
                                      className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-indigo-500/80 to-indigo-500/20 pointer-events-none border-l border-indigo-400"
                                      style={{ width: transitionWidth }}
                                   >
                                      <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay">
                                         <Layers className="w-3 h-3 text-white opacity-50" />
                                      </div>
                                   </div>
                                )}
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* Audio Track */}
                 <div className="flex relative items-center min-w-full">
                    <div className="absolute left-[-2rem] w-6 flex justify-center text-gray-600"><Music className="w-3.5 h-3.5" /></div>
                    <div className="flex items-center h-12 bg-[#1a1a1a] rounded ring-1 ring-[#333] ml-4">
                       {scenes.map((scene, i) => (
                          <div 
                            key={`aud-${i}`}
                            onClick={() => setSelectedIdx(i)}
                            className={`h-full bg-indigo-900/40 border-r border-[#111] overflow-hidden flex-shrink-0 cursor-pointer ${selectedIdx === i ? 'ring-1 ring-cyan-500 z-10' : 'hover:bg-indigo-900/50'}`}
                            style={{ width: Math.max((scene.duration_seconds || 15) * pxPerSec, 20) }}
                          >
                             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M0,50 L5,20 L10,80 L15,40 L20,60 L25,30 L30,70 L35,45 L40,55 L45,25 L50,85 L55,35 L60,65 L65,20 L70,75 L75,40 L80,50 L85,30 L90,60 L95,45 L100,50" fill="none" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                             </svg>
                          </div>
                       ))}
                    </div>
                 </div>
               </>
             )}
          </div>
       </div>
    </div>
  );
}
