import React from 'react';
import { Camera, Wand2 } from 'lucide-react';
import { SubSceneItem } from './SubSceneItem';

interface SceneStoryboardCardProps {
  index: number;
  scene: any;
  chunkInterval: number;
  isProMode: boolean;
  totalScenes?: number;
  generatingScene: number | null;
  generatingAll: boolean;
  generatingImages: Record<string, boolean>;
  onGenerateSubScenes: (index: number) => void;
  onGeneratePreviewImage: (sceneIdx: number, subIdx: number) => void;
  onSubSceneUpdate: (sceneIdx: number, subIdx: number, field: string, value: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  voiceToggles: Record<string, boolean>;
  onToggleVoice: (sceneIdx: number, subIdx: number) => void;
  textToggles: Record<string, boolean>;
  onToggleText: (sceneIdx: number, subIdx: number) => void;
  onApplyToAll: (field: string, value: string, label: string) => void;
  buildVideoPrompt: (sceneIdx: number, subIdx: number) => string;
  buildImagePrompt: (sceneIdx: number, subIdx: number) => string;
  splitText: (text: string, n: number) => string[];
}

export function SceneStoryboardCard({
  index,
  scene,
  chunkInterval,
  isProMode,
  totalScenes,
  generatingScene,
  generatingAll,
  generatingImages,
  onGenerateSubScenes,
  onGeneratePreviewImage,
  onSubSceneUpdate,
  onCopy,
  copiedId,
  voiceToggles,
  onToggleVoice,
  textToggles,
  onToggleText,
  onApplyToAll,
  buildVideoPrompt,
  buildImagePrompt,
  splitText
}: SceneStoryboardCardProps) {
  const totalSeconds = scene.duration_seconds || 15;
  const numSubScenes = scene.sub_scenes?.length || Math.max(1, Math.ceil(totalSeconds / chunkInterval));
  const actualInterval = scene.sub_scenes?.length ? (totalSeconds / scene.sub_scenes.length).toFixed(1) : chunkInterval;

  const subScenesMeta = Array.from({ length: numSubScenes }).map((_, i) => {
    const start = Math.floor(i * (totalSeconds / numSubScenes));
    const end = Math.floor((i + 1) * (totalSeconds / numSubScenes));
    return { id: i + 1, timeString: `0:${start.toString().padStart(2, '0')} - 0:${end.toString().padStart(2, '0')}` };
  });

  const narSlices = splitText(scene.narration || '', numSubScenes);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Scene Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-indigo-50/50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {(scene.scene_number || index + 1).toString().padStart(2, '0')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Scene {scene.scene_number || index + 1}</h3>
            <span className="text-xs text-gray-500 font-medium">{totalSeconds}s · {numSubScenes} sub-scenes · ~{actualInterval}s each</span>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
          {scene.transition || 'cut'}
        </span>
      </div>

      {/* Sub-Scenes */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Sub-Scene Breakdown</h4>
            <span className="text-[9px] font-medium text-white bg-indigo-500 px-2 py-0.5 rounded-full">Detailed Mode</span>
          </div>
          <button
            onClick={() => onGenerateSubScenes(index)}
            disabled={generatingScene !== null || generatingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {generatingScene === index ? (
              <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600" /> Generating...</>
            ) : (
              <><Wand2 className="w-3.5 h-3.5" /> Generate Prompts</>
            )}
          </button>
        </div>

        <div className="space-y-5">
          {subScenesMeta.map((subMeta, subIdx) => {
            const sub = (scene.sub_scenes?.[subIdx] as any) || { timeString: subMeta.timeString };
            if (!sub.timeString) sub.timeString = subMeta.timeString;
            if (!sub.narration) sub.narration = narSlices[subIdx];

            return (
              <SubSceneItem
                key={subMeta.id}
                sceneIdx={index}
                subIdx={subIdx}
                sub={sub}
                scene={scene}
                isProMode={isProMode}
                isGeneratingImage={generatingImages[`${index}-${subIdx}`]}
                isGeneratingPrompts={generatingScene === index}
                onUpdate={(field, value) => onSubSceneUpdate(index, subIdx, field, value)}
                onGenerateImage={() => onGeneratePreviewImage(index, subIdx)}
                onGeneratePrompts={() => onGenerateSubScenes(index)}
                onCopy={onCopy}
                copiedId={copiedId}
                voiceEnabled={voiceToggles[`${index}-${subIdx}`] ?? true}
                onToggleVoice={() => onToggleVoice(index, subIdx)}
                textEnabled={textToggles[`${index}-${subIdx}`] ?? true}
                onToggleText={() => onToggleText(index, subIdx)}
                onApplyToAll={onApplyToAll}
                totalScenes={totalScenes}
                buildVideoPrompt={() => buildVideoPrompt(index, subIdx)}
                buildImagePrompt={() => buildImagePrompt(index, subIdx)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
