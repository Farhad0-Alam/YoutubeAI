import React from 'react';
import { SubSceneVideoCard } from './SubSceneVideoCard';

interface SubSceneItemProps {
  sceneIdx: number;
  subIdx: number;
  sub: any;
  scene: any;
  isProMode: boolean;
  isGeneratingPrompts?: boolean;
  totalScenes?: number;
  onUpdate: (field: string, value: string) => void;
  onGeneratePrompts?: () => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  textEnabled: boolean;
  onToggleText: () => void;
  onApplyToAll: (field: string, value: string, label: string) => void;
  buildVideoPrompt: () => string;
}

export function SubSceneItem({
  sceneIdx,
  subIdx,
  sub,
  scene,
  isProMode,
  totalScenes,
  onUpdate,
  onCopy,
  copiedId,
  voiceEnabled,
  onToggleVoice,
  textEnabled,
  onToggleText,
  onApplyToAll,
  buildVideoPrompt
}: SubSceneItemProps) {
  const hasAiPrompts = !!sub?.image_prompt;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="font-bold text-gray-800 text-sm">Sub-scene {(scene.scene_number || sceneIdx + 1)}.{subIdx + 1}</div>
        <div className="text-xs text-gray-500 font-medium bg-white px-2.5 py-1 rounded border border-gray-200">
            {sub.timeString}
        </div>
      </div>

      <div className="p-0 grid grid-cols-1 divide-y divide-gray-200">
        <SubSceneVideoCard 
          sceneIdx={sceneIdx}
          subIdx={subIdx}
          sub={sub}
          scene={scene}
          isProMode={isProMode}
          hasAiPrompts={hasAiPrompts}
          onUpdate={onUpdate}
          onCopy={onCopy}
          copiedId={copiedId}
          voiceEnabled={voiceEnabled}
          onToggleVoice={onToggleVoice}
          textEnabled={textEnabled}
          onToggleText={onToggleText}
          onApplyToAll={onApplyToAll}
          totalScenes={totalScenes}
          buildVideoPrompt={buildVideoPrompt}
        />
      </div>
    </div>
  );
}
