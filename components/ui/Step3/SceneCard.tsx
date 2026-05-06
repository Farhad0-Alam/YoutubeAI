import { Scene } from '../../../types';
import { Copy, Check, Film } from 'lucide-react';
import { useState } from 'react';
import { useVideoStore } from '../../../store/videoStore';
import { ImagePromptEditor } from './ImagePromptEditor';
import { VideoPromptEditor } from './VideoPromptEditor';

interface SceneCardProps {
  scene: Scene;
  index: number;
  totalScenes?: number;
  onUpdate: (data: Partial<Scene>) => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function SceneCard({ scene, index, totalScenes, onUpdate, onRegenerate, isRegenerating }: SceneCardProps) {
  const { project } = useVideoStore();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-5 gap-4 pr-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-gray-300 tracking-tighter leading-none">
              {(scene.scene_number).toString().padStart(2, '0')}
            </div>
            <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              {scene.duration_seconds} sec
            </div>
          </div>
          
          {/* Read Time & Retention Risk */}
          {(() => {
            const narrationWords = scene.narration ? scene.narration.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
            const readTimeSeconds = Math.round(narrationWords / 2.5); // 150 wpm = 2.5 wps
            const riskLevel = Math.abs(readTimeSeconds - (scene.duration_seconds || 15));
            
            let riskColor = "bg-emerald-500";
            let riskTextColor = "text-emerald-500";
            let riskLabel = "Low Risk";
            
            if (riskLevel > 5) {
              riskColor = "bg-amber-500";
              riskTextColor = "text-amber-500";
              riskLabel = "Medium Risk";
            }
            if (riskLevel > 10) {
              riskColor = "bg-red-500";
              riskTextColor = "text-red-500";
              riskLabel = "High Risk";
            }

            return (
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Read Time:</span>
                  <span className="text-sm font-bold text-gray-700">{readTimeSeconds}s <span className="text-xs font-normal text-gray-400">({narrationWords} words)</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Retention Risk:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${riskTextColor}`}>{riskLabel}</span>
                    <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`${riskColor} h-1.5 rounded-full w-full`}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        
        <div className="flex items-center gap-3">
          {onRegenerate && (
            <button 
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg whitespace-nowrap"
            >
              {isRegenerating ? "Rewriting..." : "Rewrite Scene"}
            </button>
          )}
        </div>
      </div>

        <div className="flex-1 space-y-5">
          <div>
            <ImagePromptEditor
              scene={scene}
              globalAspectRatio={project?.aspect_ratio || '16:9'}
              onUpdate={onUpdate}
            />
          </div>
          
          <VideoPromptEditor
            scene={scene}
            onUpdate={onUpdate}
            sceneIndex={index}
            totalScenes={totalScenes}
          />
        </div>
    </div>
  );
}
