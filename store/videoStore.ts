import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ScriptData, Voice, NicheConfig } from '../types';

interface VideoState {
  currentStep: number;
  highestStep: number;
  project: Project | null;
  scriptData: ScriptData | null;
  generatedIdeas: { title: string, hook: string }[] | null;
  voices: Voice[];
  audioFiles: any[];
  setStep: (step: number) => void;
  setProject: (project: Project) => void;
  setScriptData: (data: ScriptData) => void;
  setGeneratedIdeas: (ideas: { title: string, hook: string }[]) => void;
  updateScene: (sceneIndex: number, data: any) => void;
  setVoices: (voices: Voice[]) => void;
  setAudioFiles: (files: any[]) => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      currentStep: 1,
      highestStep: 1,
      project: null,
      scriptData: null,
      generatedIdeas: null,
      voices: [],
      audioFiles: [],
      setStep: (step) => set((state) => ({ 
        currentStep: step,
        highestStep: Math.max(state.highestStep, step)
      })),
      setProject: (project) => set({ project }),
      setScriptData: (data) => set({ scriptData: data }),
      setGeneratedIdeas: (ideas) => set({ generatedIdeas: ideas }),
      updateScene: (index, data) => set((state) => {
        if (!state.scriptData) return state;
        const newScenes = [...state.scriptData.scenes];
        newScenes[index] = { ...newScenes[index], ...data };
        return { scriptData: { ...state.scriptData, scenes: newScenes } };
      }),
      setVoices: (voices) => set({ voices }),
      setAudioFiles: (files) => set({ audioFiles: files }),
    }),
    {
      name: 'youtubeai-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        currentStep: state.currentStep,
        highestStep: state.highestStep,
        project: state.project,
        scriptData: state.scriptData,
        generatedIdeas: state.generatedIdeas
        // we omit voices and audioFiles as they might be large and ephemeral
      }),
    }
  )
);
