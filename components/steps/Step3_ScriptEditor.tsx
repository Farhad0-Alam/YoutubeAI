import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { SceneCard } from '../ui/Step3/SceneCard';
import { toast } from 'sonner';
import { YouTubeSEOMetadata } from '../ui/Step3/YouTubeSEOMetadata';
import { api } from '../../lib/api';
import { ScriptExportHeader } from '../ui/Step3/ScriptExportHeader';
import { VoicePacingCheck } from '../ui/Step3/VoicePacingCheck';

export function Step3_ScriptEditor() {
  const { scriptData, updateScene, setStep, project, setScriptData } = useVideoStore();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  if (!scriptData) return null;

  const handleRegenerateScene = async (index: number) => {
    if (!project) return;
    setIsUpdating(index);
    try {
      const revised = await api.rewriteScene({
        niche_id: project.niche_id,
        topic: project.topic,
        scene_data: scriptData.scenes[index],
        instructions: "Rewrite this scene to be more cinematic and high-retention.",
        llm_model: project.settings?.llm_model || 'groq'
      });
      updateScene(index, revised);
      toast.success('Scene revised');
    } catch (e: any) {
      toast.error(e.message || 'Revision failed');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAddScene = () => {
    const newScene = {
      scene_number: scriptData.scenes.length + 1,
      duration_seconds: 5,
      narration: '',
      text_overlay: '',
      visual_description: '',
      search_keyword: '',
      image_prompt: '',
      transition: 'none'
    };
    setScriptData({
      ...scriptData,
      scenes: [...scriptData.scenes, newScene],
      total_duration_seconds: scriptData.total_duration_seconds + 5
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Script</h1>
        <p className="text-gray-500 mb-2">Edit your narration and visuals before generating media.</p>
      </div>

      <div className="space-y-4">
        <ScriptExportHeader
          scriptData={scriptData}
          project={project}
          onAddScene={handleAddScene}
        />

        {scriptData.scenes.map((scene, idx) => (
          <div key={idx} className="relative">
            <SceneCard
              index={idx}
              scene={scene}
              totalScenes={scriptData.scenes.length}
              onUpdate={(data) => updateScene(idx, data)}
              onRegenerate={() => handleRegenerateScene(idx)}
              isRegenerating={isUpdating === idx}
            />
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => {
                  const updatedScenes = [...scriptData.scenes];
                  updatedScenes.splice(idx, 1);
                  // Re-number remaining scenes
                  updatedScenes.forEach((s, i) => s.scene_number = i + 1);
                  setScriptData({
                    ...scriptData,
                    scenes: updatedScenes,
                    total_duration_seconds: updatedScenes.reduce((acc, s) => acc + (s.duration_seconds || 5), 0)
                  });
                }}
                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors flex items-center justify-center opacity-50 hover:opacity-100"
                title="Delete Scene"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <YouTubeSEOMetadata />

      <VoicePacingCheck
        scenes={scriptData.scenes}
        totalDurationSeconds={scriptData.total_duration_seconds}
      />

      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 mt-8">
        <button
          onClick={() => setStep(2)}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setStep(4)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Approve Script & Continue
        </button>
      </div>
    </div>
  );
}
