import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface LivePreviewPlayerProps {
  scenes: any[];
}

export function LivePreviewPlayer({ scenes }: LivePreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration_seconds || 15), 0);
  
  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    let accumulatedTime = scenes.slice(0, currentSceneIdx).reduce((acc, s) => acc + (s.duration_seconds || 15), 0) * 1000;

    const playLoop = () => {
      if (!isPlaying) return;
      const now = Date.now();
      const runTime = accumulatedTime + (now - startTime);
      const prog = Math.min((runTime / (totalDuration * 1000)) * 100, 100);
      setProgress(prog);
      
      // Dispatch custom event for 60fps playhead syncing without React re-renders
      window.dispatchEvent(new CustomEvent('player-progress', { detail: { progress: prog } }));

      // Check if we need to advance scene
      let timeWalker = 0;
      let targetSceneIdx = 0;
      for (let i = 0; i < scenes.length; i++) {
        timeWalker += (scenes[i].duration_seconds || 15) * 1000;
        if (runTime < timeWalker) {
          targetSceneIdx = i;
          break;
        }
      }

      if (targetSceneIdx !== currentSceneIdx && runTime < totalDuration * 1000) {
        setCurrentSceneIdx(targetSceneIdx);
      } else if (runTime >= totalDuration * 1000) {
        setIsPlaying(false);
        setProgress(100);
        setCurrentSceneIdx(scenes.length - 1);
        return;
      }

      animationFrame = requestAnimationFrame(playLoop);
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(playLoop);
      if (videoRef.current) videoRef.current.play().catch(() => {});
      if (audioRef.current) audioRef.current.play().catch(() => {});
    } else {
      if (videoRef.current) videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, currentSceneIdx, scenes, totalDuration]);

  // Handle scene change side effects
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) videoRef.current.play().catch(() => {});
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = scenes[currentSceneIdx]?.audio_volume !== undefined ? scenes[currentSceneIdx].audio_volume : 1;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentSceneIdx, isPlaying, scenes]);

  // Volume changing on the fly
  useEffect(() => {
    if (audioRef.current && scenes[currentSceneIdx]) {
      audioRef.current.volume = scenes[currentSceneIdx].audio_volume !== undefined ? scenes[currentSceneIdx].audio_volume : 1;
    }
  }, [scenes, currentSceneIdx]);

  const togglePlay = () => {
    if (progress >= 100) {
      // restart
      setProgress(0);
      setCurrentSceneIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProg = parseFloat(e.target.value);
    setProgress(newProg);
    const targetRunTime = (newProg / 100) * totalDuration * 1000;
    
    let timeWalker = 0;
    for (let i = 0; i < scenes.length; i++) {
      timeWalker += (scenes[i].duration_seconds || 15) * 1000;
      if (targetRunTime <= timeWalker) {
        setCurrentSceneIdx(i);
        break;
      }
    }
  };

  const currentScene = scenes[currentSceneIdx];

  const brightness = currentScene?.brightness !== undefined ? currentScene.brightness : 100;
  const contrast = currentScene?.contrast !== undefined ? currentScene.contrast : 100;
  const filterStyle = { filter: `brightness(${brightness}%) contrast(${contrast}%)` };

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex flex-col group">
      {currentScene && (
        <div className="absolute inset-0 w-full h-full">
          {currentScene.media_type === 'video' ? (
            <video
              ref={videoRef}
              src={currentScene.media_path}
              className="w-full h-full object-cover transition-all"
              style={filterStyle}
              loop
              muted
              playsInline
              crossOrigin="anonymous"
            />
          ) : (
            <div style={filterStyle} className="w-full h-full transition-all">
               <LazyImage src={currentScene.media_path} alt="scene visual" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Background Audio mapping to TTS */}
          {currentScene.audio_url && (
            <audio ref={audioRef} src={currentScene.audio_url} />
          )}

          {/* Debug/Info Overlay */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Scene {currentSceneIdx + 1} / {scenes.length}
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <input 
          type="range" 
          min="0" max="100" 
          value={progress}
          onChange={handleSeek}
          className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <div className="text-white text-sm font-medium">
              {Math.floor((progress / 100) * totalDuration / 60)}:
              {Math.floor(((progress / 100) * totalDuration) % 60).toString().padStart(2, '0')} 
              / 
              {Math.floor(totalDuration / 60)}:
              {Math.floor(totalDuration % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <button className="text-white hover:text-indigo-400 transition-colors">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isPlaying && progress < 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-16 h-16 bg-indigo-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl pl-1">
            <Play className="w-8 h-8 pointer-events-auto cursor-pointer" onClick={togglePlay} />
          </div>
        </div>
      )}
    </div>
  );
}
