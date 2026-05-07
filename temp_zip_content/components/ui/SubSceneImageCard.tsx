import React from 'react';
import { Image as ImageIcon, Check, Copy, Sparkles, Wand2 } from 'lucide-react';

interface SubSceneImageCardProps {
  sceneIdx: number;
  subIdx: number;
  sub: any;
  scene: any;
  isProMode: boolean;
  isGeneratingImage: boolean;
  isGeneratingPrompts: boolean;
  hasAiPrompts: boolean;
  onUpdate: (field: string, value: string) => void;
  onGenerateImage: () => void;
  onGeneratePrompts: () => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onApplyToAll: (field: string, value: string, label: string) => void;
  buildImagePrompt: () => string;
}

export function SubSceneImageCard({
  sceneIdx,
  subIdx,
  sub,
  scene,
  isProMode,
  isGeneratingImage,
  isGeneratingPrompts,
  hasAiPrompts,
  onUpdate,
  onGenerateImage,
  onGeneratePrompts,
  onCopy,
  copiedId,
  onApplyToAll,
  buildImagePrompt
}: SubSceneImageCardProps) {
  const pre = `${sceneIdx}-${subIdx}`;

  const CopyBtn = ({ text, id, className = '' }: { text: string; id: string; className?: string }) => (
    <button
      onClick={() => onCopy(text, id)}
      className={`p-1.5 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 focus:opacity-100 ${className}`}
      title="Copy"
    >
      {copiedId === id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
    </button>
  );

  const GlobalBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="ml-auto opacity-0 group-hover:opacity-100 text-[8px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded transition-all border border-indigo-100 uppercase tracking-wider"
      title="Apply this value to all sub-scenes globally"
    >
      Apply All
    </button>
  );

  return (
    <div className="p-4 space-y-4 bg-indigo-50/10">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="w-4 h-4 text-indigo-500" />
        <h5 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded">Image Asset</h5>
      </div>

      <div
        onClick={() => hasAiPrompts && !isGeneratingImage && onGenerateImage()}
        className={`w-full aspect-video ${sub?.preview_url ? 'bg-black' : 'bg-indigo-50/50'} border-2 ${sub?.preview_url ? 'border-indigo-500' : 'border-dashed border-indigo-200'} rounded-lg flex flex-col items-center justify-center overflow-hidden relative group/img ${hasAiPrompts ? 'cursor-pointer hover:bg-indigo-50' : 'cursor-not-allowed opacity-60'} transition-colors mb-4`}
      >
        {sub?.preview_url ? (
          <img src={sub.preview_url} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <>
            {isGeneratingImage ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600">Generating...</span>
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-indigo-300 mb-2 group-hover/img:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-indigo-600">Image Preview Slot</span>
                <span className="text-[10px] text-indigo-400">Click to generate preview</span>
              </>
            )}
          </>
        )}
      </div>

      <div className="relative group">
        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          Image Prompt
          {!hasAiPrompts && (
            <button
              onClick={onGeneratePrompts}
              disabled={isGeneratingPrompts}
              className="text-[9px] text-indigo-400 normal-case hover:text-indigo-700 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {isGeneratingPrompts ? <div className="animate-spin rounded-full h-2 w-2 border-b border-indigo-600" /> : <Wand2 className="w-2.5 h-2.5" />}
              (click Generate Prompts)
            </button>
          )}
        </label>
        <textarea
          value={sub.image_prompt || ''}
          onChange={(e) => onUpdate('image_prompt', e.target.value)}
          className={`w-full rounded-lg p-3 text-xs text-gray-700 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white min-h-[90px] resize-y pr-8 ${hasAiPrompts ? 'bg-indigo-50/40 border border-indigo-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}
          placeholder="Generate prompts or type manually..."
        />
        <CopyBtn text={buildImagePrompt()} id={`img-full-btn-${pre}`} className="absolute top-7 right-1.5" />
      </div>

      {isProMode && (
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group flex flex-col">
            <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> VFX
              <GlobalBtn onClick={() => onApplyToAll('vfx', sub.vfx || '', 'VFX')} />
            </label>
            <input type="text" value={sub.vfx || ''} onChange={(e) => onUpdate('vfx', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white" placeholder="VFX effects..." />
            <CopyBtn text={sub.vfx || ''} id={`vfx-${pre}`} className="absolute top-7 right-1.5" />
          </div>
          <div className="relative group flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
              Camera Motion
              <GlobalBtn onClick={() => onApplyToAll('camera_motion', sub.camera_motion || '', 'Camera Motion')} />
            </label>
            <input type="text" value={sub.camera_motion || ''} onChange={(e) => onUpdate('camera_motion', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" placeholder="Camera direction..." />
          </div>
        </div>
      )}

      {isProMode && (
        <div className="pt-3 border-t border-indigo-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Detailed Image Options</div>
            <button
              onClick={() => onCopy(buildImagePrompt(), `img-full-${pre}`)}
              className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-[10px] font-semibold transition-colors"
            >
              {copiedId === `img-full-${pre}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedId === `img-full-${pre}` ? 'Copied!' : 'Copy Full Image Prompt'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Subject', 'image_subject'],
              ['Setting / Background', 'image_setting'],
              ['Mood', 'image_mood'],
              ['Lighting Style', 'image_lighting'],
              ['Color Grade', 'image_color_grade'],
              ['Camera Angle', 'image_camera_angle'],
              ['Shot Type', 'image_shot_type'],
              ['Style Modifier', 'image_style_modifier'],
              ['Aspect Ratio', 'image_aspect_ratio'],
              ['Seed', 'image_seed'],
              ['Quality Suffix', 'image_quality'],
              ['Character Ref', 'image_character_consistency'],
              ['Negative Prompt', 'image_negative_prompt'],
            ].map(([label, key]) => (
              <div key={key} className="relative group flex flex-col">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                  {label}
                  <GlobalBtn onClick={() => onApplyToAll(key, sub[key] || '', label)} />
                </label>
                <input
                  type="text"
                  value={sub[key] || ''}
                  onChange={(e) => onUpdate(key as any, e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
