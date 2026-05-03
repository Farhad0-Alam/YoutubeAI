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

  if (!scriptData) return null;

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
      toast.success('Media generation complete');
      setFetched(true);
    } catch (e) {
      toast.error('Failed to fetch media');
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownloadSpecificMedia = async (path: string, type: string, sceneIndex: number, optionIndex: number) => {
    if (!path) {
      toast.error('No media available to download');
      return;
    }
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      let ext = 'mp4';
      if (path.includes('.mp4')) ext = 'mp4';
      else if (path.includes('.png')) ext = 'png';
      else if (path.includes('.jpg') || path.includes('.jpeg')) ext = 'jpg';
      else ext = type === 'video' ? 'mp4' : 'png';
      a.download = `Scene_${String(sceneIndex + 1).padStart(2, '0')}_opt${optionIndex + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Download started for Scene ${sceneIndex + 1} Option ${optionIndex + 1}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download media');
    }
  };

  const handleDownloadMedia = async (scene: any, index: number) => {
    if (!scene.media_path) {
      toast.error('No media available to download');
      return;
    }
    try {
      const response = await fetch(scene.media_path);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      let ext = 'mp4';
      if (scene.media_path.includes('.mp4')) ext = 'mp4';
      else if (scene.media_path.includes('.png')) ext = 'png';
      else if (scene.media_path.includes('.jpg') || scene.media_path.includes('.jpeg')) ext = 'jpg';
      else ext = scene.media_type === 'video' ? 'mp4' : 'png';
      a.download = `Scene_${String(index + 1).padStart(2, '0')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Download started for Scene ${index + 1}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download media');
    }
  };

  const regenerateSceneMedia = async (sceneIndex: number) => {
    if (!scriptData) return;
    setRegeneratingIndexes([...regeneratingIndexes, sceneIndex]);
    try {
      const scene = scriptData.scenes[sceneIndex];
      const res = await api.fetchMedia({
        niche_id: project?.niche_id || '',
        media_preference: mediaPreference,
        aspect_ratio: project?.aspect_ratio,
        scenes: [{ ...scene }]
      });
      const updatedScene = res.scenes[0];
      const newScenes = [...scriptData.scenes];
      newScenes[sceneIndex].media_path = updatedScene.media_path;
      newScenes[sceneIndex].media_type = updatedScene.media_type;
      setScriptData({ ...scriptData, scenes: newScenes });
      toast.success(`Scene ${sceneIndex + 1} media updated`);
    } catch (e) {
      toast.error('Failed to update media');
    } finally {
      setRegeneratingIndexes(prev => prev.filter(i => i !== sceneIndex));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Dashboard</h1>
          <p className="text-gray-500">Procure, review, and organize the visual assets for your video.</p>
        </div>
      </div>

      {!fetched ? (
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
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Media Generation Complete</h2>
              <p className="text-sm text-gray-500">Review your generated media below. You can regenerate specific scenes if needed.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setFetched(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 text-sm">
                Generate More / Change Style
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scriptData.scenes.map((scene, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-0 shadow-sm relative overflow-hidden flex flex-col">
                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white font-medium px-2 py-1 rounded text-xs border border-white/20">
                  #{scene.scene_number.toString().padStart(2, '0')}
                </div>
                
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center relative">
                  {scene.media_path ? (
                    scene.media_type === 'video' ? (
                      <video src={scene.media_path} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <LazyImage src={scene.media_path} alt={scene.search_keyword} delayMs={idx * 600} />
                    )
                  ) : (
                    <div className="text-gray-400 p-4 text-center text-sm">Failed to fetch match for "{scene.search_keyword}"</div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3 block truncate" title={scene.search_keyword}>
                    Query: <span className="text-indigo-600">{scene.search_keyword}</span>
                  </div>
                  
                  {scene.media_options && scene.media_options.length > 1 && (
                    <div className="mb-3 space-y-2 pr-1">
                      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">More options for this scene:</div>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                        {scene.media_options.map((opt: any, optIdx: number) => (
                          <div key={optIdx} className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              {opt.thumbnail_url ? (
                                <img src={opt.thumbnail_url} alt={opt.keyword} className="w-16 h-9 object-cover rounded shadow-sm bg-gray-200" />
                              ) : (
                                <div className="w-16 h-9 flex items-center justify-center bg-gray-200 rounded shadow-sm">
                                  {opt.media_type === 'video' ? <Video className="w-4 h-4 text-gray-400" /> : <ImageIcon className="w-4 h-4 text-gray-400" />}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="truncate text-xs text-gray-700 font-medium" title={opt.keyword || 'Alternative'}>
                                  {opt.keyword || `Alternative ${optIdx + 1}`}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase mt-0.5">{opt.media_type} Option {optIdx + 1}</div>
                              </div>
                              <button
                               onClick={() => handleDownloadSpecificMedia(opt.media_path, opt.media_type, idx, optIdx)}
                               className="text-white bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded-md flex-shrink-0 transition-colors shadow-sm"
                               title="Download this option"
                              >
                               <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-3 flex gap-2 justify-between items-center border-t border-gray-100">
                     <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                       {scene.media_type === 'video' ? 'HD Video' : 'Generated Image'}
                     </span>
                     
                     <div className="flex items-center gap-2">
                       {scene.media_path && (
                         <button
                            onClick={() => handleDownloadMedia(scene, idx)}
                            className="text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 p-1.5 rounded transition-colors"
                            title="Download Media"
                         >
                           <Download className="w-4 h-4" />
                         </button>
                       )}
                       <button
                          onClick={() => regenerateSceneMedia(idx)}
                          disabled={regeneratingIndexes.includes(idx)}
                          className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                       >
                         {regeneratingIndexes.includes(idx) ? <Loader2 className="w-3 h-3 animate-spin"/> : <RefreshCcw className="w-3 h-3" />}
                         Change Media
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button 
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors"
            >
              Back to Storyboard
            </button>
            <button 
              onClick={() => setStep(6)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-colors hover:bg-indigo-700 shadow-sm"
            >
              Continue to Brand Kit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
