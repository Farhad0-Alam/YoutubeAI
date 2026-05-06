import React from 'react';
import { PlusCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface CustomIdeaEditorProps {
  isSelected: boolean;
  onSelect: () => void;
  title: string;
  setTitle: (val: string) => void;
  hook: string;
  setHook: (val: string) => void;
  onGenerateHook: () => void;
  isGeneratingHook: boolean;
}

export function CustomIdeaEditor({
  isSelected,
  onSelect,
  title,
  setTitle,
  hook,
  setHook,
  onGenerateHook,
  isGeneratingHook
}: CustomIdeaEditorProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer bg-white border-2 rounded-xl p-6 transition-all ${
        isSelected
          ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600'
          : 'border-gray-200 border-dashed hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-indigo-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">Write Your Own Title & Hook</h3>
      </div>

      {isSelected ? (
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a highly-clickable title..."
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-gray-700">Custom Hook</label>
              <button
                onClick={(e) => { e.stopPropagation(); onGenerateHook(); }}
                disabled={!title.trim() || isGeneratingHook}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                {isGeneratingHook ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                {isGeneratingHook ? 'Generating...' : 'Auto-Generate Hook'}
              </button>
            </div>
            <textarea
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="Enter the first 5 seconds script..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Have a better idea? Click here to enter a custom title and hook manually.</p>
      )}
    </div>
  );
}
