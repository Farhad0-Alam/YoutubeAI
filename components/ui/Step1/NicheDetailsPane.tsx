import React from 'react';
import { TrendingUp } from 'lucide-react';
import { niches } from '../../../lib/niches';

interface NicheDetailsPaneProps {
  selectedNiche: string;
  onOpenTrendResearch: () => void;
}

export function NicheDetailsPane({ selectedNiche, onOpenTrendResearch }: NicheDetailsPaneProps) {
  const active = niches.find(n => n.niche_id === selectedNiche);
  if (!active) return null;

  return (
    <div className="mt-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-lg text-indigo-900 flex items-center gap-2 m-0">
          {active.emoji} {active.display_name} Insights
        </h3>
        <button
          onClick={onOpenTrendResearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Competitor & Trend Research
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Platform Potential</h4>
          <div className="space-y-2">
            {active.platforms && Object.entries(active.platforms).map(([platform, data]) => (
              <div key={platform} className="flex flex-col">
                <div className="flex justify-between items-center text-sm">
                  <span className="capitalize font-medium text-gray-700">{platform}</span>
                  <span className="font-bold text-indigo-600">{data.score}/10</span>
                </div>
                <span className="text-[10px] text-gray-500 truncate">{data.note}</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(data.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Audience & Comp</h4>
          <div className="space-y-2 text-sm text-gray-700">
            {active.audience && (
              <>
                <p><span className="font-medium">Age:</span> {active.audience.age}</p>
                <p><span className="font-medium">Intent:</span> {active.audience.intent}</p>
                <p><span className="font-medium">Retention:</span> {active.audience.retention}</p>
              </>
            )}
            <p><span className="font-medium">Competition:</span> <span className="capitalize">{active.competitionLevel}</span></p>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Monetization</h4>
          <div className="flex flex-wrap gap-1.5">
            {active.monetization?.map(m => (
              <span key={m} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-700">
                {m}
              </span>
            ))}
          </div>
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mt-4 mb-2">Best Styles</h4>
          <div className="flex flex-wrap gap-1.5">
            {active.bestStyles?.map(s => (
              <span key={s} className="px-2 py-1 bg-indigo-100 border border-indigo-200 rounded-md text-[11px] font-medium text-indigo-800 capitalize">
                {s.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
