import { CheckCircle2 } from 'lucide-react';

interface StyleConfig {
  id: string;
  label: string;
  description: string;
  emoji: string;
}

interface StyleCardProps {
  styleDef: StyleConfig;
  selected: boolean;
  onClick: () => void;
}

export function StyleCard({ styleDef, selected, onClick }: StyleCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-xl cursor-pointer transition-all duration-200 group border bg-white flex flex-col items-center text-center justify-center ${
        selected ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600 bg-indigo-50/20' : 'border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 text-indigo-600">
          <CheckCircle2 className="w-4 h-4 fill-indigo-100" />
        </div>
      )}
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{styleDef.emoji}</div>
      <h3 className="text-gray-900 font-bold text-sm mb-1">{styleDef.label}</h3>
      <p className="text-xs text-gray-500 font-medium">{styleDef.description}</p>
    </div>
  );
}
