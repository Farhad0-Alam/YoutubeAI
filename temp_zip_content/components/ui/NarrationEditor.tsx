import React from 'react';
import { Volume2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { validateNarration, type NarrationValidation } from '../../lib/voiceLogic';

interface NarrationEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  bgClass?: string;
  borderClass?: string;
  textClass?: string;
  iconClass?: string;
  labelClass?: string;
  /** Scene duration in seconds — enables word budget validation */
  clipDuration?: number;
  /** Scene index (0-based) — used for scene type detection */
  sceneIndex?: number;
  /** Total scenes — used for scene type detection */
  totalScenes?: number;
}

export function NarrationEditor({
  value,
  onChange,
  label = "Voice / Narration",
  placeholder = "Enter narration text...",
  className = "",
  bgClass = "bg-orange-50/40",
  borderClass = "border-orange-100",
  textClass = "text-orange-600",
  iconClass = "text-orange-500",
  labelClass = "text-orange-600",
  clipDuration,
  sceneIndex = 0,
  totalScenes = 1
}: NarrationEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const emotions = ['neutral', 'happy', 'sad', 'angry', 'dramatic', 'whisper', 'shouting', 'terrified', 'excited', 'urgent', 'calm', 'confident', 'curious', 'warm'];

  const insertEmotion = (emotion: string) => {
    if (!emotion || emotion === 'neutral') return;
    const tag = `[${emotion}] `;
    onChange(tag + (value || ''));
  };

  // Word budget validation (only if clipDuration is provided)
  let validation: NarrationValidation | null = null;
  if (clipDuration && clipDuration > 0) {
    validation = validateNarration(value || '', clipDuration, sceneIndex, totalScenes);
  }

  // Simple word count fallback
  const wordCount = (value || '').replace(/\[.*?\]/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className={`text-xs uppercase tracking-wider font-bold flex items-center gap-2 ${labelClass}`}>
          <Volume2 className={`w-4 h-4 ${iconClass}`} /> {label}
        </label>
        <div className="flex items-center gap-2">
          <select 
            onChange={(e) => {
              insertEmotion(e.target.value);
              e.target.value = '';
            }}
            className="text-[10px] uppercase font-bold tracking-wider bg-white border border-orange-200 text-orange-600 rounded px-2 py-1 outline-none hover:bg-orange-50 cursor-pointer"
            title="Insert voice emotion tag"
          >
            <option value="">+ Emotion</option>
            {emotions.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm transition-opacity hover:bg-gray-50"
            title="Copy Narration"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${bgClass} border ${borderClass} rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white min-h-[100px] resize-y transition-all`}
        placeholder={placeholder}
      />

      {/* Word Budget Bar */}
      {validation ? (
        <div className={`flex items-center gap-2 mt-1.5 px-2 py-1.5 rounded-lg ${validation.bgColor} border ${validation.color}`} style={{ borderColor: 'currentColor', borderWidth: '1px' }}>
          <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                validation.status === 'perfect' ? 'bg-emerald-500' :
                validation.status === 'tight' ? 'bg-blue-500' :
                validation.status === 'over' ? 'bg-red-500' :
                validation.status === 'under' ? 'bg-amber-400' : 'bg-gray-300'
              }`}
              style={{ width: `${Math.min((validation.wordCount / validation.budget.safeMax) * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold font-mono shrink-0">
            {validation.wordCount}/{validation.budget.safeMin}–{validation.budget.safeMax} words
          </span>
          <span className="text-[9px] font-semibold shrink-0">
            {validation.status === 'perfect' ? '✅' : validation.status === 'over' ? '🔴' : validation.status === 'under' ? '🟠' : validation.status === 'tight' ? '🟡' : ''}
            {' '}{validation.message}
          </span>
        </div>
      ) : (
        value && (
          <div className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
            {wordCount} words
          </div>
        )
      )}
    </div>
  );
}
