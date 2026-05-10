import React from 'react';
import { Loader2, Film, Scissors, SkipForward, Mic, Video, CheckCircle2, Sparkles } from 'lucide-react';
import { VoiceSelector } from '../VoiceSelector';
import type { GrokMode, PipelineStage } from '../../../hooks/useRenderExportLogic';

interface RenderSettingsViewProps {
  voices: any[];
  selectedVoice: string;
  setSelectedVoice: (id: string) => void;
  grokMode: GrokMode;
  setGrokMode: (mode: GrokMode) => void;
  pipelineStage: PipelineStage;
  grokProgress: { completed: number; total: number; message: string };
  isPrepping: boolean;
  onStartRender: () => void;
  onBack: () => void;
}

const STAGE_STEPS = [
  { id: 'tts',   icon: Mic,           label: 'Voiceover (edge-tts)' },
  { id: 'grok',  icon: Video,         label: 'Grok Video Clips'     },
  { id: 'done',  icon: CheckCircle2,  label: 'Pipeline Complete'    },
];

export function RenderSettingsView({
  voices,
  selectedVoice,
  setSelectedVoice,
  grokMode,
  setGrokMode,
  pipelineStage,
  grokProgress,
  isPrepping,
  onStartRender,
  onBack
}: RenderSettingsViewProps) {

  const grokOptions: { id: GrokMode; icon: typeof Film; label: string; desc: string; badge?: string; color?: string }[] = [
    {
      id: 'grok_voice',
      icon: Sparkles,
      label: 'Grok Voice + Video',
      desc: 'Grok Aurora generates BOTH video and narration voice in one step — no TTS needed',
      badge: 'RECOMMENDED',
      color: 'violet'
    },
    {
      id: 'single',
      icon: Film,
      label: 'One Clip + Edge-TTS',
      desc: 'Grok video clip + separate edge-tts narration audio per scene',
      color: 'indigo'
    },
    {
      id: 'sub_clips',
      icon: Scissors,
      label: 'Sub-Clips + Edge-TTS',
      desc: 'Split scene into 2-3s Grok clips + edge-tts voice track',
      color: 'indigo'
    },
    {
      id: 'skip',
      icon: SkipForward,
      label: 'Skip Grok',
      desc: 'Skip video generation — use stock footage or external tools',
      color: 'gray'
    },
  ];

  const activeStageIdx = STAGE_STEPS.findIndex(s => s.id === pipelineStage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Voice Config */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5 text-indigo-500" />
          Voice Configuration
        </h2>
        <label className="block text-sm font-semibold text-gray-700 mb-3">AI Voice Talent</label>
        <VoiceSelector voices={voices} selectedId={selectedVoice} onSelect={setSelectedVoice} />
      </div>

      {/* Grok Video Mode */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Video className="w-5 h-5 text-violet-500" />
          Grok Video Generation
        </h2>
        <p className="text-xs text-gray-400 mb-4">Choose how video clips are generated for each scene via xAI Aurora</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {grokOptions.map(opt => {
            const Icon = opt.icon;
            const active = grokMode === opt.id;
            const accentColor = opt.color === 'violet' ? 'violet' : opt.color === 'gray' ? 'gray' : 'indigo';
            return (
              <button
                key={opt.id}
                onClick={() => setGrokMode(opt.id)}
                className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                  active
                    ? accentColor === 'violet' ? 'border-violet-500 bg-violet-50'
                    : accentColor === 'gray' ? 'border-gray-400 bg-gray-50'
                    : 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {opt.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold bg-violet-500 text-white px-1.5 py-0.5 rounded-full tracking-wider">
                    {opt.badge}
                  </span>
                )}
                <div className={`p-1.5 rounded-lg ${
                  active
                    ? accentColor === 'violet' ? 'bg-violet-500 text-white'
                    : accentColor === 'gray' ? 'bg-gray-500 text-white'
                    : 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-bold ${
                  active
                    ? accentColor === 'violet' ? 'text-violet-700'
                    : accentColor === 'gray' ? 'text-gray-700'
                    : 'text-indigo-700'
                    : 'text-gray-700'
                }`}>{opt.label}</span>
                <span className="text-[11px] text-gray-500 leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Progress (shown only when running) */}
      {isPrepping && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Pipeline Progress</h2>
          <div className="space-y-3">
            {STAGE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = activeStageIdx > idx;
              const isActive = activeStageIdx === idx;
              return (
                <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isDone ? 'border-emerald-200 bg-emerald-50' :
                  isActive ? 'border-indigo-200 bg-indigo-50' :
                  'border-gray-100 bg-gray-50 opacity-50'
                }`}>
                  <div className={`p-1.5 rounded-full ${
                    isDone ? 'bg-emerald-500 text-white' :
                    isActive ? 'bg-indigo-500 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{step.label}</div>
                    {isActive && step.id === 'grok' && grokProgress.total > 0 && (
                      <div className="mt-1">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>{grokProgress.message}</span>
                          <span>{grokProgress.completed}/{grokProgress.total}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full transition-all duration-500"
                            style={{ width: `${grokProgress.total > 0 ? (grokProgress.completed / grokProgress.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {isActive && step.id === 'tts' && (
                      <div className="text-[11px] text-indigo-600 mt-0.5">Generating voice for all scenes...</div>
                    )}
                  </div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
              );
            })}
          </div>
          {pipelineStage === 'grok' && (
            <p className="text-[11px] text-gray-400 mt-3 text-center">
              Grok Aurora takes ~30-90s per clip. Please wait...
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onBack}
          disabled={isPrepping}
          className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-40"
        >
          Back to Thumbnail
        </button>
        <button
          onClick={onStartRender}
          disabled={isPrepping}
          className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPrepping
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Running Pipeline...</>
            : grokMode === 'grok_voice'
              ? '✨ Generate Grok Voice + Video'
              : grokMode === 'skip'
                ? '🎙️ Generate Voiceover Only'
                : '🚀 Generate Voiceover + Grok Video'
          }
        </button>
      </div>
    </div>
  );
}
