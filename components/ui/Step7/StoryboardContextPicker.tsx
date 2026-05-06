import React from 'react';

interface StoryboardContextPickerProps {
  availableImagePrompts: { label: string, prompt: string }[];
  availableTexts: string[];
  currentPrompt: string;
  onSelectPrompt: (p: string) => void;
  onSelectText: (t: string) => void;
}

export function StoryboardContextPicker({
  availableImagePrompts,
  availableTexts,
  currentPrompt,
  onSelectPrompt,
  onSelectText
}: StoryboardContextPickerProps) {
  return (
    <div className="space-y-4">
      {availableImagePrompts.length > 0 && (
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <label className="block text-xs font-bold text-indigo-800 mb-2 uppercase tracking-wider">Storyboard Scenes</label>
          <p className="text-xs text-indigo-600/80 mb-3 leading-relaxed">Select a prompt generated from your storyboard scenes.</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-200">
            {availableImagePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(p.prompt)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${currentPrompt === p.prompt ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableTexts.length > 0 && (
        <div className="px-1">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase font-bold mr-1 flex items-center">Text Suggestions:</span>
            {availableTexts.slice(0, 5).map((t, idx) => (
              <button
                key={idx}
                onClick={() => onSelectText(t)}
                className="text-[10px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded transition-colors"
                title={t}
              >
                {t.substring(0, 20)}{t.length > 20 ? '...' : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
