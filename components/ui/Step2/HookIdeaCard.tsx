import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HookIdeaCardProps {
  idea: { title: string; hook: string };
  isSelected: boolean;
  onSelect: () => void;
}

export function HookIdeaCard({ idea, isSelected, onSelect }: HookIdeaCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer bg-white border-2 rounded-xl p-6 transition-all ${
        isSelected
          ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600'
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-indigo-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 pr-8">{idea.title}</h3>
      <p className="text-gray-600 mt-2 italic">"{idea.hook}"</p>
    </div>
  );
}
