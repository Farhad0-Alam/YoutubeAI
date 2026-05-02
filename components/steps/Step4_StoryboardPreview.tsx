import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { Camera, Image as ImageIcon, Copy, Check, Film, Volume2, Music2, Sparkles, Wand2 } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { SceneCard } from '../ui/SceneCard';

export function Step4_StoryboardPreview() {
  const { scriptData, project, setStep, updateScene } = useVideoStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingScene, setGeneratingScene] = useState<number | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [voiceToggles, setVoiceToggles] = useState<Record<string, boolean>>({});
  const [textToggles, setTextToggles] = useState<Record<string, boolean>>({});

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
    if (!scriptData) return;
    setGeneratingAll(true);
    for (let i = 0; i < scriptData.scenes.length; i++) {
      await handleGenerateSubScenes(i);
    }
    setGeneratingAll(false);
    toast.success('All sub-scene prompts generated!');
  };

  if (!scriptData) return null;

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
    const scene = scriptData.scenes[sceneIdx];
    const sub = scene.sub_scenes?.[subIdx] || {};
    
    let styleStr = 'Cinematic realism, 4K, 60fps, teal-orange grade, high quality';
    const aspectRatio = project?.aspect_ratio || '16:9';
    const aiModel = project?.ai_model || 'seedance2.0';

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
        sub.multiple_text_overlays.forEach((overlay, i) => {
          prompt += `\n\nTEXT OVERLAY ${i + 1}: "${overlay.text.trim()}"`;
          if (overlay.position) prompt += `\nPOSITION: ${overlay.position}`;
          if (overlay.animation) prompt += `\nANIMATION: ${overlay.animation}`;
          if (overlay.box_style) prompt += `\nBOX/BACKGROUND STYLE: ${overlay.box_style}`;
          if (overlay.start_time !== undefined) prompt += `\nTIMING: Starts at ${overlay.start_time}s`;
        });
      } else if (txt) {
        prompt += `\n\nText Overlay: ${txt.trim()}`;
        if (sub.text_position) prompt += `\nPosition: ${sub.text_position}`;
        if (sub.text_animation) prompt += `\nAnimation: ${sub.text_animation}`;
      }
    }
    if (sub.vfx || scene.vfx) prompt += `\n\nVFX: ${(sub.vfx || scene.vfx).trim()}`;
    if (sub.sound || scene.sound) prompt += `\n\nSound: ${(sub.sound || scene.sound).trim()}`;
    if (sub.music || scene.music) prompt += `\n\nMusic: ${(sub.music || scene.music).trim()}`;
    if (sub.camera_motion || scene.camera_motion) prompt += `\n\nCamera Motion: ${(sub.camera_motion || scene.camera_motion).trim()}`;
    if (sub.color_grading || scene.color_grading) prompt += `\n\nColor Grading: ${(sub.color_grading || scene.color_grading).trim()}`;
    if (sub.emotional_arc || scene.emotional_arc) prompt += `\n\nEmotional Arc: ${(sub.emotional_arc || scene.emotional_arc).trim()}`;
    if (sub.transition || scene.transition) prompt += `\n\nTransition: ${(sub.transition || scene.transition).trim()}`;
    if (sub.timing_and_pacing || scene.timing_and_pacing) prompt += `\n\nTiming & Pacing: ${(sub.timing_and_pacing || scene.timing_and_pacing).trim()}`;
    if (sub.call_to_action_cue || scene.call_to_action_cue) prompt += `\n\nCall To Action: ${(sub.call_to_action_cue || scene.call_to_action_cue).trim()}`;

    return prompt;
  };

  const buildFullSubSceneImagePrompt = (sceneIdx: number, subIdx: number) => {
    const scene = scriptData.scenes[sceneIdx];
    const sub = scene.sub_scenes?.[subIdx] || {};
    
    const subject = sub.image_subject || scene.image_subject || '';
    const setting = sub.image_setting || scene.image_setting || '';
    const mood = sub.image_mood || scene.image_mood || '';
    const lighting = sub.image_lighting || scene.image_lighting || '';
    const colorGrade = sub.image_color_grade || scene.image_color_grade || '';
    const cameraAngle = sub.image_camera_angle || scene.image_camera_angle || '';
    const shotType = sub.image_shot_type || scene.image_shot_type || '';
    const styleModifier = sub.image_style_modifier || scene.image_style_modifier || '';

    const newPrompt = [
      subject,
      setting,
      mood,
      lighting,
      colorGrade,
      cameraAngle,
      shotType,
      styleModifier
    ].filter(Boolean).join(', ');

    const aspectRatio = sub.image_aspect_ratio || scene.image_aspect_ratio || '';
    const seed = sub.image_seed || scene.image_seed || '';
    const quality = sub.image_quality || scene.image_quality || '';
    const characterRef = sub.image_character_consistency || scene.image_character_consistency || '';
    const negativePrompt = sub.image_negative_prompt || scene.image_negative_prompt || '';

    const suffixes = [aspectRatio, seed, quality, characterRef, negativePrompt].filter(Boolean).join(' ');
    
    return `${newPrompt}. ${suffixes}`.trim();
  };

  // Split text into N roughly-equal word chunks
  const splitText = (text: string, n: number): string[] => {
    if (!text) return Array(n).fill('');
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const result: string[] = Array(n).fill('');
    if (words.length === 0) return result;
    
    // Distribute words evenly
    const wordsPerChunk = Math.ceil(words.length / n);
    for (let i = 0; i < n; i++) {
      const start = i * wordsPerChunk;
      const end = Math.min(start + wordsPerChunk, words.length);
      result[i] = words.slice(start, end).join(' ');
    }
    return result;
  };

  const CopyBtn = ({ text, id, className = '' }: { text: string; id: string; className?: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      className={`p-1.5 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 focus:opacity-100 ${className}`}
      title="Copy"
    >
      {copiedId === id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-8 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display flex items-center gap-2">
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
          Storyboard Preview
        </h2>
        <p className="text-sm sm:text-base text-gray-500">Every sub-scene has its own narration, prompts, and production details for precise AI video generation.</p>
        <button
          onClick={handleGenerateAll}
          disabled={generatingAll || generatingScene !== null}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
        >
          {generatingAll ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Generating All...</>
          ) : (
            <><Wand2 className="w-4 h-4" /> Generate All Sub-Scene Prompts</>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-8 pb-32 space-y-10">
        {scriptData.scenes.map((scene, index) => {
          const totalSeconds = scene.duration_seconds || 15;
          const numSubScenes = Math.max(1, Math.ceil(totalSeconds / 4));
          const subScenes = Array.from({ length: numSubScenes }).map((_, i) => {
            const start = Math.floor(i * (totalSeconds / numSubScenes));
            const end = Math.floor((i + 1) * (totalSeconds / numSubScenes));
            return { id: i + 1, timeString: `0:${start.toString().padStart(2, '0')} - 0:${end.toString().padStart(2, '0')}` };
          });
          const narSlices = splitText(scene.narration || '', numSubScenes);

          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Scene Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-indigo-50/50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {(scene.scene_number || index + 1).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Scene {scene.scene_number || index + 1}</h3>
                    <span className="text-xs text-gray-500 font-medium">{totalSeconds}s · {numSubScenes} sub-scenes · ~4s each</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
                  {scene.transition || 'cut'}
                </span>
              </div>

              {/* Sub-Scenes — Detailed Mode */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Sub-Scene Breakdown</h4>
                    <span className="text-[9px] font-medium text-white bg-indigo-500 px-2 py-0.5 rounded-full">Detailed Mode</span>
                  </div>
                  <button
                    onClick={() => handleGenerateSubScenes(index)}
                    disabled={generatingScene !== null || generatingAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {generatingScene === index ? (
                      <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600" /> Generating...</>
                    ) : (
                      <><Wand2 className="w-3.5 h-3.5" /> Generate Prompts</>
                    )}
                  </button>
                </div>

                <div className="space-y-5">
                  {subScenes.map((sub, subIdx) => {
                    const d = scene.sub_scenes?.[subIdx];
                    const img = d?.image_prompt || '';
                    const vid = d?.video_prompt || '';
                    const nar = d?.narration || narSlices[subIdx] || '';
                    const txt = d?.text_overlay || scene.text_overlay || '';
                    const vfx = d?.vfx || scene.vfx || '';
                    const snd = d?.sound || scene.sound || '';
                    const mus = d?.music || scene.music || '';
                    const cam = d?.camera_motion || scene.camera_motion || '';
                    const clr = d?.color_grading || scene.color_grading || '';
                    const emo = d?.emotional_arc || scene.emotional_arc || '';
                    const hasAiPrompts = !!d?.image_prompt;
                    const pre = `${index}-${sub.id}`;
                    
                    // No fallbacks for detailed options; must be generated newly
                    const fallbackSubject = '';
                    const fallbackSetting = '';

                    return (
                      <div key={sub.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Sub-scene header */}
                        <div className="flex justify-between items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                          <div className="font-bold text-gray-800 text-sm">Sub-scene {scene.scene_number || index + 1}.{sub.id}</div>
                          <div className="text-xs text-gray-500 font-medium bg-white px-2.5 py-1 rounded border border-gray-200">{sub.timeString}</div>
                        </div>

                        <div className="p-0 grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-200">
                          {/* Image Part (Left) */}
                          <div className="p-4 space-y-4 bg-indigo-50/10">
                            <div className="flex items-center gap-2 mb-2">
                              <ImageIcon className="w-4 h-4 text-indigo-500" />
                              <h5 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded">Image Asset</h5>
                            </div>

                            <div className="relative group">
                              <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                Image Prompt
                                {!hasAiPrompts && (
                                  <button 
                                    onClick={() => handleGenerateSubScenes(index)}
                                    disabled={generatingScene === index}
                                    className="text-[9px] text-indigo-400 normal-case hover:text-indigo-700 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                                  >
                                    {generatingScene === index ? <div className="animate-spin rounded-full h-2 w-2 border-b border-indigo-600" /> : <Wand2 className="w-2.5 h-2.5" />}
                                    (click Generate Prompts)
                                  </button>
                                )}
                              </label>
                              <textarea
                                value={img}
                                onChange={(e) => handleSubSceneUpdate(index, subIdx, 'image_prompt', e.target.value)}
                                className={`w-full rounded-lg p-3 text-xs text-gray-700 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white min-h-[90px] resize-y pr-8 ${hasAiPrompts ? 'bg-indigo-50/40 border border-indigo-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}
                                placeholder="Click 'Generate Prompts' above to create a unique image prompt for this sub-scene, or type manually..."
                              />
                              <CopyBtn text={buildFullSubSceneImagePrompt(index, subIdx)} id={`img-full-btn-${pre}`} className="absolute top-7 right-1.5" />
                            </div>

                            <div className="relative group">
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Text Overlays & Captions</label>
                                <button
                                  onClick={() => {
                                    const currentOverlays = d?.multiple_text_overlays || [];
                                    handleSubSceneUpdate(index, subIdx, 'multiple_text_overlays', [
                                      ...currentOverlays,
                                      { text: '', position: 'Default (Center)', animation: 'None / Static', box_style: 'None (Transparent Background)' }
                                    ] as any);
                                  }}
                                  className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100 transition-colors"
                                >
                                  + Add Text Effect
                                </button>
                              </div>

                              {(d?.multiple_text_overlays && d.multiple_text_overlays.length > 0) ? (
                                <div className="space-y-3">
                                  {d.multiple_text_overlays.map((overlay: any, overlayIdx: number) => (
                                    <div key={overlayIdx} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 relative group/overlay">
                                      <button 
                                        onClick={() => {
                                          const currentOverlays = [...(d.multiple_text_overlays || [])];
                                          currentOverlays.splice(overlayIdx, 1);
                                          handleSubSceneUpdate(index, subIdx, 'multiple_text_overlays', currentOverlays as any);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover/overlay:opacity-100 transition-opacity"
                                      >×</button>
                                      <input
                                        type="text"
                                        value={overlay.text}
                                        onChange={(e) => {
                                          const currentOverlays = [...d.multiple_text_overlays!];
                                          currentOverlays[overlayIdx] = { ...currentOverlays[overlayIdx], text: e.target.value };
                                          handleSubSceneUpdate(index, subIdx, 'multiple_text_overlays', currentOverlays as any);
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                        placeholder={`Overlay text ${overlayIdx + 1}...`}
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <select
                                          value={overlay.animation}
                                          onChange={(e) => {
                                            const currentOverlays = [...d.multiple_text_overlays!];
                                            currentOverlays[overlayIdx] = { ...currentOverlays[overlayIdx], animation: e.target.value };
                                            handleSubSceneUpdate(index, subIdx, 'multiple_text_overlays', currentOverlays as any);
                                          }}
                                          className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-1 text-[10px] text-gray-700"
                                        >
                                          <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                                          <optgroup label="Standard Animations">
                                            <option value="None / Static">None / Static</option>
                                            <option value="Typewriter">Typewriter</option>
                                            <option value="Slide Up Fade">Slide Up Fade</option>
                                            <option value="Smooth Pop-up">Smooth Pop-up</option>
                                          </optgroup>
                                          <optgroup label="Premium / After Effects Style">
                                            <option value="Kinetic Typography Reveal">Kinetic Typography Reveal</option>
                                            <option value="Data Glitch RGB Split">Data Glitch RGB Split</option>
                                            <option value="Cinematic Title Swipe">Cinematic Title Swipe</option>
                                            <option value="Slow Tracking (Letter Spacing)">Slow Tracking (Letter Spacing Increase)</option>
                                            <option value="3D Extrusion Rotation">3D Extrusion Rotation</option>
                                            <option value="Liquid Distortion Reveal">Liquid Distortion Reveal</option>
                                            <option value="Masked Wipe (Left to Right)">Masked Wipe (Left to Right)</option>
                                            <option value="Masked Wipe (Bottom to Top)">Masked Wipe (Bottom to Top)</option>
                                            <option value="Blur to Sharp Reveal">Blur to Sharp Reveal</option>
                                            <option value="Overshoot Scale Bounce">Overshoot Scale Bounce</option>
                                            <option value="Random Character Shuffle">Random Character Shuffle (Hacker Effect)</option>
                                            <option value="Echo / Motion Blur Trail">Echo / Motion Blur Trail</option>
                                          </optgroup>
                                          <optgroup label="Cinematic & Glow Effects">
                                            <option value="Light Streak Reveal">Light Streak Reveal</option>
                                            <option value="Cinematic Lens Flare Sweep">Cinematic Lens Flare Sweep</option>
                                            <option value="Neon Pulse Reveal">Neon Pulse Reveal</option>
                                            <option value="Holographic Glitch">Holographic Glitch</option>
                                            <option value="Glowing Edge Trace">Glowing Edge Trace</option>
                                            <option value="Ethereal Smoke Fade">Ethereal Smoke Fade</option>
                                            <option value="Saber Energy Outline">Saber Energy Outline</option>
                                            <option value="Chromatic Aberration Shift">Chromatic Aberration Shift</option>
                                          </optgroup>
                                        </select>
                                        <select
                                          value={overlay.position}
                                          onChange={(e) => {
                                            const currentOverlays = [...d.multiple_text_overlays!];
                                            currentOverlays[overlayIdx] = { ...currentOverlays[overlayIdx], position: e.target.value };
                                            handleSubSceneUpdate(index, subIdx, 'multiple_text_overlays', currentOverlays as any);
                                          }}
                                          className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-1 text-[10px] text-gray-700"
                                        >
                                          <option value="Default (Center)">Default (Center)</option>
                                          <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                                          <option value="Top Center">Top Center</option>
                                          <option value="Bottom Center">Bottom Center</option>
                                          <option value="Top Left">Top Left</option>
                                          <option value="Top Right">Top Right</option>
                                          <option value="Bottom Left">Bottom Left</option>
                                          <option value="Bottom Right">Bottom Right</option>
                                          <option value="Center Left">Center Left</option>
                                          <option value="Center Right">Center Right</option>
                                        </select>
                                        <select
                                          value={overlay.box_style || 'None (Transparent Background)'}
                                          onChange={(e) => {
                                            const currentOverlays = [...d.multiple_text_overlays!];
                                            currentOverlays[overlayIdx] = { ...currentOverlays[overlayIdx], box_style: e.target.value };
                                            handleSubSceneUpdate(index, subIdx, 'multiple_text_overlays', currentOverlays as any);
                                          }}
                                          className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-1 text-[10px] text-gray-700 col-span-2"
                                        >
                                          <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                                          <optgroup label="Clean & Minimal">
                                            <option value="None (Transparent Background)">None (Transparent Background)</option>
                                            <option value="Solid Black Box">Solid Black Box (Like Captions)</option>
                                            <option value="Solid White Box">Solid White Box</option>
                                            <option value="Soft Gradient Fade">Soft Gradient Fade (Bottom up)</option>
                                          </optgroup>
                                          <optgroup label="Outlined / Strokes">
                                            <option value="Glowing White Outline Box">Glowing White Outline Box</option>
                                            <option value="Thick Black Stroke">Thick Black Stroke on Text</option>
                                            <option value="Neon Border Box">Neon Border Box</option>
                                          </optgroup>
                                          <optgroup label="Cinematic / News Style">
                                            <option value="Translucent Glassmorphism Box">Translucent Glassmorphism Box</option>
                                            <option value="Lower Third News Banner">Lower Third News Banner</option>
                                            <option value="Cinematic Letterbox Overlay">Cinematic Letterbox Overlay</option>
                                          </optgroup>
                                        </select>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={txt}
                                    onChange={(e) => handleSubSceneUpdate(index, subIdx, 'text_overlay', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white pr-8"
                                    placeholder="Short caption..."
                                  />
                                  <CopyBtn text={txt} id={`txt-${pre}`} className="absolute top-1.5 right-1.5" />
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="relative group">
                                <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> VFX</label>
                                <input type="text" value={vfx} onChange={(e) => handleSubSceneUpdate(index, subIdx, 'vfx', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white" placeholder="VFX effects..." />
                                <CopyBtn text={vfx} id={`vfx-${pre}`} className="absolute top-7 right-1.5" />
                              </div>
                              <div className="relative group">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Camera Motion</label>
                                <input type="text" value={cam} onChange={(e) => handleSubSceneUpdate(index, subIdx, 'camera_motion', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" placeholder="Camera direction..." />
                              </div>
                            </div>

                            {/* Detailed Image Breakdown Options */}
                            <div className="pt-3 border-t border-indigo-100/50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Detailed Image Options</div>
                                <button 
                                  onClick={() => handleCopy(buildFullSubSceneImagePrompt(index, subIdx), `img-full-${pre}`)}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-[10px] font-semibold transition-colors"
                                >
                                  {copiedId === `img-full-${pre}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `img-full-${pre}` ? 'Copied!' : 'Copy Full Image Prompt'}
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  ['Subject', 'image_subject'],
                                  ['Setting / Background', 'image_setting'],
                                  ['Mood', 'image_mood'],
                                  ['Lighting Style', 'image_lighting'],
                                  ['Color Grade', 'image_color_grade'],
                                  ['Camera Angle', 'image_camera_angle'],
                                  ['Shot Type', 'image_shot_type'],
                                  ['Style Modifier', 'image_style_modifier'],
                                  ['Aspect Ratio', 'image_aspect_ratio'],
                                  ['Seed', 'image_seed'],
                                  ['Quality Suffix', 'image_quality'],
                                  ['Character Ref', 'image_character_consistency'],
                                  ['Negative Prompt', 'image_negative_prompt'],
                                ].map(([label, key]) => (
                                  <div key={key} className="relative group">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                                    <input 
                                      type="text" 
                                      value={
                                        (d as any)?.[key] || 
                                        (scene as any)?.[key] || 
                                        (key === 'image_subject' ? fallbackSubject : 
                                         key === 'image_setting' ? fallbackSetting : '')
                                      } 
                                      onChange={(e) => handleSubSceneUpdate(index, subIdx, key as any, e.target.value)} 
                                      className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400" 
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Video Part (Right) */}
                          <div className="p-4 space-y-4 bg-emerald-50/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Film className="w-4 h-4 text-emerald-500" />
                              <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">Video Asset</h5>
                            </div>

                            <div className="relative group">
                              <div className="flex flex-wrap items-center justify-between mb-1.5 gap-2">
                                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                                  <Camera className="w-3 h-3" /> Video Prompt
                                  {!hasAiPrompts && (
                                    <button 
                                      onClick={() => handleGenerateSubScenes(index)}
                                      disabled={generatingScene === index}
                                      className="text-[9px] text-indigo-400 normal-case hover:text-indigo-700 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                                    >
                                      {generatingScene === index ? <div className="animate-spin rounded-full h-2 w-2 border-b border-indigo-600" /> : <Wand2 className="w-2.5 h-2.5" />}
                                      (click Generate Prompts)
                                    </button>
                                  )}
                                </label>
                                <div className="flex flex-wrap items-center gap-3">
                                  <label className="flex items-center cursor-pointer">
                                    <span className="mr-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Include Voice</span>
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={voiceToggles[`${index}-${subIdx}`] ?? true}
                                      onChange={() => setVoiceToggles(prev => ({ ...prev, [`${index}-${subIdx}`]: !(prev[`${index}-${subIdx}`] ?? true) }))}
                                    />
                                    <span className={`relative block w-6 h-3 rounded-full transition-colors ${voiceToggles[`${index}-${subIdx}`] ?? true ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                      <span className={`absolute left-0.5 top-0.5 h-2 w-2 rounded-full bg-white transition-transform ${voiceToggles[`${index}-${subIdx}`] ?? true ? 'translate-x-3' : ''}`} />
                                    </span>
                                  </label>
                                  <label className="flex items-center cursor-pointer">
                                    <span className="mr-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Include Text</span>
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={textToggles[`${index}-${subIdx}`] ?? true}
                                      onChange={() => setTextToggles(prev => ({ ...prev, [`${index}-${subIdx}`]: !(prev[`${index}-${subIdx}`] ?? true) }))}
                                    />
                                    <span className={`relative block w-6 h-3 rounded-full transition-colors ${textToggles[`${index}-${subIdx}`] ?? true ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                      <span className={`absolute left-0.5 top-0.5 h-2 w-2 rounded-full bg-white transition-transform ${textToggles[`${index}-${subIdx}`] ?? true ? 'translate-x-3' : ''}`} />
                                    </span>
                                  </label>
                                  <button
                                    onClick={() => handleSubSceneUpdate(index, subIdx, 'video_prompt', buildFullSubSceneVideoPrompt(index, subIdx))}
                                    className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold transition-colors"
                                  >
                                    Write to Video Prompt
                                  </button>
                                  <button
                                    onClick={() => handleCopy(buildFullSubSceneVideoPrompt(index, subIdx), `vid-ai-${pre}`)}
                                    className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-[10px] font-semibold transition-colors"
                                  >
                                    {copiedId === `vid-ai-${pre}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {copiedId === `vid-ai-${pre}` ? 'Copied!' : 'Copy AI Prompt'}
                                  </button>
                                </div>
                              </div>
                              <textarea
                                value={vid}
                                onChange={(e) => handleSubSceneUpdate(index, subIdx, 'video_prompt', e.target.value)}
                                className={`w-full rounded-lg p-3 text-xs text-gray-700 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white min-h-[90px] resize-y pr-8 ${hasAiPrompts ? 'bg-emerald-50/40 border border-emerald-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}
                                placeholder="Click 'Generate Prompts' above to create a unique video prompt for this sub-scene, or type manually..."
                              />
                              <CopyBtn text={buildFullSubSceneVideoPrompt(index, subIdx)} id={`vid-full-btn-${pre}`} className="absolute top-7 right-1.5" />
                            </div>

                            <div className="relative group">
                              <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Volume2 className="w-3 h-3" /> Narration
                              </label>
                              <textarea
                                value={nar}
                                onChange={(e) => handleSubSceneUpdate(index, subIdx, 'narration', e.target.value)}
                                className="w-full bg-orange-50/40 border border-orange-100 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white min-h-[60px] resize-y pr-8"
                                placeholder="Narration for this sub-scene..."
                              />
                              <CopyBtn text={nar} id={`nar-${pre}`} className="absolute top-7 right-1.5" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="relative group">
                                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Volume2 className="w-3 h-3" /> Sound</label>
                                <input type="text" value={snd} onChange={(e) => handleSubSceneUpdate(index, subIdx, 'sound', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white" placeholder="Sound design..." />
                                <CopyBtn text={snd} id={`snd-${pre}`} className="absolute top-7 right-1.5" />
                              </div>
                              <div className="relative group">
                                <label className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Music2 className="w-3 h-3" /> Music</label>
                                <input type="text" value={mus} onChange={(e) => handleSubSceneUpdate(index, subIdx, 'music', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white" placeholder="Music..." />
                                <CopyBtn text={mus} id={`mus-${pre}`} className="absolute top-7 right-1.5" />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="relative group">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Color Grading</label>
                                <input type="text" value={clr} onChange={(e) => handleSubSceneUpdate(index, subIdx, 'color_grading', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" placeholder="Color grading..." />
                              </div>
                              <div className="relative group">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Emotional Arc</label>
                                <input type="text" value={emo} onChange={(e) => handleSubSceneUpdate(index, subIdx, 'emotional_arc', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" placeholder="Emotion..." />
                              </div>
                            </div>

                            {/* Detailed Video Breakdown Options */}
                            <div className="pt-3 border-t border-emerald-100/50">
                              <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mb-3">Detailed Video Options</div>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  ['Timing & Pacing', 'timing_and_pacing'],
                                  ['Transition', 'transition'],
                                  ['CTA Cue', 'call_to_action_cue']
                                ].map(([label, key]) => (
                                  <div key={key} className="relative group">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                                    <input 
                                      type="text" 
                                      value={(d as any)?.[key] || (scene as any)?.[key] || ''} 
                                      onChange={(e) => handleSubSceneUpdate(index, subIdx, key as any, e.target.value)} 
                                      className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-400" 
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 sm:p-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
          <button onClick={() => setStep(3)} className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors text-center">
            Back to Script
          </button>
          <button onClick={() => setStep(5)} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            Continue to Generate Media
          </button>
        </div>
      </div>
    </div>
  );
}
