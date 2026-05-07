import React from 'react';

interface EditorPropertiesPanelProps {
  selectedIdx: number | null;
  scenes: any[];
  commitScenes: (newScenes: any[]) => void;
  project: any;
}

export function EditorPropertiesPanel({
  selectedIdx,
  scenes,
  commitScenes,
  project
}: EditorPropertiesPanelProps) {
  const selectedScene = selectedIdx !== null ? scenes[selectedIdx] : null;

  const updateScene = (updates: any) => {
    if (selectedIdx === null) return;
    const newScenes = [...scenes];
    newScenes[selectedIdx] = { ...newScenes[selectedIdx], ...updates };
    commitScenes(newScenes);
  };

  return (
    <div className="w-[300px] border-l border-[#2a2a2a] bg-[#181818] flex flex-col shrink-0">
      <div className="h-10 border-b border-[#2a2a2a] flex items-center px-4">
        <span className="text-white font-medium">Details</span>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
         {selectedScene ? (
           <>
             <div>
               <label className="text-[10px] text-gray-500 block mb-1">Scene Duration</label>
               <div className="flex items-center gap-2">
                 <input 
                   type="number" 
                   step="0.1"
                   className="bg-[#2a2a2a] text-white px-2 py-1.5 rounded w-full border-none outline-none focus:ring-1 focus:ring-cyan-500" 
                   value={selectedScene.duration_seconds || 15}
                   onChange={(e) => updateScene({ duration_seconds: parseFloat(e.target.value) || 2 })}
                 />
                 <span className="text-gray-500">seconds</span>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-2">
               <div>
                 <label className="text-[10px] text-gray-500 block mb-1">Transition Type</label>
                 <select 
                   className="bg-[#2a2a2a] text-white px-2 py-1.5 rounded w-full border-none outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                   value={selectedScene.transition || 'none'}
                   onChange={(e) => updateScene({ transition: e.target.value })}
                 >
                   <option value="none">None</option>
                   <option value="fade">Fade</option>
                   <option value="dissolve">Dissolve</option>
                   <option value="slide_left">Slide Left</option>
                   <option value="slide_right">Slide Right</option>
                   <option value="wipe">Wipe</option>
                   <option value="zoom">Zoom</option>
                 </select>
               </div>
               <div>
                 <label className="text-[10px] text-gray-500 block mb-1">Trans. Length</label>
                 <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.1" min="0" max="5"
                      className="bg-[#2a2a2a] text-white px-2 py-1.5 rounded w-full border-none outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                      value={selectedScene.transition_duration || 0.5}
                      onChange={(e) => updateScene({ transition_duration: parseFloat(e.target.value) || 0 })}
                    />
                    <span className="text-gray-500 truncate text-[10px]">sec</span>
                 </div>
               </div>
             </div>
             <div>
               <label className="text-[10px] text-gray-500 block mb-1">Visual Keyword</label>
               <textarea 
                  className="w-full h-12 bg-[#222] text-gray-300 p-2 rounded text-[11px] resize-none border border-[#333] outline-none focus:border-cyan-500 transition-colors"
                  value={selectedScene.search_keyword}
                  onChange={(e) => updateScene({ search_keyword: e.target.value })}
               />
             </div>
             <div className="grid grid-cols-2 gap-2 mt-2 border-t border-[#333] pt-4">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Volume</label>
                  <input 
                    type="range" min="0" max="200"
                    className="w-full h-1 bg-[#333] rounded-full appearance-none accent-cyan-500 cursor-pointer"
                    value={(selectedScene.audio_volume !== undefined ? selectedScene.audio_volume : 1) * 100}
                    onChange={(e) => updateScene({ audio_volume: parseInt(e.target.value) / 100 })}
                  />
                  <div className="text-[9px] text-gray-600 text-right mt-1">{Math.round((selectedScene.audio_volume !== undefined ? selectedScene.audio_volume : 1) * 100)}%</div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Brightness</label>
                  <input 
                    type="range" min="50" max="150"
                    className="w-full h-1 bg-[#333] rounded-full appearance-none accent-cyan-500 cursor-pointer"
                    value={selectedScene.brightness !== undefined ? selectedScene.brightness : 100}
                    onChange={(e) => updateScene({ brightness: parseInt(e.target.value) })}
                  />
                  <div className="text-[9px] text-gray-600 text-right mt-1">{selectedScene.brightness !== undefined ? selectedScene.brightness : 100}%</div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Contrast</label>
                  <input 
                    type="range" min="50" max="150"
                    className="w-full h-1 bg-[#333] rounded-full appearance-none accent-cyan-500 cursor-pointer"
                    value={selectedScene.contrast !== undefined ? selectedScene.contrast : 100}
                    onChange={(e) => updateScene({ contrast: parseInt(e.target.value) })}
                  />
                  <div className="text-[9px] text-gray-600 text-right mt-1">{selectedScene.contrast !== undefined ? selectedScene.contrast : 100}%</div>
                </div>
             </div>
             <div className="mt-2">
               <label className="text-[10px] text-gray-500 block mb-1">Voiceover Script</label>
               <textarea 
                  className="w-full h-16 bg-[#222] text-gray-300 p-2 rounded text-[11px] resize-none border border-[#333] outline-none focus:border-cyan-500 transition-colors"
                  value={selectedScene.narration}
                  onChange={(e) => updateScene({ narration: e.target.value })}
               />
             </div>
           </>
         ) : (
           <div className="space-y-4 text-xs">
             <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="text-white">{project?.title || "-"}</span></div>
             <div className="flex justify-between"><span className="text-gray-500">Aspect ratio:</span> <span className="text-white">{project?.aspect_ratio || "16:9"}</span></div>
             <div className="flex justify-between"><span className="text-gray-500">Resolution:</span> <span className="text-white">Adapted AI Gen</span></div>
             <div className="flex justify-between"><span className="text-gray-500">Frame rate:</span> <span className="text-white">30.00fps</span></div>
             <div className="p-3 bg-cyan-900/20 text-cyan-400 border border-cyan-800/50 rounded flex items-center justify-center text-center mt-4">
                Select any clip on the timeline to edit parameters
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
