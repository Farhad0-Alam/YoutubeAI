import React from 'react';
import { Film, Camera, Check, Copy, Type, Music2 } from 'lucide-react';
import { NarrationEditor } from './NarrationEditor';

interface SubSceneVideoCardProps {
  sceneIdx: number;
  subIdx: number;
  sub: any;
  scene: any;
  isProMode: boolean;
  hasAiPrompts: boolean;
  totalScenes?: number;
  onUpdate: (field: string, value: string) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  textEnabled: boolean;
  onToggleText: () => void;
  onApplyToAll: (field: string, value: string, label: string) => void;
  buildVideoPrompt: () => string;
}

export function SubSceneVideoCard({
  sceneIdx,
  subIdx,
  sub,
  scene,
  isProMode,
  hasAiPrompts,
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
}: SubSceneVideoCardProps) {
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
    <div className="p-4 space-y-4 bg-emerald-50/10">
      <div className="flex items-center gap-2 mb-2">
        <Film className="w-4 h-4 text-emerald-500" />
        <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">Video Asset</h5>
      </div>

      <div className="relative group">
        <div className="flex flex-wrap items-center justify-between mb-1.5 gap-2">
          <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3 h-3" /> Video Prompt
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <span className="mr-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Include Voice</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={voiceEnabled}
                onChange={onToggleVoice}
              />
              <span className={`relative block w-6 h-3 rounded-full transition-colors ${voiceEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <span className={`absolute left-0.5 top-0.5 h-2 w-2 rounded-full bg-white transition-transform ${voiceEnabled ? 'translate-x-3' : ''}`} />
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <span className="mr-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Include Text</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={textEnabled}
                onChange={onToggleText}
              />
              <span className={`relative block w-6 h-3 rounded-full transition-colors ${textEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <span className={`absolute left-0.5 top-0.5 h-2 w-2 rounded-full bg-white transition-transform ${textEnabled ? 'translate-x-3' : ''}`} />
              </span>
            </label>
            <button
              onClick={() => onUpdate('video_prompt', buildVideoPrompt())}
              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold transition-colors"
            >
              Write to Prompt
            </button>
            <button
              onClick={() => onCopy(buildVideoPrompt(), `vid-ai-${pre}`)}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-[10px] font-semibold transition-colors"
            >
              {copiedId === `vid-ai-${pre}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedId === `vid-ai-${pre}` ? 'Copied!' : 'Copy AI Prompt'}
            </button>
          </div>
        </div>
        <textarea
          value={sub.video_prompt || ''}
          onChange={(e) => onUpdate('video_prompt', e.target.value)}
          className={`w-full rounded-lg p-3 text-xs text-gray-700 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white min-h-[90px] resize-y pr-8 ${hasAiPrompts ? 'bg-emerald-50/40 border border-emerald-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}
          placeholder="Generate prompts or type manually..."
        />
        <CopyBtn text={buildVideoPrompt()} id={`vid-full-btn-${pre}`} className="absolute top-7 right-1.5" />
      </div>

      <NarrationEditor 
        value={sub.narration}
        onChange={(val) => onUpdate('narration', val)}
        label="Narration"
        placeholder="Narration for this sub-scene..."
        className="relative"
        clipDuration={sub.duration_seconds || scene.duration_seconds}
        sceneIndex={sceneIdx}
        totalScenes={totalScenes}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">TEXT OVERLAY & EFFECTS</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">TEXT OVERLAY / CAPTIONS</label>
            <textarea
              value={sub.text_overlay || ''}
              onChange={(e) => onUpdate('text_overlay', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[60px] resize-y"
              placeholder="Overlay text..."
            />
          </div>

          {isProMode && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">POSITION</label>
                <select
                  value={sub.text_position || ''}
                  onChange={(e) => onUpdate('text_position', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="">Default (Center)</option>
                  <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                  <option value="Top Center">Top Center</option>
                  <option value="Bottom Center">Bottom Center</option>
                  <option value="Top Left">Top Left</option>
                  <option value="Top Right">Top Right</option>
                  <option value="Bottom Left">Bottom Left</option>
                  <option value="Bottom Right">Bottom Right</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">ANIMATION</label>
                <select
                  value={sub.text_animation || ''}
                  onChange={(e) => onUpdate('text_animation', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                  <option value="">None / Static</option>
                  <option value="Typewriter">Typewriter</option>
                  <option value="Slide Up Fade">Slide Up Fade</option>
                  <option value="Smooth Pop-up">Smooth Pop-up</option>
                  <option value="Kinetic Typography Reveal">Kinetic Reveal</option>
                  <option value="Data Glitch RGB Split">Data Glitch</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">BOX STYLE</label>
                <select
                  value={sub.text_box_style || ''}
                  onChange={(e) => onUpdate('text_box_style', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                  <option value="">None (Transparent)</option>
                  <option value="Solid Black Box">Solid Black Box</option>
                  <option value="Solid White Box">Solid White Box</option>
                  <option value="Translucent Glassmorphism Box">Glassmorphism</option>
                </select>
              </div>
            </div>
          )}

          {isProMode && (
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">SOUND EFFECT (SFX)</label>
              <input
                type="text"
                value={sub.sound || ''}
                onChange={(e) => onUpdate('sound', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Deep, rumbling ambient sound..."
              />
            </div>
          )}
        </div>
      </div>

      {isProMode && (
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group flex flex-col">
            <label className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Music2 className="w-3 h-3" /> Music
              <GlobalBtn onClick={() => onApplyToAll('music', sub.music || '', 'Music')} />
            </label>
            <input type="text" value={sub.music || ''} onChange={(e) => onUpdate('music', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white" placeholder="Music..." />
            <CopyBtn text={sub.music || ''} id={`mus-${pre}`} className="absolute top-7 right-1.5" />
          </div>
          <div className="relative group flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                Color Grading
                <GlobalBtn onClick={() => onApplyToAll('color_grading', sub.color_grading || '', 'Color Grading')} />
            </label>
            <input type="text" value={sub.color_grading || ''} onChange={(e) => onUpdate('color_grading', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" placeholder="Color grading..." />
          </div>
        </div>
      )}
    </div>
  );
}
