import React from 'react';
import { useMediaSelectorLogic } from '../../hooks/useMediaSelectorLogic';
import { MediaPreferenceSelector } from '../ui/Step5/MediaPreferenceSelector';
import { SceneMediaCard } from '../ui/Step5/SceneMediaCard';

export function Step5_MediaSelector() {
  const {
    scriptData,
    isFetching,
    fetched,
    setFetched,
    regeneratingIndexes,
    mediaPreference,
    setMediaPreference,
    fetchMedia,
    handleDownloadMedia,
    regenerateSceneMedia,
    setStep
  } = useMediaSelectorLogic();

  if (!scriptData) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Dashboard</h1>
        <p className="text-gray-500">Procure, review, and organize the visual assets for your video.</p>
      </div>

      {!fetched ? (
        <MediaPreferenceSelector 
          mediaPreference={mediaPreference}
          setMediaPreference={setMediaPreference}
          isFetching={isFetching}
          onFetch={fetchMedia}
          sceneCount={scriptData.scenes.length}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Media Generation Complete</h2>
              <p className="text-sm text-gray-500">Review your generated media below. You can regenerate specific scenes if needed.</p>
            </div>
            <button onClick={() => setFetched(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 text-sm">
              Generate More / Change Style
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scriptData.scenes.map((scene, idx) => (
              <SceneMediaCard 
                key={idx}
                index={idx}
                scene={scene}
                isRegenerating={regeneratingIndexes.includes(idx)}
                onDownload={(path, type, optIdx) => handleDownloadMedia(path, idx, type, optIdx)}
                onRegenerate={() => regenerateSceneMedia(idx)}
              />
            ))}
          </div>
          
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 sm:p-6 z-50">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
              <button 
                onClick={() => {
                  const hasSubScenes = scriptData.scenes.some(s => s.sub_scenes && s.sub_scenes.length > 0);
                  setStep(hasSubScenes ? 4 : 3);
                }} 
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors"
              >
                {scriptData.scenes.some(s => s.sub_scenes && s.sub_scenes.length > 0) ? 'Back to Storyboard' : 'Back to Script'}
              </button>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep(8)} className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold border border-gray-300 hover:bg-gray-200 transition-colors">
                  Skip to Render
                </button>
                <button onClick={() => setStep(6)} className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors">
                  Continue to Brand Kit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
