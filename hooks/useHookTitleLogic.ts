import { useState, useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { useVideoGeneration } from './useVideoGeneration';
import { api } from '../lib/api';
import { niches } from '../lib/niches';

export function useHookTitleLogic() {
  const { project, generatedIdeas, setGeneratedIdeas, setStep } = useVideoStore();
  const { generateScript, isGenerating, generateHooks, isGeneratingHooks } = useVideoGeneration();
  
  const [selectedIndex, setSelectedIndex] = useState<number | 'custom' | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customHook, setCustomHook] = useState('');
  const [isGeneratingCustomHook, setIsGeneratingCustomHook] = useState(false);
  const [activeSubNiche, setActiveSubNiche] = useState<string | null>(null);
  const [showSubNicheModal, setShowSubNicheModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [tempSubNiche, setTempSubNiche] = useState<string | null>(null);

  const activeNicheObj = project ? niches.find(n => n.niche_id === project.niche_id) : null;

  // Auto-open modal when step loads
  useEffect(() => {
    setShowSubNicheModal(true);
    setModalStep(1);
    setTempSubNiche(null);
  }, []);

  const handleSubNicheSelect = (subNiche: string) => {
    setTempSubNiche(subNiche);
    setModalStep(2);
  };

  const handleAngleSelect = async (angleLabel: string) => {
    if (!tempSubNiche || !project) return;
    
    const finalTopicLabel = `${tempSubNiche} (${angleLabel})`;
    setActiveSubNiche(finalTopicLabel);
    setShowSubNicheModal(false);
    
    const topic = `${activeNicheObj?.display_name} - ${tempSubNiche}. Focus Angle: ${angleLabel}. Make sure all hooks and titles strongly reflect this specific angle format.`;

    const newIdeas = await generateHooks({
      niche_id: project.niche_id,
      topic,
      script_style: project.script_style,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || '16:9',
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model,
      grok_mode: project.settings?.grok_mode
    } as any);

    if (newIdeas && newIdeas.length > 0) {
      setGeneratedIdeas(newIdeas);
      setSelectedIndex(null);
    }
    
    setModalStep(1);
    setTempSubNiche(null);
  };

  const handleGenerateCustomHook = async () => {
    if (!project || !customTitle.trim()) return;
    setIsGeneratingCustomHook(true);
    try {
      const data = await api.generateHooksAndTitles({
        niche_id: project.niche_id,
        topic: `Topic: ${project.topic}. The user has chosen a specific title: "${customTitle}". Please generate 1-3 ideas where the 'title' matches the user's title EXACTLY, and the 'hook' is a perfectly matched first 5 seconds script for this title.`,
        llm_model: project.settings?.llm_model,
        ollama_url: project.settings?.ollama_url,
        ollama_model: project.settings?.ollama_model,
        grok_mode: project.settings?.grok_mode
      });
      if (data && data.ideas && data.ideas.length > 0) {
        setCustomHook(data.ideas[0].hook);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingCustomHook(false);
    }
  };

  const handleWriteScript = () => {
    if (selectedIndex === null || !project || !generatedIdeas) return;

    let selectedTitle = '';
    let selectedHook = '';

    if (selectedIndex === 'custom') {
      selectedTitle = customTitle.trim();
      selectedHook = customHook.trim();
    } else {
      selectedTitle = generatedIdeas[selectedIndex as number].title;
      selectedHook = generatedIdeas[selectedIndex as number].hook;
    }

    const enhancedTopic = `${project.topic}. 
    CRITICAL: YOU MUST USE THIS EXACT TITLE: "${selectedTitle}"
    CRITICAL: YOU MUST USE THIS EXACT HOOK FOR THE FIRST SCENE: "${selectedHook}"`;

    const scriptParams = {
      niche_id: project.niche_id,
      topic: enhancedTopic,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      script_style: project.script_style,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || '16:9',
      ai_model: project.ai_model || 'veo3.1',
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model,
      grok_mode: project.settings?.grok_mode
    };

    console.log('🔍 [Step2 → Backend] Writing script with params:', {
      duration_minutes: scriptParams.duration_minutes,
      scene_length: scriptParams.scene_length,
      total_seconds: Math.round((scriptParams.duration_minutes || 0) * 60),
      expected_scenes: Math.floor(Math.round((scriptParams.duration_minutes || 0) * 60) / (scriptParams.scene_length || 15)),
      ai_model: scriptParams.ai_model,
      llm_model: scriptParams.llm_model,
    });

    generateScript(scriptParams);
  };

  const handleGenerateMore = async () => {
    if (!project) return;
    const newIdeas = await generateHooks({
      niche_id: project.niche_id,
      topic: project.topic,
      script_style: project.script_style,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || '16:9',
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model,
      grok_mode: project.settings?.grok_mode
    } as any);
    if (newIdeas && newIdeas.length > 0) {
      setGeneratedIdeas([...(generatedIdeas || []), ...newIdeas]);
    }
  };

  return {
    project,
    generatedIdeas,
    isGenerating,
    isGeneratingHooks,
    selectedIndex,
    setSelectedIndex,
    customTitle,
    setCustomTitle,
    customHook,
    setCustomHook,
    isGeneratingCustomHook,
    activeSubNiche,
    showSubNicheModal,
    setShowSubNicheModal,
    modalStep,
    setModalStep,
    tempSubNiche,
    setTempSubNiche,
    activeNicheObj,
    handleSubNicheSelect,
    handleAngleSelect,
    handleGenerateCustomHook,
    handleWriteScript,
    handleGenerateMore,
    setStep
  };
}
