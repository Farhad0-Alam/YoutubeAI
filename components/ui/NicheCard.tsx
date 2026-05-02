import { NicheConfig } from '../../types';
import { CPMBadge } from './CPMBadge';
import { CheckCircle2 } from 'lucide-react';

interface NicheCardProps {
  niche: NicheConfig;
  selected: boolean;
  onClick: () => void;
}

export function NicheCard({ niche, selected, onClick }: NicheCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-xl cursor-pointer transition-all duration-200 group border bg-white flex flex-col justify-between ${
        selected ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600' : 'border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 text-indigo-600">
          <CheckCircle2 className="w-5 h-5 fill-indigo-100" />
        </div>
      )}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left w-max">{niche.emoji}</div>
      <div>
        <h3 className="text-gray-900 font-semibold text-[15px] mb-2 leading-tight">{niche.display_name}</h3>
        <CPMBadge range={niche.estimated_cpm_range} tier={niche.tier} />
      </div>
    </div>
  );
}
