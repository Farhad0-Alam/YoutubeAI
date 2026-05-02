import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ScriptData } from '../types';

export interface HistoryItem {
  id: string;
  date: string;
  project: Project;
  scriptData: ScriptData;
}

interface HistoryState {
  history: HistoryItem[];
  saveProject: (project: Project, scriptData: ScriptData) => void;
  deleteProject: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      saveProject: (project, scriptData) => set((state) => {
        // Find if it exists and update, or add new
        const existingIndex = state.history.findIndex(item => item.id === project._id);
        const newItem = {
          id: project._id,
          date: new Date().toISOString(),
          project,
          scriptData
        };
        
        if (existingIndex >= 0) {
          const newHistory = [...state.history];
          newHistory[existingIndex] = newItem;
          return { history: newHistory };
        } else {
          return { history: [newItem, ...state.history] };
        }
      }),
      deleteProject: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id)
      })),
    }),
    {
      name: 'video-history-storage',
    }
  )
);
