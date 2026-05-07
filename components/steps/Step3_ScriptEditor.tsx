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
        llm_model: project.settings?.llm_model || 'groq',
        ai_model: project.ai_model,
        aspect_ratio: project.aspect_ratio
      });
      updateScene(index, revised);
      toast.success('Scene revised');
    } catch (e: any) {
      toast.error(e.message || 'Revision failed');
    } finally {
      setIsUpdating(null);
    }
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
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => setStep(4)}
            className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold border border-indigo-200 shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            Detailed Storyboard (Pro)
          </button>
          <button
            onClick={() => setStep(5)}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Quick Media Generation
            <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-medium">Skip Step 4</span>
          </button>
        </div>
      </div>
    </div>
  );
}
