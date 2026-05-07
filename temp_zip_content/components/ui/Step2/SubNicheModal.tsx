import React from 'react';
import { X, Sparkles, ChevronLeft, CheckCircle2 } from 'lucide-react';

const FOCUS_ANGLES = [
  { id: 'beginner_guide', label: 'Beginner Guide', description: 'Step-by-step introduction' },
  { id: 'mistakes', label: 'Mistakes to Avoid', description: 'Common pitfalls & warnings' },
  { id: 'secrets', label: 'Hidden Secrets', description: 'Advanced tips & tricks' },
  { id: 'case_study', label: 'Case Study', description: 'Real-world example breakdown' },
  { id: 'top_list', label: 'Top 10 / Best Of', description: 'Curated list format' },
  { id: 'myth_busting', label: 'Myth Busting', description: 'Debunking common beliefs' }
];

interface SubNicheModalProps {
  activeNicheObj: any;
  modalStep: 1 | 2;
  tempSubNiche: string | null;
  isGeneratingHooks: boolean;
  onSubNicheSelect: (sub: string) => void;
  onAngleSelect: (angle: string) => void;
  onClose: () => void;
  setModalStep: (step: 1 | 2) => void;
}

export function SubNicheModal({
  activeNicheObj,
  modalStep,
  tempSubNiche,
  isGeneratingHooks,
  onSubNicheSelect,
  onAngleSelect,
  onClose,
  setModalStep
}: SubNicheModalProps) {
  if (!activeNicheObj) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {modalStep === 2 && (
                <button 
                  onClick={() => setModalStep(1)}
                  className="text-white/80 hover:text-white mr-1 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <Sparkles className="w-5 h-5 text-white/90" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">AI Assistant</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-white">
            {modalStep === 1 ? 'What specific topic do you want to focus on?' : 'What angle should we take?'}
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            {modalStep === 1 
              ? <>Pick a sub-niche from <span className="font-semibold">{activeNicheObj.emoji} {activeNicheObj.display_name}</span>.</>
              : <>Select a highly effective viral angle for <span className="font-semibold">{tempSubNiche}</span>.</>}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {modalStep === 1 ? (
            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {activeNicheObj.contentPillars?.map((sub: string) => (
                <button
                  key={sub}
                  onClick={() => onSubNicheSelect(sub)}
                  className="group flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 group-hover:border-indigo-300 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-all">
                    <Sparkles className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700 capitalize leading-tight">{sub}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
              {FOCUS_ANGLES.map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => onAngleSelect(angle.label)}
                  disabled={isGeneratingHooks}
                  className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-all duration-200 disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-indigo-300 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-all">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900 group-hover:text-indigo-800 leading-tight mb-0.5">{angle.label}</span>
                    <span className="block text-xs text-gray-500 group-hover:text-indigo-600/80">{angle.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Or keep the generated ideas as-is</p>
            <button
              onClick={onClose}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
