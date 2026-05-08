import React from 'react';
import { Loader2 } from 'lucide-react';

interface ThumbnailControlsProps {
  prompt: string;
  setPrompt: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  subtitle: string;
  setSubtitle: (val: string) => void;
  fontFamily: string;
  setFontFamily: (val: string) => void;
  filter: string;
  setFilter: (val: string) => void;
  textY: number;
  setTextY: (val: number) => void;
  textColor: string;
  setTextColor: (val: string) => void;
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: (val: 'left' | 'center' | 'right') => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onBrainstorm?: () => void;
  isBrainstorming?: boolean;
}

export function ThumbnailControls({
  prompt, setPrompt,
  title, setTitle,
  subtitle, setSubtitle,
  fontFamily, setFontFamily,
  filter, setFilter,
  textY, setTextY,
  textColor, setTextColor,
  textAlign, setTextAlign,
  onGenerate,
  isGenerating,
  onBrainstorm,
  isBrainstorming = false
}: ThumbnailControlsProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">Art Direction Prompt</label>
          <button 
            onClick={onBrainstorm}
            disabled={isBrainstorming}
            className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            {isBrainstorming ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨ Brainstorm Viral Prompt'}
          </button>
        </div>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none"
        />
      </div>

      <button 
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full py-3 bg-indigo-600 border border-indigo-700 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-sm"
      >
        {isGenerating && <Loader2 className="w-5 h-5 animate-spin" />}
        {isGenerating ? 'Rendering Background...' : 'Generate New Background'}
      </button>
      
      <hr className="my-4 border-gray-100" />
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Main Title overlay</label>
        <input 
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle overlay</label>
        <input 
          type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Font Style</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none"
            value={fontFamily} onChange={e => setFontFamily(e.target.value)}
          >
            <option value="Inter">Inter</option>
            <option value="Impact">Impact</option>
            <option value="Arial Black">Arial Black</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Background Filter</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none"
            value={filter} onChange={e => setFilter(e.target.value)}
          >
            <option value="none">None</option>
            <option value="grayscale(100%) border-white">Grayscale</option>
            <option value="blur(4px)">Blur</option>
            <option value="contrast(150%) saturate(150%)">Vibrant HDR</option>
            <option value="sepia(100%)">Sepia</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pb-2">
         <div className="col-span-2">
           <label className="block text-sm font-semibold text-gray-700 mb-2">Text Layout Y-Axis ({textY}%)</label>
           <input 
             type="range" min="0" max="100" value={textY} onChange={e => setTextY(Number(e.target.value))}
             className="w-full accent-indigo-600"
           />
         </div>
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
           <input 
              type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer border-none"
           />
         </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Text Align</label>
        <div className="flex gap-2">
           {['left','center','right'].map(align => (
             <button 
               key={align} onClick={() => setTextAlign(align as any)}
               className={`flex-1 py-1.5 rounded border text-sm font-medium ${textAlign === align ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
             >
               {align.charAt(0).toUpperCase() + align.slice(1)}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
