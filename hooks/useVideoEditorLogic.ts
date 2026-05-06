import { useState, useRef, useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { toast } from 'sonner';
import { compileAndDownloadVideo } from '../lib/videoCompiler';

export function useVideoEditorLogic(onClose: () => void) {
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

  const handleExport = async () => {
    setExportSettings(prev => ({ ...prev, isExporting: true }));
    try {
      await compileAndDownloadVideo(scenes, project?.aspect_ratio);
      toast.success('Video exported successfully!');
    } catch (e) {
      toast.error('Export failed');
    } finally {
      setExportSettings(prev => ({ ...prev, isExporting: false }));
      setShowExportModal(false);
    }
  };

  return {
    scenes,
    setScenes,
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
    historyLen: history.length
  };
}
