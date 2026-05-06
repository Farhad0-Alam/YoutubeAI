import { useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import { api } from '../lib/api';
import { toast } from 'sonner';

export function useMediaSelectorLogic() {
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
      toast.success('Media generation complete');
      setFetched(true);
    } catch (e) {
      toast.error('Failed to fetch media');
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownloadMedia = async (path: string, sceneIndex: number, type?: string, optionIndex?: number) => {
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

      const fileName = optionIndex !== undefined 
        ? `Scene_${String(sceneIndex + 1).padStart(2, '0')}_opt${optionIndex + 1}.${ext}`
        : `Scene_${String(sceneIndex + 1).padStart(2, '0')}.${ext}`;
        
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Download started for Scene ${sceneIndex + 1}`);
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

  return {
    scriptData,
    project,
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
  };
}
