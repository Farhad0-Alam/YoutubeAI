import { useState } from 'react';
import { niches } from '../lib/niches';
import { useVideoGeneration } from './useVideoGeneration';
import { useVideoStore } from '../store/videoStore';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { parseScriptByScenes } from '../lib/storyboardLogic';

export function useNicheTopicLogic() {
  // Read existing project from store to hydrate local state
  // This prevents the bug where hardcoded defaults overwrite saved project settings
  const existingProject = useVideoStore.getState().project;

  const [selectedNiche, setSelectedNiche] = useState(existingProject?.niche_id || niches[0].niche_id);
  const [selectedStyle, setSelectedStyle] = useState(existingProject?.visual_style || niches[0].bestStyles?.[0] || 'cinematic');
  const [duration, setDuration] = useState(existingProject?.duration_minutes ?? 0.5);
  const [aspectRatio, setAspectRatio] = useState(existingProject?.aspect_ratio || '9:16');
  const [isTrendModalOpen, setIsTrendModalOpen] = useState(false);
  const [sceneLength, setSceneLength] = useState(existingProject?.scene_length ?? 15);
  const [llmModel, setLlmModel] = useState(existingProject?.settings?.llm_model || 'gemini');
  const [aiVisualModel, setAiVisualModel] = useState(existingProject?.ai_model || 'veo3.1');
  const [ollamaUrl, setOllamaUrl] = useState(existingProject?.settings?.ollama_url || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(existingProject?.settings?.ollama_model || 'qwen2.5:14b');
  const [customScript, setCustomScript] = useState('');
  const [voiceGender, setVoiceGender] = useState(existingProject?.voice || 'Male');
  const [topic, setTopic] = useState(existingProject?.topic || '');

  const { isGeneratingHooks, generateHooks } = useVideoGeneration();
  const setGeneratedIdeas = useVideoStore(s => s.setGeneratedIdeas);
  const setStep = useVideoStore(s => s.setStep);
  const setScriptData = useVideoStore(s => s.setScriptData);
  const setProject = useVideoStore(s => s.setProject);

  const handleSelectNiche = (nicheId: string) => {
    const activeNicheObj = niches.find(n => n.niche_id === nicheId);
    setSelectedNiche(nicheId);
    setSelectedStyle(activeNicheObj?.bestStyles?.[0] || 'cinematic');
  };

  const handleGenerateIdeas = async () => {
    const activeNicheObj = niches.find(n => n.niche_id === selectedNiche);
    const finalTopic = topic.trim() || (activeNicheObj ? activeNicheObj.display_name : selectedNiche);
    
    if (!finalTopic) {
      toast.error('Please enter a topic or select a niche');
      return;
    }

    try {
      const ideas = await generateHooks({
        niche_id: selectedNiche,
        topic: finalTopic,
        duration_minutes: duration,
        scene_length: sceneLength,
        ai_model: aiVisualModel,
        script_style: 'Educational',
        voice_gender: voiceGender,
        aspect_ratio: aspectRatio,
        llm_model: llmModel,
        ollama_url: ollamaUrl,
        ollama_model: ollamaModel,
        visual_style: selectedStyle
      } as any);
      setGeneratedIdeas(ideas);
      setStep(2);
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate ideas');
    }
  };

  const handleFullAutoGenerate = async () => {
    const activeNicheObj = niches.find(n => n.niche_id === selectedNiche);
    const generatedTopic = activeNicheObj ? activeNicheObj.display_name : selectedNiche;
    
    try {
      await generateScript({
        niche_id: selectedNiche,
        topic: generatedTopic,
        duration_minutes: duration,
        scene_length: sceneLength,
        ai_model: aiVisualModel,
        script_style: 'Educational',
        voice_gender: voiceGender,
        aspect_ratio: aspectRatio,
        llm_model: llmModel,
        ollama_url: ollamaUrl,
        ollama_model: ollamaModel,
        visual_style: selectedStyle,
        extra_instructions: "",
        audio_engine: audioEngine
      } as any);
      // generateScript already sets step 3 and script data
    } catch (e) {
      console.error(e);
      toast.error('Full Auto Generation Failed');
    }
  };

  const handleCustomScriptSubmit = async () => {
    const activeNicheObj = niches.find(n => n.niche_id === selectedNiche);
    const fallbackTopic = activeNicheObj ? activeNicheObj.display_name : 'Custom Video';
    
    let parsedScenes: any[] = [];
    const scriptText = customScript.trim();
    if (scriptText) {
       parsedScenes = parseScriptByScenes(scriptText, duration * 60);
    }
    
    if (parsedScenes.length === 0) {
      parsedScenes = [{
        scene_number: 1,
        duration_seconds: duration * 60 > 15 ? 5 : duration * 60,
        narration: '',
        text_overlay: '',
        visual_description: '',
        search_keyword: '',
        image_prompt: '',
        transition: 'none'
      }];
    }

    const totalDuration = parsedScenes.reduce((acc, s) => acc + s.duration_seconds, 0);

    const scriptData = {
      title: fallbackTopic,
      description: '',
      tags: [],
      hook: '',
      cta: '',
      scenes: parsedScenes,
      total_duration_seconds: totalDuration || (duration * 60),
      aspect_ratio: aspectRatio,
    };
    
    const projectData = {
      title: fallbackTopic,
      niche_id: selectedNiche,
      topic: fallbackTopic,
      script_style: 'Custom',
      visual_style: selectedStyle,
      duration_minutes: (totalDuration || (duration * 60)) / 60,
      scene_length: sceneLength,
      ai_model: aiVisualModel,
      voice: voiceGender,
      aspect_ratio: aspectRatio,
      status: "script_ready",
      settings: {
        llm_model: llmModel,
        ollama_url: ollamaUrl,
        ollama_model: ollamaModel,
        audio_engine: audioEngine
      },
    };
    
    try {
      setScriptData(scriptData);
      const proj = await api.createProject(projectData);
      setProject({ ...projectData, _id: proj._id } as any);
      setStep(3);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create custom project');
    }
  };

  return {
    selectedNiche,
    selectedStyle,
    setSelectedStyle,
    duration,
    setDuration,
    aspectRatio,
    setAspectRatio,
    isTrendModalOpen,
    setIsTrendModalOpen,
    sceneLength,
    setSceneLength,
    llmModel,
    setLlmModel,
    aiVisualModel,
    setAiVisualModel,
    ollamaUrl,
    setOllamaUrl,
    ollamaModel,
    setOllamaModel,
    customScript,
    setCustomScript,
    topic,
    setTopic,
    voiceGender,
    setVoiceGender,
    isGeneratingHooks,
    handleSelectNiche,
    handleGenerateIdeas,
    handleFullAutoGenerate,
    handleCustomScriptSubmit
  };
}
