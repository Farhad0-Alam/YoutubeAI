import { CheckCircle2 } from 'lucide-react';

export interface AIModelConfig {
  id: string;
  label: string;
  description: string;
}

interface ModelCardProps {
  model: AIModelConfig;
  selected: boolean;
  onClick: () => void;
}

export function ModelCard({ model, selected, onClick }: ModelCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-xl cursor-pointer transition-all duration-200 group border bg-white flex flex-col items-center text-center justify-center ${
        selected ? 'border-green-600 shadow-md ring-1 ring-green-600 bg-green-50/20' : 'border-gray-200 shadow-sm hover:border-green-300 hover:shadow-md'
      }`}
    >
      <h3 className={`font-bold text-sm mb-1 ${selected ? 'text-green-700' : 'text-gray-900'}`}>{model.label}</h3>
      <p className="text-xs text-gray-500 font-medium">{model.description}</p>
    </div>
  );
}
