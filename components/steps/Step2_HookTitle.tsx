import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Step2_HookTitle() {
  const { project, generatedIdeas, setStep } = useVideoStore();
  const { generateScript, isGenerating } = useVideoGeneration();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleWriteScript = () => {
    if (selectedIndex === null || !project || !generatedIdeas) return;
    const selectedIdea = generatedIdeas[selectedIndex];

    // Modify the topic to include the selected hook/title
    const enhancedTopic = `${project.topic}. 
    CRITICAL: YOU MUST USE THIS EXACT TITLE: "${selectedIdea.title}"
    CRITICAL: YOU MUST USE THIS EXACT HOOK FOR THE FIRST SCENE: "${selectedIdea.hook}"`;

    generateScript({
      niche_id: project.niche_id,
      topic: enhancedTopic,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      script_style: project.script_style,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || "16:9",
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model
    });
  };

  if (!generatedIdeas || generatedIdeas.length === 0) {
    return (
      <div className="bg-white border text-center border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 mb-4">No ideas generated.</p>
        <button onClick={() => setStep(1)} className="px-4 py-2 bg-indigo-600 text-white rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Hook & Title</h1>
        <p className="text-gray-500 mb-6">Choose the most viral angle for your video before generating the full script.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {generatedIdeas.map((idea, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative cursor-pointer bg-white border-2 rounded-xl p-6 transition-all ${
              selectedIndex === idx 
                ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600' 
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            {selectedIndex === idx && (
              <div className="absolute top-4 right-4 text-indigo-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 pr-8">{idea.title}</h3>
            <p className="text-gray-600 mt-2 italic">&quot;{idea.hook}&quot;</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4 border-t border-gray-200">
        <button
          onClick={() => setStep(1)}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm"
        >
          Back
        </button>
        <button 
          onClick={handleWriteScript}
          disabled={selectedIndex === null || isGenerating}
          className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {isGenerating ? 'Writing Script...' : 'Write Full Script'}
        </button>
      </div>
    </div>
  );
}
