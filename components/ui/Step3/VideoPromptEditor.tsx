import React, { useState } from 'react';
import { Scene } from '../../../types';
import { Copy, Check, Film } from 'lucide-react';
import { useVideoStore } from '../../../store/videoStore';
import { NarrationEditor } from '../NarrationEditor';

interface VideoPromptEditorProps {
  scene: Scene;
  onUpdate: (data: Partial<Scene>) => void;
  sceneIndex?: number;
  totalScenes?: number;
}

export function VideoPromptEditor({ scene, onUpdate, sceneIndex = 0, totalScenes = 1 }: VideoPromptEditorProps) {
  const [copied, setCopied] = useState(false);
  const [includeVoice, setIncludeVoice] = useState(true);
  const [includeTextOverlay, setIncludeTextOverlay] = useState(true);
  const { project } = useVideoStore();

  const buildFullVideoPrompt = () => {
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

    const basePrompt = scene.video_prompt ? scene.video_prompt.trim() : scene.image_prompt ? scene.image_prompt.trim() : scene.visual_description?.trim();

    let prompt = '';

    if (aiModel === 'midjourney_v6') {
      prompt = `/imagine prompt: ${basePrompt}, highly detailed cinematic photography, 8k resolution ${styleStr}`;
    } else {
      prompt = `${basePrompt}\n\nStyle: ${styleStr}`;
    }

    if (includeVoice && scene.narration) prompt += `\n\nVOICEOVER: ${scene.narration.trim()}`;
    if (includeTextOverlay && scene.text_overlay) {
      prompt += `\n\nTEXT OVERLAY: "${scene.text_overlay.trim()}"`;

      let position = scene.text_position || 'Default (Center)';
      if (position === 'AI Auto-Select') {
        const positions = ['Top Center', 'Bottom Center', 'Top Left', 'Top Right', 'Bottom Left', 'Bottom Right', 'Center Left', 'Center Right', 'Default (Center)'];
        position = positions[Math.floor(Math.random() * positions.length)];
      }
      prompt += `\nPOSITION: ${position}`;

      let animation = scene.text_animation || 'None / Static';
      if (animation === 'AI Auto-Select') {
        const animations = [
          'Typewriter', 'Slide Up Fade', 'Smooth Pop-up',
          'Kinetic Typography Reveal', 'Data Glitch RGB Split', 'Cinematic Title Swipe',
          'Slow Tracking (Letter Spacing Increase)', '3D Extrusion Rotation', 'Liquid Distortion Reveal',
          'Masked Wipe (Left to Right)', 'Masked Wipe (Bottom to Top)', 'Blur to Sharp Reveal',
          'Overshoot Scale Bounce', 'Random Character Shuffle (Hacker Effect)', 'Echo / Motion Blur Trail',
          'Light Streak Reveal', 'Cinematic Lens Flare Sweep', 'Neon Pulse Reveal',
          'Holographic Glitch', 'Glowing Edge Trace', 'Ethereal Smoke Fade',
          'Saber Energy Outline', 'Chromatic Aberration Shift'
        ];
        animation = animations[Math.floor(Math.random() * animations.length)];
      }
      prompt += `\nANIMATION: ${animation}`;

      let boxStyle = (scene as any).text_box_style || 'None (Transparent Background)';
      if (boxStyle === 'AI Auto-Select') {
        const boxStyles = [
          'None (Transparent Background)', 'Solid Black Box (Like Captions)', 'Solid White Box', 'Soft Gradient Fade (Bottom up)',
          'Glowing White Outline Box', 'Thick Black Stroke on Text', 'Neon Border Box',
          'Translucent Glassmorphism Box', 'Lower Third News Banner', 'Cinematic Letterbox Overlay'
        ];
        boxStyle = boxStyles[Math.floor(Math.random() * boxStyles.length)];
      }
      prompt += `\nBOX/BACKGROUND STYLE: ${boxStyle}`;
    }
    if (scene.vfx) prompt += `\n\nVFX: ${scene.vfx.trim()}`;
    if (scene.sound) prompt += `\n\nSFX: ${scene.sound.trim()}`;
    if (scene.music) prompt += `\n\nBGM: ${scene.music.trim()}`;
    if (scene.camera_motion) prompt += `\n\nCAMERA MOTION: ${scene.camera_motion.trim()}`;
    if (scene.timing_and_pacing) prompt += `\n\nTIMING & PACING: ${scene.timing_and_pacing.trim()}`;
    if (scene.color_grading) prompt += `\n\nCOLOR GRADING / LUT: ${scene.color_grading.trim()}`;
    if (scene.transition) prompt += `\n\nTRANSITION: ${scene.transition.trim()}`;
    if (scene.emotional_arc) prompt += `\n\nEMOTIONAL ARC: ${scene.emotional_arc.trim()}`;
    if (scene.call_to_action_cue) prompt += `\n\nCALL TO ACTION: ${scene.call_to_action_cue.trim()}`;

    return prompt;
  };

  const handleWriteDetailsToVideoPrompt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({ video_prompt: buildFullVideoPrompt() });
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prompt = buildFullVideoPrompt();

    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6">


      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Video Search Keyword</label>
          <input
            type="text"
            value={scene.search_keyword}
            onChange={(e) => onUpdate({ search_keyword: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {(scene.visual_description || scene.video_prompt || scene.vfx || scene.sound || scene.music) && (
        <div className="mt-6 pt-5 border-t border-gray-100 space-y-6">
          <div>
            <div className="flex flex-col gap-3 mb-2 lg:flex-row lg:items-center lg:justify-between">
              <label className="text-xs uppercase tracking-wider font-bold text-gray-700 flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-500" /> Compiled Video Prompt
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center cursor-pointer">
                  <span className="mr-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Include Voice</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeVoice}
                    onChange={() => setIncludeVoice(value => !value)}
                  />
                  <span className={`relative block w-8 h-4 rounded-full transition-colors ${includeVoice ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                    <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${includeVoice ? 'translate-x-4' : ''}`} />
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Include Text</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeTextOverlay}
                    onChange={() => setIncludeTextOverlay(value => !value)}
                  />
                  <span className={`relative block w-8 h-4 rounded-full transition-colors ${includeTextOverlay ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                    <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${includeTextOverlay ? 'translate-x-4' : ''}`} />
                  </span>
                </label>
                <button
                  onClick={handleWriteDetailsToVideoPrompt}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors shadow-sm font-semibold text-[11px]"
                  title="Write selected details into the video prompt field"
                >
                  Write to Video Prompt
                </button>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors shadow-sm font-semibold text-[11px]"
                  title="Copy selected details as an AI prompt"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy AI Prompt'}
                </button>
              </div>
            </div>
            <div className="text-gray-700 font-mono text-xs leading-relaxed bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 break-words relative group">
              {scene.video_prompt || scene.visual_description || 'Video prompt pending.'}
              <button
                onClick={handleCopyPrompt}
                className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                title="Copy full video prompt with details"
              >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice / Narration — Moved below Compiled Video Prompt */}
      <NarrationEditor
        value={scene.narration || ''}
        onChange={(val) => onUpdate({ narration: val })}
        clipDuration={scene.duration_seconds}
        sceneIndex={sceneIndex}
        totalScenes={totalScenes}
        sceneContext={{
          visual_description: scene.visual_description || scene.video_prompt,
          image_prompt: scene.image_prompt,
          search_keyword: scene.search_keyword,
          text_overlay: scene.text_overlay,
          topic: project?.topic,
          niche: project?.niche_id,
        }}
      />

      <div className="mt-6 pt-5 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-500" /> Text Overlay & Effects
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Text Overlay / Captions</label>
            <textarea
              value={scene.text_overlay || ''}
              onChange={(e) => onUpdate({ text_overlay: e.target.value })}
              placeholder="Enter text to overlay on the video..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Text Position</label>
              <select
                value={scene.text_position || ''}
                onChange={(e) => onUpdate({ text_position: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="">Default (Center)</option>
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
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Text Animation & Glow</label>
              <select
                value={scene.text_animation || ''}
                onChange={(e) => onUpdate({ text_animation: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                <optgroup label="Standard Animations">
                  <option value="">None / Static</option>
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
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Text Box / Background Style</label>
              <select
                value={(scene as any).text_box_style || ''}
                onChange={(e) => onUpdate({ text_box_style: e.target.value } as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="AI Auto-Select">✨ AI Auto-Select ✨</option>
                <optgroup label="Clean & Minimal">
                  <option value="">None (Transparent Background)</option>
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
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sound Effect (SFX)</label>
              <input
                type="text"
                value={scene.sound || ''}
                onChange={(e) => onUpdate({ sound: e.target.value })}
                placeholder="e.g. Whoosh, UI pop click, beat-sync swoosh..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Advanced Cinematic Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Color Grading / LUT</label>
            <input
              type="text"
              value={scene.color_grading || ''}
              onChange={(e) => onUpdate({ color_grading: e.target.value })}
              placeholder="e.g. Warm teal-orange cinematic LUT"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Transition</label>
            <input
              type="text"
              value={scene.transition || ''}
              onChange={(e) => onUpdate({ transition: e.target.value })}
              placeholder="e.g. Dramatic clean wipe transition"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Timing & Pacing</label>
            <input
              type="text"
              value={scene.timing_and_pacing || ''}
              onChange={(e) => onUpdate({ timing_and_pacing: e.target.value })}
              placeholder="e.g. Beat-synced 1.5s cuts"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Camera Motion</label>
            <input
              type="text"
              value={scene.camera_motion || ''}
              onChange={(e) => onUpdate({ camera_motion: e.target.value })}
              placeholder="e.g. Smooth zoom-push, sweeping pan"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">BGM / Music Mood</label>
            <input
              type="text"
              value={scene.music || ''}
              onChange={(e) => onUpdate({ music: e.target.value })}
              placeholder="e.g. Upbeat modern corporate tech track, BPM shifts to 108"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">VFX / Lighting</label>
            <input
              type="text"
              value={scene.vfx || ''}
              onChange={(e) => onUpdate({ vfx: e.target.value })}
              placeholder="e.g. Anamorphic lens flare, Warm softbox key light"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Emotional Arc</label>
            <input
              type="text"
              value={scene.emotional_arc || ''}
              onChange={(e) => onUpdate({ emotional_arc: e.target.value })}
              placeholder="e.g. Tension building to release, Melancholy to hope"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Call To Action Cue</label>
            <input
              type="text"
              value={scene.call_to_action_cue || ''}
              onChange={(e) => onUpdate({ call_to_action_cue: e.target.value })}
              placeholder="e.g. Subscribe button pop-up, Point down gesture"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
