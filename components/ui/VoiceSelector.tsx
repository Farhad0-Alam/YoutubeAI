import { Voice } from '../../types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function VoiceSelector({ voices, selectedId, onSelect }: VoiceSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {voices.map(v => (
        <div 
          key={v.id}
          onClick={() => onSelect(v.id)}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            selectedId === v.id 
            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
          }`}
        >
          <div className="text-sm font-semibold text-gray-900 mb-1">{v.name}</div>
          <div className="text-xs text-gray-500 font-medium">{v.label}</div>
        </div>
      ))}
    </div>
  );
}
