import { useState, useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { useHistoryStore } from '../store/historyStore';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { compileAndDownloadVideo } from '../lib/videoCompiler';

export type GrokMode = 'single' | 'sub_clips' | 'grok_voice' | 'skip';
export type PipelineStage = 'idle' | 'tts' | 'grok' | 'render' | 'done';

export function useRenderExportLogic() {
  const { project, scriptData, voices, setVoices, setStep } = useVideoStore();
  const saveProject = useHistoryStore(state => state.saveProject);

  const [selectedVoice, setSelectedVoice] = useState('en-US-GuyNeural');
  const [grokMode, setGrokMode] = useState<GrokMode>('grok_voice');
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [grokProgress, setGrokProgress] = useState({ completed: 0, total: 0, message: '' });
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
        timestampsStr += `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')} - ${scene.search_keyword || "Scene " + (i+1)}\n`;
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
    setRenderComplete(false);

    try {
      let finalScenes = [...scriptData.scenes];

      // ── STAGE 1: TTS Voiceover (skip if using Grok for voice) ────────────
      if (grokMode !== 'grok_voice' && grokMode !== 'skip') {
        setPipelineStage('tts');
        toast.info('🎙️ Generating voiceover...', { duration: 3000 });
        const audioRes = await api.generateTTS({ scenes: scriptData.scenes, voice: selectedVoice });
        finalScenes = scriptData.scenes.map(s => {
          const match = audioRes.audio_files.find((a: any) => a.scene_number === s.scene_number);
          return { ...s, audio_url: match ? match.url : null };
        });
      } else if (grokMode === 'grok_voice') {
        toast.info('🎬 Grok Aurora will generate voice + video together...', { duration: 3000 });
      }

      // ── STAGE 2: Grok Video Generation ─────────────────────────────────
      if (grokMode !== 'skip') {
        setPipelineStage('grok');
        setGrokProgress({ completed: 0, total: scriptData.scenes.length, message: 'Submitting to Grok Aurora...' });

        const grokRes = await api.generateGrokVideos({
          scenes: scriptData.scenes.map(s => ({
            scene_number: s.scene_number,
            video_prompt: s.video_prompt || s.visual_description || '',
            duration_seconds: s.duration_seconds || 8,
            narration: grokMode === 'grok_voice' ? (s.narration || '') : ''
          })),
          aspect_ratio: project.aspect_ratio || '16:9',
          use_sub_clips: grokMode === 'sub_clips',
          onProgress: (completed, total, message) => {
            setGrokProgress({ completed, total, message });
          }
        });

        finalScenes = finalScenes.map(s => {
          const grokFile = grokRes.video_files.find((g: any) => g.scene_number === s.scene_number);
          return grokFile
            ? { ...s, grok_video_path: grokFile.file_path, grok_sub_clips: grokFile.sub_clips }
            : s;
        });
      }

      useVideoStore.getState().setScriptData({ ...scriptData, scenes: finalScenes });
      saveProject(project, { ...scriptData, scenes: finalScenes });

      setPipelineStage('done');
      setRenderComplete(true);
      toast.success(
        grokMode === 'grok_voice'
          ? '✅ Grok video + voice clips ready!'
          : grokMode === 'skip'
            ? '✅ Done! (Grok skipped — voiceover only)'
            : '✅ Voiceover + Grok video clips ready!'
      );
    } catch (err: any) {
      toast.error(err.message || 'Pipeline failed. Check console.');
      console.error('Pipeline error:', err);
    } finally {
      setIsPrepping(false);
      setPipelineStage('idle');
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
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
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
    grokMode,
    setGrokMode,
    pipelineStage,
    grokProgress,
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
