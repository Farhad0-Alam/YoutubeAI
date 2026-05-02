import { useState, useRef, useEffect } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { 
  Play, Pause, Scissors, Type, Music, Image as ImageIcon, 
  Settings, Download, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  Layers, Volume2, Undo, Redo, Trash2, SplitSquareHorizontal, MousePointer2,
  FolderClosed, SlidersHorizontal
} from 'lucide-react';
import { LivePreviewPlayer } from '../ui/LivePreviewPlayer';
import { toast } from 'sonner';
import { compileAndDownloadVideo } from '../../lib/videoCompiler';

export function VideoEditor({ onClose }: { onClose: () => void }) {
  const { scriptData, setScriptData, project } = useVideoStore();
  const [scenes, setScenes] = useState(scriptData?.scenes || []);
  const [history, setHistory] = useState([scriptData?.scenes || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(5); // 1 to 10
  const [activeTab, setActiveTab] = useState('media');
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSettings, setExportSettings] = useState({
     name: project?.title || "Project_0422",
     resolution: "1080p",
     format: "mp4",
     frameRate: "30fps",
     isExporting: false
  });

  const playheadRef = useRef<HTMLDivElement>(null);
  const pxPerSec = zoom * 12;
  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration_seconds || 15), 0);
  const totalWidth = totalDuration * pxPerSec;

  useEffect(() => {
    const handleProgress = (e: any) => {
      if (playheadRef.current) {
        const progress = e.detail.progress; // 0 to 100
        const currentPx = (progress / 100) * totalWidth;
        playheadRef.current.style.transform = `translateX(${currentPx}px)`;
      }
    };
    window.addEventListener('player-progress', handleProgress);
    return () => window.removeEventListener('player-progress', handleProgress);
  }, [totalWidth]);

  const commitScenes = (newScenes: any[]) => {
     setScenes(newScenes);
     const newHistory = history.slice(0, historyIndex + 1);
     newHistory.push(newScenes);
     setHistory(newHistory);
     setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
       setHistoryIndex(historyIndex - 1);
       setScenes(history[historyIndex - 1]);
       setSelectedIdx(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
       setHistoryIndex(historyIndex + 1);
       setScenes(history[historyIndex + 1]);
       setSelectedIdx(null);
    }
  };

  const handleDelete = () => {
    if (selectedIdx === null) return;
    const newScenes = scenes.filter((_, i) => i !== selectedIdx);
    commitScenes(newScenes);
    setSelectedIdx(null);
  };

  const handleSplit = () => {
    if (selectedIdx === null) return;
    const scene = scenes[selectedIdx];
    const half = (scene.duration_seconds || 15) / 2;
    const s1 = { ...scene, duration_seconds: half };
    const s2 = { ...scene, duration_seconds: half };
    const newScenes = [
       ...scenes.slice(0, selectedIdx),
       s1,
       s2,
       ...scenes.slice(selectedIdx + 1)
    ];
    commitScenes(newScenes);
    setSelectedIdx(null);
  };

  const handleSave = () => {
    if (scriptData) {
      setScriptData({ ...scriptData, scenes });
    }
    toast.success('Timeline saved!');
    onClose();
  };

  const handleDownloadMedia = async (e: React.MouseEvent, url: string, sceneNumber: number, mediaType: string) => {
    e.stopPropagation();
    try {
      toast.info(`Downloading media ${sceneNumber}...`);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const extension = mediaType === 'video' ? 'mp4' : 'png';
      a.download = `Scene_${sceneNumber}_Media.${extension}`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error('Direct download failed, opening in new tab');
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-gray-300 flex flex-col font-sans text-xs selection:bg-indigo-500/30">
      {/* Top Menu Bar */}
      <div className="h-12 border-b border-[#2a2a2a] bg-[#181818] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 hover:bg-[#2a2a2a] rounded cursor-pointer transition-colors text-gray-300">
             <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
             <span className="text-[12px] font-medium">Menu</span>
             <ChevronLeft className="w-3 h-3 -rotate-90" />
          </div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 text-gray-300 font-medium text-[13px]">
           {project?.title || "0422"}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-1 rounded text-[11px] font-semibold text-gray-300 cursor-pointer hover:bg-[#333]">
             <span className="w-3 h-3 text-cyan-500">✦</span> Pro
          </div>
          <button 
             onClick={handleSave} 
             className="px-4 py-1.5 border border-[#333] hover:bg-[#222] text-gray-300 rounded font-medium transition-colors text-[12px]"
          >
            Share
          </button>
          <button onClick={() => setShowExportModal(true)} className="px-5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium shadow-sm transition-all flex items-center gap-2 text-[12px]">
            Export
          </button>
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#333]">
             <div className="w-3 h-px bg-gray-400"></div>
             <div className="w-3 h-3 border border-gray-400"></div>
             <X onClick={onClose} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Main Workspace (Top 65%) */}
      <div className="flex flex-1 min-h-[40%] bg-[#0a0a0a] overflow-hidden">
         
         {/* Left Tool Panel */}
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
             {/* Subtabs matching Capcut style roughly */}
             <div className="px-2 py-3 border-b border-[#2a2a2a] space-y-1">
                {['Import', 'Yours', 'AI media', 'Spaces', 'Library'].map((sub, idx) => (
                  <button key={sub} className={`block w-full text-left px-2 py-1 rounded text-xs ${idx === 0 ? 'bg-[#2a2a2a] text-white font-medium' : 'text-gray-400 hover:bg-[#222]'}`}>
                     {sub}
                  </button>
                ))}
             </div>

             {/* Panel Content (Media Pool) */}
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               <div className="flex items-center justify-between mb-4">
                 <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-1.5 rounded disabled:opacity-50 transition-colors mx-auto w-full justify-center">
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
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={scene.media_path} alt={`Media for scene ${i + 1}`} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent flex justify-between">
                        <span className="text-[9px] text-white/80">#{i + 1}</span>
                        <span className="text-[9px] text-white/80">{scene.duration_seconds}s</span>
                      </div>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => scene.media_path && handleDownloadMedia(e, scene.media_path, i + 1, scene.media_type || 'image')}
                           className="bg-black/70 hover:bg-black p-1 rounded backdrop-blur text-white shadow-sm"
                           title={`Download Scene ${i + 1} Media`}
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

         {/* Center Player Panel */}
         <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
             <div className="w-full h-full max-w-4xl max-h-[80%] bg-black rounded overflow-hidden shadow-2xl ring-1 ring-white/5 mx-auto flex items-center justify-center">
                {/* Reusing existing LivePreviewPlayer but constrained nicely */}
                <div className="w-full h-full flex flex-col justify-center">
                   <LivePreviewPlayer scenes={scenes} />
                </div>
             </div>
             <div className="absolute bottom-4 left-0 right-0 flex justify-center text-[10px] text-gray-500">
                Live Dynamic Synthesis Engine
             </div>
         </div>

         {/* Right Properties Panel */}
         <div className="w-[300px] border-l border-[#2a2a2a] bg-[#181818] flex flex-col shrink-0">
           <div className="h-10 border-b border-[#2a2a2a] flex items-center px-4">
             <span className="text-white font-medium">Details</span>
           </div>
           <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
              {selectedIdx !== null ? (
                <>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Scene Duration</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        step="0.1"
                        className="bg-[#2a2a2a] text-white px-2 py-1.5 rounded w-full border-none outline-none focus:ring-1 focus:ring-cyan-500" 
                        value={scenes[selectedIdx].duration_seconds || 15}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 2;
                          const newScenes = [...scenes];
                          newScenes[selectedIdx] = { ...newScenes[selectedIdx], duration_seconds: v };
                          commitScenes(newScenes);
                        }}
                      />
                      <span className="text-gray-500">seconds</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Transition Type</label>
                      <select 
                        className="bg-[#2a2a2a] text-white px-2 py-1.5 rounded w-full border-none outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                        value={scenes[selectedIdx].transition || 'none'}
                        onChange={(e) => {
                          const newScenes = [...scenes];
                          newScenes[selectedIdx] = { ...newScenes[selectedIdx], transition: e.target.value };
                          commitScenes(newScenes);
                        }}
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
                           value={scenes[selectedIdx].transition_duration || 0.5}
                           onChange={(e) => {
                              const v = parseFloat(e.target.value) || 0;
                              const newScenes = [...scenes];
                              newScenes[selectedIdx] = { ...newScenes[selectedIdx], transition_duration: v };
                              commitScenes(newScenes);
                           }}
                         />
                         <span className="text-gray-500 truncate text-[10px]">sec</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Visual Keyword</label>
                    <textarea 
                       className="w-full h-12 bg-[#222] text-gray-300 p-2 rounded text-[11px] resize-none border border-[#333] outline-none focus:border-cyan-500 transition-colors"
                       value={scenes[selectedIdx].search_keyword}
                       onChange={(e) => {
                          const newScenes = [...scenes];
                          newScenes[selectedIdx] = { ...newScenes[selectedIdx], search_keyword: e.target.value };
                          commitScenes(newScenes);
                       }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 border-t border-[#333] pt-4">
                     <div>
                       <label className="text-[10px] text-gray-500 block mb-1">Volume</label>
                       <input 
                         type="range" min="0" max="200"
                         className="w-full h-1 bg-[#333] rounded-full appearance-none accent-cyan-500 cursor-pointer"
                         value={(scenes[selectedIdx].audio_volume !== undefined ? scenes[selectedIdx].audio_volume : 1) * 100}
                         onChange={(e) => {
                            const val = parseInt(e.target.value) / 100;
                            const newScenes = [...scenes];
                            newScenes[selectedIdx] = { ...newScenes[selectedIdx], audio_volume: val };
                            commitScenes(newScenes);
                         }}
                       />
                       <div className="text-[9px] text-gray-600 text-right mt-1">{Math.round((scenes[selectedIdx].audio_volume !== undefined ? scenes[selectedIdx].audio_volume : 1) * 100)}%</div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                     <div>
                       <label className="text-[10px] text-gray-500 block mb-1">Brightness</label>
                       <input 
                         type="range" min="50" max="150"
                         className="w-full h-1 bg-[#333] rounded-full appearance-none accent-cyan-500 cursor-pointer"
                         value={scenes[selectedIdx].brightness !== undefined ? scenes[selectedIdx].brightness : 100}
                         onChange={(e) => {
                            const newScenes = [...scenes];
                            newScenes[selectedIdx] = { ...newScenes[selectedIdx], brightness: parseInt(e.target.value) };
                            commitScenes(newScenes);
                         }}
                       />
                       <div className="text-[9px] text-gray-600 text-right mt-1">{scenes[selectedIdx].brightness !== undefined ? scenes[selectedIdx].brightness : 100}%</div>
                     </div>
                     <div>
                       <label className="text-[10px] text-gray-500 block mb-1">Contrast</label>
                       <input 
                         type="range" min="50" max="150"
                         className="w-full h-1 bg-[#333] rounded-full appearance-none accent-cyan-500 cursor-pointer"
                         value={scenes[selectedIdx].contrast !== undefined ? scenes[selectedIdx].contrast : 100}
                         onChange={(e) => {
                            const newScenes = [...scenes];
                            newScenes[selectedIdx] = { ...newScenes[selectedIdx], contrast: parseInt(e.target.value) };
                            commitScenes(newScenes);
                         }}
                       />
                       <div className="text-[9px] text-gray-600 text-right mt-1">{scenes[selectedIdx].contrast !== undefined ? scenes[selectedIdx].contrast : 100}%</div>
                     </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-[10px] text-gray-500 block mb-1">Voiceover Script</label>
                    <textarea 
                       className="w-full h-16 bg-[#222] text-gray-300 p-2 rounded text-[11px] resize-none border border-[#333] outline-none focus:border-cyan-500 transition-colors"
                       value={scenes[selectedIdx].narration}
                       onChange={(e) => {
                          const newScenes = [...scenes];
                          newScenes[selectedIdx] = { ...newScenes[selectedIdx], narration: e.target.value };
                          commitScenes(newScenes);
                       }}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="text-white">{project?.title || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Timeline name:</span> <span className="text-white">Timeline 01</span></div>
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
      </div>

      {/* Timeline Workspace (Bottom 35%) */}
      <div className="h-[35%] min-h-[250px] border-t border-[#2a2a2a] bg-[#121212] flex flex-col shrink-0 overflow-hidden relative">
         {/* Toolbar */}
         <div className="h-10 border-b border-[#2a2a2a] bg-[#181818] flex items-center justify-between px-4 shrink-0">
            <div className="flex gap-2 isolate relative z-20">
               <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors"><MousePointer2 className="w-3.5 h-3.5" /></button>
               <button onClick={handleSplit} disabled={selectedIdx === null} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><SplitSquareHorizontal className="w-3.5 h-3.5" /></button>
               <div className="w-px h-4 bg-[#333] my-auto mx-1" />
               <button 
                 disabled={selectedIdx === null} 
                 onClick={() => {
                    if (selectedIdx === null) return;
                    const newScenes = [...scenes];
                    if (newScenes[selectedIdx].brightness === undefined || newScenes[selectedIdx].brightness === 100) {
                       newScenes[selectedIdx].brightness = 110; 
                       newScenes[selectedIdx].contrast = 110;
                       commitScenes(newScenes);
                    }
                 }}
                 className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-indigo-400 transition-colors disabled:opacity-30 disabled:text-gray-500" 
                 title="Quick Color Boost (Brightness/Contrast)"
               >
                 <SlidersHorizontal className="w-3.5 h-3.5" />
               </button>
               <div className="w-px h-4 bg-[#333] my-auto mx-1" />
               <button onClick={handleUndo} disabled={historyIndex === 0} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><Undo className="w-3.5 h-3.5" /></button>
               <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><Redo className="w-3.5 h-3.5" /></button>
               <div className="w-px h-4 bg-[#333] my-auto mx-1" />
               <button onClick={handleDelete} disabled={selectedIdx === null} className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-gray-400 transition-colors disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
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
            
            {/* Time Ruler Placeholder */}
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

            {/* Tracks Container */}
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
                                 draggable
                                 onDragStart={(e) => {
                                   e.dataTransfer.setData('source-index', i.toString());
                                 }}
                                 onDragOver={(e) => e.preventDefault()}
                                 onDrop={(e) => {
                                   e.preventDefault();
                                   const sourceIndex = parseInt(e.dataTransfer.getData('source-index'), 10);
                                   if (sourceIndex === i) return;
                                   const newScenes = [...scenes];
                                   const [dragged] = newScenes.splice(sourceIndex, 1);
                                   newScenes.splice(i, 0, dragged);
                                   commitScenes(newScenes);
                                   setSelectedIdx(i);
                                 }}
                                 onClick={() => setSelectedIdx(i)}
                                 className={`h-full border-r border-[#111] relative overflow-hidden flex-shrink-0 cursor-pointer bg-slate-800 transition-all ${selectedIdx === i ? 'ring-1 ring-cyan-500 z-10 brightness-110' : 'hover:brightness-110'}`}
                                 style={{ width: Math.max((scene.duration_seconds || 15) * pxPerSec, 20) }}
                               >
                                  {scene.media_type === 'video' ? (
                                     <video src={scene.media_path} className="w-full h-full object-cover opacity-60" />
                                  ) : (
                                     // eslint-disable-next-line @next/next/no-img-element
                                     <img src={scene.media_path} alt={`Scene ${i + 1}`} className="w-full h-full object-cover opacity-60 pointer-events-none" />
                                  )}
                                  <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/80 pt-1 px-1 text-[9px] text-white truncate pointer-events-none">
                                     {scene.search_keyword}
                                  </div>

                                  {/* Transition Overlay Indicator logic */}
                                  {hasTransition && (
                                     <div 
                                        className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-indigo-500/80 to-indigo-500/20 pointer-events-none border-l border-indigo-400"
                                        style={{ width: transitionWidth }}
                                        title={`Transition: ${scene.transition} (${scene.transition_duration || 0.5}s)`}
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
                              draggable
                              onDragStart={(e) => { e.dataTransfer.setData('s-idx', i.toString()); }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => { e.preventDefault(); const s = parseInt(e.dataTransfer.getData('s-idx')); if(s===i)return; const n=[...scenes]; n.splice(i,0,n.splice(s,1)[0]); commitScenes(n); setSelectedIdx(i); }}
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
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#242424] w-full max-w-[800px] rounded shadow-2xl overflow-hidden flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#282828]">
              <span className="text-gray-200 text-[13px] font-medium">Export-{exportSettings.name}</span>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex gap-6 text-[13px]">
               {/* Left cover preview */}
               <div className="w-[260px] shrink-0 flex flex-col items-center">
                  <div className="w-full aspect-[9/16] bg-[#1a1a1a] rounded-md overflow-hidden relative border border-[#333]">
                     {scenes.length > 0 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={scenes[0].media_path} alt="Cover preview" className="w-full h-full object-cover opacity-80" />
                     )}
                     <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[11px] text-white flex items-center gap-1 cursor-pointer hover:bg-black/70">
                       <ImageIcon className="w-3 h-3" /> Edit cover
                     </div>
                  </div>
               </div>

               {/* Right Settings */}
               <div className="flex-1 space-y-5 text-gray-300">
                  
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                     <span className="text-gray-400">Export timeline</span>
                     <span className="text-gray-500">Timeline 01</span>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                     <span className="text-gray-400">Name</span>
                     <input 
                       className="bg-[#333] text-gray-200 px-3 py-1.5 rounded outline-none border-none focus:ring-1 focus:ring-cyan-500 w-full"
                       value={exportSettings.name}
                       onChange={(e) => setExportSettings({...exportSettings, name: e.target.value})}
                     />
                  </div>

                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                     <span className="text-gray-400">Export to</span>
                     <div className="flex items-center gap-2">
                       <input 
                         className="bg-[#333] text-gray-200 px-3 py-1.5 rounded outline-none border-none w-full truncate"
                         value="G:/MyVideo.mp4"
                         readOnly
                       />
                       <button className="bg-[#333] hover:bg-[#444] p-1.5 rounded transition-colors text-white">
                          <FolderClosed className="w-4 h-4" />
                       </button>
                     </div>
                  </div>

                  <div className="pt-2 border-t border-[#333]">
                     <div className="flex justify-between items-center mb-4">
                       <label className="flex items-center gap-2 select-none cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-cyan-500" />
                          <span className="font-medium text-gray-200">Video</span>
                       </label>
                     </div>

                     <div className="space-y-3">
                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                           <span className="text-gray-400 flex items-center gap-1">AI ultra HD <span className="text-cyan-500">✦</span></span>
                           <div className="flex justify-end">
                              <div className="w-8 h-4 bg-[#444] rounded-full relative cursor-pointer">
                                 <div className="absolute left-1 top-0.5 w-3 h-3 bg-gray-300 rounded-full"></div>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                           <span className="text-gray-400">Resolution</span>
                           <select 
                             className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer"
                             value={exportSettings.resolution}
                             onChange={(e) => setExportSettings({...exportSettings, resolution: e.target.value})}
                           >
                              <option value="1080p">1080p</option>
                              <option value="4K">4K</option>
                              <option value="720p">720p</option>
                           </select>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                           <span className="text-gray-400">Bit rate</span>
                           <select className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer">
                              <option>Recommended</option>
                              <option>High</option>
                              <option>Custom</option>
                           </select>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                           <span className="text-gray-400">Codec</span>
                           <select className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer">
                              <option>H.264</option>
                              <option>HEVC</option>
                           </select>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                           <span className="text-gray-400">Format</span>
                           <select 
                             className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer"
                             value={exportSettings.format}
                             onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                           >
                              <option value="mp4">mp4</option>
                              <option value="mov">mov</option>
                           </select>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                           <span className="text-gray-400">Frame rate</span>
                           <select 
                             className="bg-[#333] text-gray-300 px-2 py-1.5 rounded outline-none border-none w-full cursor-pointer"
                             value={exportSettings.frameRate}
                             onChange={(e) => setExportSettings({...exportSettings, frameRate: e.target.value})}
                           >
                              <option value="30fps">30fps</option>
                              <option value="60fps">60fps</option>
                              <option value="24fps">24fps</option>
                           </select>
                        </div>
                        
                        <div className="grid grid-cols-[100px_1fr] items-center gap-4 pb-2">
                           <span className="text-gray-400 flex items-center gap-1">Optical flow <span className="text-cyan-500">✦</span></span>
                           <div className="flex justify-end">
                              <div className="w-8 h-4 bg-[#444] rounded-full relative cursor-pointer">
                                 <div className="absolute left-1 top-0.5 w-3 h-3 bg-gray-300 rounded-full"></div>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4 pt-3 border-t border-[#333]">
                           <span className="text-gray-500">Color space</span>
                           <span className="text-gray-400">Rec. 709 SDR</span>
                        </div>

                     </div>
                  </div>

                  <div className="pt-2 border-t border-[#333]">
                     <label className="flex items-center gap-2 select-none cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-cyan-500" />
                        <span className="text-gray-300">Sync exported videos to space</span>
                     </label>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="h-16 border-t border-[#333] bg-[#282828] px-6 flex items-center justify-between">
               <div className="flex flex-col text-gray-400 text-[11px]">
                  <div className="flex items-center gap-1"><Layers className="w-3.5 h-3.5"/> Duration: {Math.floor(totalDuration / 60)}m {Math.floor(totalDuration % 60)}s | Size: about 419 MB</div>
               </div>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setShowExportModal(false)}
                   className="px-6 py-1.5 bg-[#444] hover:bg-[#555] rounded text-gray-200 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                    onClick={async () => {
                       setExportSettings({...exportSettings, isExporting: true});
                       await compileAndDownloadVideo(scenes, project?.aspect_ratio);
                       setExportSettings({...exportSettings, isExporting: false});
                       setShowExportModal(false);
                    }}
                    disabled={exportSettings.isExporting}
                    className="px-8 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                 >
                    {exportSettings.isExporting ? 'Exporting...' : 'Export'}
                 </button>
               </div>
            </div>

          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
