import { useState } from 'react';
import { api } from '../lib/api';
import { useVideoStore } from '../store/videoStore';
import { toast } from 'sonner';

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { setScriptData, setStep, setProject } = useVideoStore();

  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);

  const generateHooks = async (params: any) => {
    setIsGeneratingHooks(true);
    try {
      const data = await api.generateHooksAndTitles(params);
      
      const projectData = {
        niche_id: params.niche_id,
        topic: params.topic,
        script_style: params.script_style,
        visual_style: params.visual_style || "cinematic",
        duration_minutes: params.duration_minutes,
        scene_length: params.scene_length,
        ai_model: params.ai_model,
        voice: params.voice_gender,
        aspect_ratio: params.aspect_ratio || "16:9",
        status: "draft",
        settings: {
          llm_model: params.llm_model,
          ollama_url: params.ollama_url,
          ollama_model: params.ollama_model,
        },
      };
      
      const proj = await api.createProject(projectData);
      setProject({ ...projectData, _id: proj._id } as any);
      
      return data.ideas;
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate hooks and titles');
      throw e;
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const generateScript = async (params: any) => {
    setIsGenerating(true);
    try {
      const data = await api.generateScript({
        ...params,
        ai_model: params.ai_model,
        aspect_ratio: params.aspect_ratio,
      });
      setScriptData(data);
      
      const projectData = {
        title: data.title,
        niche_id: params.niche_id,
        topic: params.topic,
        script_style: params.script_style,
        visual_style: params.visual_style || "cinematic",
        duration_minutes: params.duration_minutes,
        scene_length: params.scene_length,
        ai_model: params.ai_model,
        voice: params.voice_gender,
        aspect_ratio: params.aspect_ratio || "16:9",
        status: "script_ready",
        settings: {
          llm_model: params.llm_model,
          ollama_url: params.ollama_url,
          ollama_model: params.ollama_model,
        },
      };
      const proj = await api.createProject(projectData);
      setProject({ ...projectData, _id: proj._id } as any);
      
      setStep(3);
      toast.success('Script generated successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateScript, isGenerating, generateHooks, isGeneratingHooks };
}
