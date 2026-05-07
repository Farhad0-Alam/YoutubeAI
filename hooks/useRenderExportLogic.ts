import { useState, useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { useHistoryStore } from '../store/historyStore';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { compileAndDownloadVideo } from '../lib/videoCompiler';

export function useRenderExportLogic() {
  const { project, scriptData, voices, setVoices, setStep } = useVideoStore();
  const saveProject = useHistoryStore(state => state.saveProject);
  
  const [selectedVoice, setSelectedVoice] = useState('en-US-GuyNeural');
  const [isPrepping, setIsPrepping] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.getVoices().then(data => {
      setVoices(data);
      // Auto-select first voice matching project gender
      if (project?.voice) {
        const match = data.find((v: any) => v.gender.toLowerCase() === project.voice.toLowerCase());
        if (match) setSelectedVoice(match.id);
      }
    }).catch(console.error);
  }, [setVoices, project?.voice]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateSEO = async () => {
    if (!project || !scriptData) return;
    setIsGeneratingSEO(true);
    try {
      const fullScript = scriptData.scenes.map(s => s.narration).join(" ");
      const data = await api.generateSEOPackage({
        script: fullScript,
        title: project.topic,
        niche: project.niche_id,
        llm_model: project.settings?.llm_model
      });

      let currentSeconds = 0;
      let timestampsStr = "\n\nTimestamps:\n";
      scriptData.scenes.forEach((scene, i) => {
        const mins = Math.floor(currentSeconds / 60);
        const secs = Math.floor(currentSeconds % 60);
        const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        timestampsStr += `${timeFormatted} - ${scene.search_keyword || "Scene " + (i+1)}\n`;
        currentSeconds += scene.duration_seconds || 15;
      });

      data.description = data.description + timestampsStr;
      setSeoData(data);
      toast.success('YouTube SEO Metadata generated!');
    } catch (err) {
      toast.error('Failed to generate SEO Metadata');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const startLocalRender = async () => {
    if (!project || !scriptData) return;
    setIsPrepping(true);
    
    toast.info('Generating AI Voiceover...', { duration: 4000 });
    
    try {
      const audioRes = await api.generateTTS({ scenes: scriptData.scenes, voice: selectedVoice });
      
      const newScenes = scriptData.scenes.map(s => {
        const match = audioRes.audio_files.find((a: any) => a.scene_number === s.scene_number);
        return { ...s, audio_url: match ? match.url : null };
      });

      useVideoStore.getState().setScriptData({ ...scriptData, scenes: newScenes });
      saveProject(project, { ...scriptData, scenes: newScenes });

      setRenderComplete(true);
      toast.success('Sequence Compiled successfully!');
    } catch (err) {
      toast.error('Failed to generate voiceovers. Did you add an OpenAI key?');
    } finally {
      setIsPrepping(false);
    }
  };

  const handleDownloadProjectZip = () => {
    if (!scriptData) return;
    const projectData = JSON.stringify(scriptData, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${project?.niche_id}_assets.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
    toast.success("Project data downloaded. Ready for CapCut!");
  };

  const handleExportVideo = async () => {
    if (!scriptData) return;
    setIsExporting(true);
    try {
      await compileAndDownloadVideo(scriptData.scenes, project?.aspect_ratio);
    } catch (e) {
      toast.error('Export failed or canceled');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    project,
    scriptData,
    voices,
    selectedVoice,
    setSelectedVoice,
    isPrepping,
    renderComplete,
    showEditor,
    setShowEditor,
    isExporting,
    isGeneratingSEO,
    seoData,
    copiedId,
    handleCopy,
    handleGenerateSEO,
    startLocalRender,
    handleDownloadProjectZip,
    handleExportVideo,
    setStep
  };
}
