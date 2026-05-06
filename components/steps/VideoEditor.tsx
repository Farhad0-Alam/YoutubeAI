import React from 'react';
import { useVideoEditorLogic } from '../../hooks/useVideoEditorLogic';
import { EditorHeader } from '../ui/Editor/EditorHeader';
import { EditorSidebar } from '../ui/Editor/EditorSidebar';
import { EditorPropertiesPanel } from '../ui/Editor/EditorPropertiesPanel';
import { EditorTimeline } from '../ui/Editor/EditorTimeline';
import { ExportModal } from '../ui/Editor/ExportModal';
import { LivePreviewPlayer } from '../ui/LivePreviewPlayer';

export function VideoEditor({ onClose }: { onClose: () => void }) {
  const {
    scenes,
    project,
    selectedIdx,
    setSelectedIdx,
    zoom,
    setZoom,
    activeTab,
    setActiveTab,
    showExportModal,
    setShowExportModal,
    exportSettings,
    setExportSettings,
    playheadRef,
    pxPerSec,
    totalDuration,
    totalWidth,
    handleUndo,
    handleRedo,
    handleDelete,
    handleSplit,
    handleSave,
    handleExport,
    commitScenes,
    historyIndex,
    historyLen
  } = useVideoEditorLogic(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-gray-300 flex flex-col font-sans text-xs selection:bg-indigo-500/30">
      
      <EditorHeader 
        projectTitle={project?.title || "0422"}
        onSave={handleSave}
        onExportClick={() => setShowExportModal(true)}
        onClose={onClose}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 min-h-[40%] bg-[#0a0a0a] overflow-hidden">
         <EditorSidebar 
           activeTab={activeTab}
           setActiveTab={setActiveTab}
           scenes={scenes}
           selectedIdx={selectedIdx}
           setSelectedIdx={setSelectedIdx}
         />

         {/* Center Player */}
         <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
             <div className="w-full h-full max-w-4xl max-h-[80%] bg-black rounded overflow-hidden shadow-2xl ring-1 ring-white/5 mx-auto flex items-center justify-center">
                <div className="w-full h-full flex flex-col justify-center">
                   <LivePreviewPlayer scenes={scenes} />
                </div>
             </div>
             <div className="absolute bottom-4 left-0 right-0 flex justify-center text-[10px] text-gray-500">
                Live Dynamic Synthesis Engine
             </div>
         </div>

         <EditorPropertiesPanel 
           selectedIdx={selectedIdx}
           scenes={scenes}
           commitScenes={commitScenes}
           project={project}
         />
      </div>

      <EditorTimeline 
        scenes={scenes}
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
        zoom={zoom}
        setZoom={setZoom}
        pxPerSec={pxPerSec}
        totalDuration={totalDuration}
        playheadRef={playheadRef}
        onSplit={handleSplit}
        onDelete={handleDelete}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyLen - 1}
        commitScenes={commitScenes}
      />

      {showExportModal && (
        <ExportModal 
          name={exportSettings.name}
          setName={(v) => setExportSettings({...exportSettings, name: v})}
          resolution={exportSettings.resolution}
          setResolution={(v) => setExportSettings({...exportSettings, resolution: v})}
          format={exportSettings.format}
          setFormat={(v) => setExportSettings({...exportSettings, format: v})}
          frameRate={exportSettings.frameRate}
          setFrameRate={(v) => setExportSettings({...exportSettings, frameRate: v})}
          isExporting={exportSettings.isExporting}
          onExport={handleExport}
          onClose={() => setShowExportModal(false)}
          totalDuration={totalDuration}
          thumbnail={scenes[0]?.media_path}
        />
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
