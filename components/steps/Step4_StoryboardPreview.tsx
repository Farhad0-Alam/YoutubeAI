import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { StoryboardHeader } from '../ui/Step4/StoryboardHeader';
import { SceneStoryboardCard } from '../ui/Step4/SceneStoryboardCard';

export function Step4_StoryboardPreview() {
  const { scriptData, project, setStep, updateScene } = useVideoStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingScene, setGeneratingScene] = useState<number | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [voiceToggles, setVoiceToggles] = useState<Record<string, boolean>>({});
  const [textToggles, setTextToggles] = useState<Record<string, boolean>>({});
  const [chunkInterval, setChunkInterval] = useState<number>(2);
  const [isProMode, setIsProMode] = useState<boolean>(false);

  if (!scriptData) return null;

  const handleGenerateSubScenes = async (sceneIdx: number) => {
    if (!scriptData || !project) return;
    const scene = scriptData.scenes[sceneIdx];
    if (!scene.narration) {
      toast.error('No narration found. Write narration in Step 3 first.');
      return;
    }
    setGeneratingScene(sceneIdx);
    try {
      const result = await api.generateSubScenePrompts({
        narration: scene.narration,
        visual_description: scene.visual_description || '',
        search_keyword: scene.search_keyword || '',
        duration_seconds: scene.duration_seconds || 15,
        scene_number: scene.scene_number || sceneIdx + 1,
        visual_style: project.visual_style,
        aspect_ratio: project.aspect_ratio,
        ai_model: project.ai_model,
        llm_model: project.settings?.llm_model || 'gemini',
        chunk_interval: chunkInterval,
        topic: project.topic,
        hook: project.hook,
        title: project.title,
        cta: scriptData.cta,
        isLastScene: sceneIdx === scriptData.scenes.length - 1,
        isMidVideoCTA: (project.duration_minutes || 0) > 5 && sceneIdx === 2, // 3rd scene (index 2)
      });
      if (result.sub_scenes && result.sub_scenes.length > 0) {
        updateScene(sceneIdx, { sub_scenes: result.sub_scenes });
        toast.success(`Scene ${scene.scene_number || sceneIdx + 1}: ${result.sub_scenes.length} sub-scene prompts generated!`);
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate sub-scene prompts');
    } finally {
      setGeneratingScene(null);
    }
  };



  const handleGenerateAll = async () => {
    setGeneratingAll(true);
    for (let i = 0; i < scriptData.scenes.length; i++) {
      await handleGenerateSubScenes(i);
    }
    setGeneratingAll(false);
    toast.success('All sub-scene prompts generated!');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubSceneUpdate = (sceneIdx: number, subIdx: number, field: string, value: string) => {
    const scene = scriptData.scenes[sceneIdx];
    const updatedSubScenes = [...(scene.sub_scenes || [])];
    if (updatedSubScenes[subIdx]) {
      updatedSubScenes[subIdx] = { ...updatedSubScenes[subIdx], [field]: value };
    }
    updateScene(sceneIdx, { sub_scenes: updatedSubScenes });
  };

  const buildFullSubSceneVideoPrompt = (sceneIdx: number, subIdx: number) => {
    const scene = scriptData.scenes[sceneIdx] as any;
    const sub = (scene.sub_scenes?.[subIdx] as any) || {};

    let styleStr = 'Cinematic realism, 4K, 60fps, teal-orange grade, high quality';
    const aspectRatio = project?.aspect_ratio || '16:9';
    const aiModel = project?.ai_model || 'veo3.1';

    if (aiModel === 'seedance2.0') {
      styleStr += ` --ar ${aspectRatio} --v 2.0`;
    } else if (aiModel === 'veo3.1') {
      styleStr = `Highly realistic, cinematic lighting, Veo 3.1 optimization, aspect ratio ${aspectRatio}`;
    } else if (aiModel === 'kling_v1.5') {
      styleStr = `Masterpiece, best quality, cinematography, Kling v1.5, aspect ratio ${aspectRatio}`;
    } else if (aiModel === 'midjourney_v6') {
      styleStr = `--ar ${aspectRatio} --v 6.0 --style raw`;
    } else if (aiModel === 'runway_gen3') {
      styleStr = `Gen-3 Alpha, hyperrealistic, dynamic motion, aspect ratio ${aspectRatio}`;
    } else if (aiModel === 'sora') {
      styleStr = `OpenAI Sora, photorealistic, highly detailed, smooth motion, 4k resolution`;
    } else if (aiModel === 'grok2') {
      styleStr = `Grok 2.0 rendering, highly cinematic, detailed textures, vivid lighting, ratio ${aspectRatio}`;
    }

    const basePrompt = sub.video_prompt?.trim() || sub.image_prompt?.trim() || scene.visual_description?.trim() || '';

    let prompt = '';
    if (aiModel === 'midjourney_v6') {
      prompt = `/imagine prompt: ${basePrompt}, highly detailed cinematic photography, 8k resolution ${styleStr}`;
    } else {
      prompt = `${basePrompt}\n\nStyle: ${styleStr}`;
    }

    const key = `${sceneIdx}-${subIdx}`;
    const incVoice = voiceToggles[key] ?? true;
    const incText = textToggles[key] ?? true;

    const nar = sub.narration || scene.narration || '';
    const txt = sub.text_overlay || scene.text_overlay || '';

    if (incVoice && nar) prompt += `\n\nVoice: ${nar.trim()}`;
    if (incText) {
      if (sub.multiple_text_overlays && sub.multiple_text_overlays.length > 0) {
        sub.multiple_text_overlays.forEach((overlay: any, i: number) => {
          prompt += `\n\nTEXT OVERLAY ${i + 1}: "${overlay.text.trim()}"`;
          if (overlay.position) prompt += `\nPOSITION: ${overlay.position}`;
          if (overlay.animation) prompt += `\nANIMATION: ${overlay.animation}`;
          if (overlay.box_style) prompt += `\nBOX/BACKGROUND STYLE: ${overlay.box_style}`;
          if (overlay.start_time !== undefined) prompt += `\nTIMING: Starts at ${overlay.start_time}s`;
        });
      } else if (txt) {
        prompt += `\n\nTEXT OVERLAY: "${txt.trim()}"`;
        if (sub.text_position) prompt += `\nPOSITION: ${sub.text_position}`;
        if (sub.text_animation) prompt += `\nANIMATION: ${sub.text_animation}`;
        if (sub.text_box_style) prompt += `\nBOX/BACKGROUND STYLE: ${sub.text_box_style}`;
      }
    }
    if (sub.vfx || scene.vfx) prompt += `\n\nVFX: ${(sub.vfx || scene.vfx).trim()}`;
    if (sub.sound || scene.sound) prompt += `\n\nSFX: ${(sub.sound || scene.sound).trim()}`;
    if (sub.music || scene.music) prompt += `\n\nBGM: ${(sub.music || scene.music).trim()}`;
    if (sub.camera_motion || scene.camera_motion) prompt += `\n\nCAMERA MOTION: ${(sub.camera_motion || scene.camera_motion).trim()}`;
    if (sub.timing_and_pacing || scene.timing_and_pacing) prompt += `\n\nTIMING & PACING: ${(sub.timing_and_pacing || scene.timing_and_pacing).trim()}`;
    if (sub.color_grading || scene.color_grading) prompt += `\n\nCOLOR GRADING / LUT: ${(sub.color_grading || scene.color_grading).trim()}`;
    if (sub.transition || scene.transition) prompt += `\n\nTRANSITION: ${(sub.transition || scene.transition).trim()}`;
    if (sub.emotional_arc || scene.emotional_arc) prompt += `\n\nEMOTIONAL ARC: ${(sub.emotional_arc || scene.emotional_arc).trim()}`;
    if (sub.call_to_action_cue || scene.call_to_action_cue) prompt += `\n\nCALL TO ACTION: ${(sub.call_to_action_cue || scene.call_to_action_cue).trim()}`;

    return prompt;
  };



  const splitText = (text: string, n: number): string[] => {
    if (!text) return Array(n).fill('');
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const result: string[] = Array(n).fill('');
    if (words.length === 0) return result;

    const wordsPerChunk = Math.ceil(words.length / n);
    for (let i = 0; i < n; i++) {
      const start = i * wordsPerChunk;
      const end = Math.min(start + wordsPerChunk, words.length);
      result[i] = words.slice(start, end).join(' ');
    }
    return result;
  };

  const handleApplyToAll = (field: string, value: string, label: string) => {
    scriptData.scenes.forEach((scene, sIdx) => {
      const updatedSubScenes = scene.sub_scenes?.map(sub => ({
        ...sub,
        [field]: value
      }));
      if (updatedSubScenes) {
        updateScene(sIdx, { sub_scenes: updatedSubScenes });
      }
    });
    toast.success(`Applied ${label} to all sub-scenes!`);
  };

  const handleGenerateImage = async (sceneIdx: number, subIdx: number) => {
    if (!scriptData) return;
    const scene = scriptData.scenes[sceneIdx];
    const sub = scene.sub_scenes[subIdx];
    if (!sub.image_prompt) {
      toast.error('Please generate prompts first');
      return;
    }

    setGeneratingScene(sceneIdx); // Reuse generatingScene for simplicity or add specific state
    try {
      const url = await api.generateImage({ prompt: sub.image_prompt });
      handleSubSceneUpdate(sceneIdx, subIdx, 'preview_url', url);
      toast.success('Image generated successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate image');
    } finally {
      setGeneratingScene(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <StoryboardHeader
        generatingAll={generatingAll}
        generatingScene={generatingScene}
        onGenerateAll={handleGenerateAll}
        isProMode={isProMode}
        setIsProMode={setIsProMode}
        chunkInterval={chunkInterval}
        setChunkInterval={setChunkInterval}
        aiModel={project?.ai_model || 'veo3.1'}
      />

      <div className="p-4 sm:p-8 pb-32 space-y-10">
        {scriptData.scenes.map((scene, index) => (
          <SceneStoryboardCard
            key={index}
            index={index}
            scene={scene}
            chunkInterval={chunkInterval}
            isProMode={isProMode}
            totalScenes={scriptData.scenes.length}
            generatingScene={generatingScene}
            generatingAll={generatingAll}
            onGenerateSubScenes={handleGenerateSubScenes}
            onGenerateImage={handleGenerateImage}
            onSubSceneUpdate={handleSubSceneUpdate}
            onCopy={handleCopy}
            copiedId={copiedId}
            voiceToggles={voiceToggles}
            onToggleVoice={(sIdx, subIdx) => setVoiceToggles(prev => ({ ...prev, [`${sIdx}-${subIdx}`]: !(prev[`${sIdx}-${subIdx}`] ?? true) }))}
            textToggles={textToggles}
            onToggleText={(sIdx, subIdx) => setTextToggles(prev => ({ ...prev, [`${sIdx}-${subIdx}`]: !(prev[`${sIdx}-${subIdx}`] ?? true) }))}
            onApplyToAll={handleApplyToAll}
            buildVideoPrompt={buildFullSubSceneVideoPrompt}
            splitText={splitText}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 sm:p-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
          <button onClick={() => setStep(3)} className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors text-center">
            Back to Script
          </button>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setStep(8)} className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gray-100 text-gray-500 rounded-xl font-bold border border-gray-300 hover:bg-gray-200 transition-colors text-center">
              Skip to Render
            </button>
            <button onClick={() => setStep(5)} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              Continue to Media Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
