import React from 'react';
import { Clapperboard, Video, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MediaPreferenceSelectorProps {
  mediaPreference: "video" | "image" | "auto";
  setMediaPreference: (val: "video" | "image" | "auto") => void;
  isFetching: boolean;
  onFetch: () => void;
  sceneCount: number;
}

export function MediaPreferenceSelector({
  mediaPreference,
  setMediaPreference,
  isFetching,
  onFetch,
  sceneCount
}: MediaPreferenceSelectorProps) {
  return (
    <div className="bg-white border text-center border-gray-200 rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center shadow-sm">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
        <Clapperboard className="w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">Find assets for {sceneCount} scenes</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">
        Choose your preferred media style. We can search premium stock video libraries or generate unique AI images for each scene.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-8">
        <button
           onClick={() => setMediaPreference("auto")}
           className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${mediaPreference === 'auto' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
        >
          <Clapperboard className="w-5 h-5" />
          Auto / Mixed
        </button>
        <button
           onClick={() => setMediaPreference("video")}
           className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${mediaPreference === 'video' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
        >
          <Video className="w-5 h-5" />
          Stock Video
        </button>
        <button
           onClick={() => setMediaPreference("image")}
           className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${mediaPreference === 'image' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
        >
          <ImageIcon className="w-5 h-5" />
          AI Images
        </button>
      </div>

      <button 
        onClick={onFetch}
        disabled={isFetching}
        className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:bg-indigo-700 hover:shadow-lg flex items-center justify-center gap-3 w-full max-w-md shadow-sm"
      >
        {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {isFetching ? 'Generating Scene Assets...' : 'Procure Media Assets'}
      </button>
    </div>
  );
}
