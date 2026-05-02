import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Loader2, Clapperboard, RefreshCcw, Image as ImageIcon, Video, Download } from 'lucide-react';
import { LazyImage } from '../ui/LazyImage';

export function Step5_MediaSelector() {
  const { scriptData, project, setScriptData, setStep } = useVideoStore();
  const [isFetching, setIsFetching] = useState(false);
  const [fetched, setFetched] = useState(() => {
    return scriptData?.scenes.some(s => !!s.media_path) || false;
  });
  const [regeneratingIndexes, setRegeneratingIndexes] = useState<number[]>([]);
  const [mediaPreference, setMediaPreference] = useState<"video" | "image" | "auto">("auto");

  const fetchMedia = async () => {
    if (!scriptData || !project) return;
    setIsFetching(true);
    try {
      const response = await api.fetchMedia({
        niche_id: project.niche_id,
        media_preference: mediaPreference,
        aspect_ratio: project.aspect_ratio,
        scenes: scriptData.scenes.map(s => ({
          scene_number: s.scene_number,
          duration_seconds: s.duration_seconds,
          search_keyword: s.search_keyword,
          image_prompt: s.image_prompt,
        }))
      });
      
      const newScenes = scriptData.scenes.map((s, i) => ({
        ...s,
        media_path: response.scenes[i].media_path,
        media_type: response.scenes[i].media_type as "image" | "video",
        media_options: response.scenes[i].media_options
      }));
      
      setScriptData({ ...scriptData, scenes: newScenes });
      toast.success('Media generation initiated');
      setStep(6);
    } catch (e) {
      toast.error('Failed to fetch media');
    } finally {
      setIsFetching(false);
    }
  };

  if (!scriptData) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Locate Media</h1>
          <p className="text-gray-500">Let the agent find or generate the best visual assets for each scene in your script.</p>
        </div>
      </div>

      <div className="bg-white border text-center border-gray-200 rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
          <Clapperboard className="w-8 h-8" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Find assets for {scriptData.scenes.length} scenes</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">
          Choose your preferred media style. We can search premium stock video libraries (requires API key) or generate unique AI images for each scene.
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
          onClick={fetchMedia}
          disabled={isFetching}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:bg-indigo-700 hover:shadow-lg flex items-center justify-center gap-3 w-full max-w-md shadow-sm"
        >
          {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isFetching ? 'Generating Scene Assets...' : 'Procure Media Assets'}
        </button>

        {scriptData.scenes.some(s => s.media_path) && (
          <button 
            onClick={() => setStep(6)}
            className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Skip to Review Media →
          </button>
        )}
      </div>
    </div>
  );
}
