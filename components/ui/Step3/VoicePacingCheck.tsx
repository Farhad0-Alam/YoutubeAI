import React from 'react';
import { validateNarration, calculateScriptBudget, type SceneType, detectSceneType } from '../../../lib/voiceLogic';

interface Scene {
  narration?: string;
  duration_seconds?: number;
  transition?: string;
}

interface VoicePacingCheckProps {
  scenes: Scene[];
  totalDurationSeconds?: number;
}

export function VoicePacingCheck({ scenes, totalDurationSeconds }: VoicePacingCheckProps) {
  const totalScenes = scenes.length;
  const budget = calculateScriptBudget(scenes);

  // Per-scene validations
  const validations = scenes.map((scene, idx) =>
    validateNarration(
      scene.narration || '',
      scene.duration_seconds || 10,
      idx,
      totalScenes
    )
  );

  const totalWords = validations.reduce((sum, v) => sum + v.wordCount, 0);
  const perfectCount = validations.filter(v => v.status === 'perfect').length;
  const overCount = validations.filter(v => v.status === 'over').length;
  const underCount = validations.filter(v => v.status === 'under').length;

  // Overall script health
  const scriptHealth = overCount === 0 && underCount === 0
    ? 'All Clear'
    : overCount > 0
      ? `${overCount} scene${overCount > 1 ? 's' : ''} OVER`
      : `${underCount} scene${underCount > 1 ? 's' : ''} SHORT`;

  const healthColor = overCount > 0
    ? 'text-red-600 bg-red-50 border-red-200'
    : underCount > 0
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  const sceneTypeLabel = (type: SceneType) => {
    switch (type) {
      case 'hook': return '🎯 Hook';
      case 'cta': return '📢 CTA';
      default: return '📹 Body';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'perfect': return '✅';
      case 'tight': return '🟡';
      case 'over': return '🔴';
      case 'under': return '🟠';
      default: return '⬜';
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        Voice & Word Budget Engine
      </h2>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`border rounded-lg p-4 ${healthColor}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Script Health</div>
          <div className="text-xl font-bold">{scriptHealth}</div>
          <div className="text-xs mt-1 font-semibold">{perfectCount}/{totalScenes} perfect</div>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Words</div>
          <div className="text-xl font-bold text-gray-800">{totalWords}</div>
          <div className="text-xs text-gray-500 mt-1">Target: {budget.totalMinWords}–{budget.totalMaxWords}</div>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Duration</div>
          <div className="text-xl font-bold text-gray-800">{Math.floor(budget.totalDuration / 60)}m {budget.totalDuration % 60}s</div>
          <div className="text-xs text-gray-500 mt-1">{totalScenes} scenes</div>
        </div>
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Emotion Tags</div>
          <div className="text-xl font-bold text-gray-800">
            {validations.filter(v => (v.budget.preset.emotion)).length}/{totalScenes}
          </div>
          <div className="text-xs text-gray-500 mt-1">Auto-assigned by AI</div>
        </div>
      </div>

      {/* Per-Scene Timeline */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Per-Scene Word Budget</div>
        {validations.map((v, idx) => {
          const sceneType = detectSceneType(idx, totalScenes);
          const pct = v.budget.safeMax > 0 ? Math.min((v.wordCount / v.budget.safeMax) * 100, 120) : 0;
          const barColor = v.status === 'perfect' ? 'bg-emerald-500'
            : v.status === 'tight' ? 'bg-blue-500'
            : v.status === 'over' ? 'bg-red-500'
            : v.status === 'under' ? 'bg-amber-400'
            : 'bg-gray-200';

          return (
            <div key={idx} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${v.bgColor} ${v.color} border-opacity-50`} style={{ borderColor: 'currentColor', borderWidth: '1px' }}>
              <span className="text-[10px] font-bold w-14 shrink-0">{statusIcon(v.status)} S{idx + 1}</span>
              <span className="text-[9px] font-bold w-14 shrink-0 opacity-70">{sceneTypeLabel(sceneType)}</span>
              <span className="text-[10px] w-10 shrink-0 text-center font-mono">{v.budget.clipDuration}s</span>
              <div className="flex-1 h-3 bg-white/60 rounded-full overflow-hidden relative">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                {pct > 100 && <div className="absolute right-0 top-0 h-full w-1 bg-red-700 animate-pulse" />}
              </div>
              <span className="text-[10px] font-bold w-20 shrink-0 text-right font-mono">
                {v.wordCount}/{v.budget.safeMin}–{v.budget.safeMax}
              </span>
              <span className="text-[9px] w-24 shrink-0 text-right truncate opacity-80">{v.message}</span>
            </div>
          );
        })}
      </div>

      {/* Formula Reference */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-[9px] font-mono text-gray-500 leading-relaxed">
          <span className="font-bold text-gray-700">FORMULA:</span> usable_seconds = clip_duration × (1 - breath_overhead) → max_words = usable_seconds × (WPM ÷ 60) → safe_range = 75%–100%
        </div>
      </div>
    </div>
  );
}
