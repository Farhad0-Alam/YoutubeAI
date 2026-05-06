import React from 'react';
import { Loader2 } from 'lucide-react';
import { VoiceSelector } from '../VoiceSelector';

interface RenderSettingsViewProps {
  voices: any[];
  selectedVoice: string;
  setSelectedVoice: (id: string) => void;
  isPrepping: boolean;
  onStartRender: () => void;
  onBack: () => void;
}

export function RenderSettingsView({
  voices,
  selectedVoice,
  setSelectedVoice,
  isPrepping,
  onStartRender,
  onBack
}: RenderSettingsViewProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8">
      <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-lg p-4 mb-8 text-sm">
         <strong>Note on Rendering:</strong> Deep MP4 encoding requires paid GPU servers. To keep this tool 100% free, we compile your video into an interactive &quot;Live Timeline Player&quot; right in your browser!
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Configuration</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">AI Voice Talent</label>
            <VoiceSelector 
              voices={voices}
              selectedId={selectedVoice}
              onSelect={setSelectedVoice}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
        <button 
          onClick={onBack}
          className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Back to Thumbnail
        </button>
        <button 
          onClick={onStartRender}
          disabled={isPrepping}
          className="w-full py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex justify-center items-center gap-2"
        >
          {isPrepping && <Loader2 className="w-5 h-5 animate-spin" />}
          {isPrepping ? 'Compiling Local Timeline...' : 'Preview Live Video Sequence'}
        </button>
      </div>
    </div>
  );
}
