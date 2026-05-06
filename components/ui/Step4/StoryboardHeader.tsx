import React from 'react';
import { ImageIcon, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface StoryboardHeaderProps {
  generatingAll: boolean;
  generatingScene: number | null;
  onGenerateAll: () => void;
  isProMode: boolean;
  setIsProMode: (mode: boolean) => void;
  chunkInterval: number;
  setChunkInterval: (interval: number) => void;
  aiModel?: string;
}

export function StoryboardHeader({
  generatingAll,
  generatingScene,
  onGenerateAll,
  isProMode,
  setIsProMode,
  chunkInterval,
  setChunkInterval,
  aiModel = 'veo3.1'
}: StoryboardHeaderProps) {

  const getClipOptions = () => {
    switch (aiModel) {
      case 'veo3.1': return [{ val: 4, label: '4s' }, { val: 8, label: '8s' }];
      case 'sora': return [{ val: 4, label: '4s' }, { val: 10, label: '10s' }];
      case 'grok2': return [{ val: 6, label: '6s' }, { val: 10, label: '10s' }];
      case 'runway_gen3':
      case 'kling_v1.5': return [{ val: 5, label: '5s' }, { val: 10, label: '10s' }];
      case 'seedance2.0':
      default: return [{ val: 2, label: '2s' }, { val: 4, label: '4s' }, { val: 8, label: '8s' }];
    }
  };

  const clipOptions = getClipOptions();

  // Auto-correct invalid chunk interval if it's not in the new options
  React.useEffect(() => {
    if (!clipOptions.find(o => o.val === chunkInterval)) {
      setChunkInterval(clipOptions[0].val);
    }
  }, [aiModel, chunkInterval, clipOptions, setChunkInterval]);

  return (
    <div className="p-4 sm:p-8 border-b border-gray-100 bg-gray-50/50">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display flex items-center gap-2">
        <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
        Storyboard Preview
      </h2>
      <p className="text-sm sm:text-base text-gray-500">Every sub-scene has its own narration, prompts, and production details for precise AI video generation.</p>

      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onGenerateAll}
            disabled={generatingAll || generatingScene !== null}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
          >
            {generatingAll ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Generating All...</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Generate All Sub-Scene Prompts</>
            )}
          </button>
          <button
            onClick={() => {
              toast.success('Generating PDF Storyboard... (Placeholder)');
              window.print();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            Export PDF
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-inner">
            <button
              onClick={() => setIsProMode(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isProMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ✨ Auto-Pilot
            </button>
            <button
              onClick={() => setIsProMode(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isProMode ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pro Mode
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clip Length ({aiModel}):</span>
            <div className="flex flex-wrap bg-white rounded-lg border border-gray-200 shadow-sm p-1">
              {clipOptions.map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setChunkInterval(val)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chunkInterval === val ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
