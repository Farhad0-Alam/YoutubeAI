import { useState, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import { api } from '../lib/api';
import { toast } from 'sonner';
import * as htmlToImage from 'html-to-image';

export function useThumbnailStudioLogic() {
  const { scriptData, project, setStep } = useVideoStore();
  
  // Extract all generated image prompts from Storyboard
  const availableImagePrompts: { label: string, prompt: string }[] = [];
  scriptData?.scenes?.forEach((scene) => {
    if (scene.image_prompt) {
      availableImagePrompts.push({ label: `Scene ${scene.scene_number}`, prompt: scene.image_prompt });
    }
    scene.sub_scenes?.forEach((sub, subIdx) => {
      if (sub.image_prompt) {
        availableImagePrompts.push({ label: `Shot ${scene.scene_number}.${subIdx + 1}`, prompt: sub.image_prompt });
      }
    });
  });

  // Extract all text overlays from Storyboard
  const availableTexts = Array.from(new Set<string>(
    (scriptData?.scenes?.flatMap(scene => [
      scene.text_overlay,
      ...(scene.sub_scenes?.map(sub => sub.text_overlay) || [])
    ]) || []).filter(t => t && t.trim().length > 3)
  ));

  const defaultFilter = scriptData?.scenes?.[0]?.color_grading?.toLowerCase().includes('desaturate') ? 'grayscale(100%) border-white' : 'none';
  const defaultPrompt = availableImagePrompts[0]?.prompt || scriptData?.niche_config?.image_prompt_style || 'Dramatic dark lighting';

  const [title, setTitle] = useState(scriptData?.title?.substring(0, 30) || 'Shocking Update');
  const [subtitle, setSubtitle] = useState(availableTexts[0] || 'Watch this now');
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [fontFamily, setFontFamily] = useState('Inter');
  const [filter, setFilter] = useState(defaultFilter);
  const [textY, setTextY] = useState(50);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'>('center');
  const [isBrainstormingPrompts, setIsBrainstormingPrompts] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<{label: string, prompt: string}[]>([]);

  const handleBrainstormPrompts = async () => {
    if (!scriptData || !project) return;
    setIsBrainstormingPrompts(true);
    try {
      const res = await api.generateThumbnailPrompts({
        title: title || scriptData.title,
        niche_id: scriptData.niche_id,
        llm_model: 'gemini'
      });
      if (res.prompts) {
        setGeneratedPrompts(res.prompts);
        toast.success('Generated 3 viral thumbnail prompts!');
      }
    } catch (e) {
      toast.error('Failed to brainstorm prompts');
    } finally {
      setIsBrainstormingPrompts(false);
    }
  };

  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!project) return;
    setIsGenerating(true);
    try {
      const res = await api.generateThumbnail({
        background_prompt: prompt
      });
      setThumbnailUrl(res.thumbnail_url);
      toast.success('Background generated!');
    } catch (e) {
      toast.error('Failed to generate background');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'thumbnail_custom.png';
      a.click();
      toast.success('Download started');
    } catch (err) {
      console.error(err);
      toast.error("Failed to render final image. Check CORS or use a supported browser.");
    }
  };

  return {
    scriptData,
    project,
    availableImagePrompts,
    availableTexts,
    title, setTitle,
    subtitle, setSubtitle,
    prompt, setPrompt,
    thumbnailUrl, setThumbnailUrl,
    isGenerating,
    generatedPrompts,
    isBrainstormingPrompts,
    handleBrainstormPrompts,
    fontFamily, setFontFamily,
    filter, setFilter,
    textY, setTextY,
    textColor, setTextColor,
    textAlign, setTextAlign,
    previewRef,
    handleGenerate,
    handleDownload,
    setStep
  };
}
