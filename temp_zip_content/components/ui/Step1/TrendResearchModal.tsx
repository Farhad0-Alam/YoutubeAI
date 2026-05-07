import React from 'react';
import { X, TrendingUp, Youtube, Search } from 'lucide-react';
import { niches } from '../../../lib/niches';
import { toast } from 'sonner';

interface TrendResearchModalProps {
  selectedNiche: string;
  onClose: () => void;
}

export function TrendResearchModal({ selectedNiche, onClose }: TrendResearchModalProps) {
  const active = niches.find(n => n.niche_id === selectedNiche);
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Competitor & Trend Research</h2>
              <p className="text-xs text-gray-500 font-medium">{active.display_name} Niche Insights</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">Top Performing Angles</h3>
              <p className="text-xs text-gray-500">Based on recent algorithm bumps and audience retention data.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1"><Search className="w-3 h-3"/> Live Data Sync</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mock Video 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 h-28 bg-gray-900 rounded-lg overflow-hidden relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                  <div className="text-[10px] font-bold text-white mb-0.5" style={{ color: active.thumbnail_colors?.accent || '#FFF' }}>{active.thumbnail_emotion?.toUpperCase() || 'URGENT'}</div>
                  <div className="text-xs font-bold text-white leading-tight">THE TRUTH THEY HIDE</div>
                </div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Youtube className="w-3 h-3" /> VIRAL
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{active.title_formula?.replace('[Number]', '7').replace('[Topic]', active.keywords?.[0] || 'Secrets').replace('[Outcome]', 'Will Shock You').replace('[Timeframe]', 'in 2025') || 'Amazing Viral Video Concept'}</h4>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 ml-2 whitespace-nowrap">2.4M Views</div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Hook: <span className="font-semibold text-gray-700 capitalize">{active.hook_style?.replace('_', ' ') || 'Curiosity'}</span></div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Pacing: <span className="font-semibold text-gray-700">Fast (2s cuts)</span></div>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <button onClick={() => { onClose(); toast.success("Applied 'Improve on this' framework to Hook generator!"); }} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Improve on this
                  </button>
                  <button onClick={() => { onClose(); toast.success("Applied 'Differentiate' framework to Hook generator!"); }} className="flex-1 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Differentiate (Pivot)
                  </button>
                </div>
              </div>
            </div>

            {/* Mock Video 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 h-28 bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                  <div className="text-[10px] font-bold text-white mb-0.5" style={{ color: active.thumbnail_colors?.primary_text || '#FFF' }}>{active.keywords?.[1]?.toUpperCase() || 'EXPOSED'}</div>
                  <div className="text-xs font-bold text-white leading-tight">STOP DOING THIS</div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2">Why 99% of people fail at {active.keywords?.[0] || 'this'} (And how to fix it)</h4>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 ml-2 whitespace-nowrap">890K Views</div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Hook: <span className="font-semibold text-gray-700">Contrarian Claim</span></div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Style: <span className="font-semibold text-gray-700 capitalize">{active.bestStyles?.[0] || 'Cinematic'}</span></div>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <button onClick={() => { onClose(); toast.success("Applied 'Improve on this' framework to Hook generator!"); }} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Improve on this
                  </button>
                  <button onClick={() => { onClose(); toast.success("Applied 'Differentiate' framework to Hook generator!"); }} className="flex-1 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Differentiate (Pivot)
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
