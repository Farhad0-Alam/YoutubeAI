import React, { useState, useEffect } from 'react';
import { Copy, Check, Edit2, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { Scene } from '../../../types';

interface ImagePromptEditorProps {
  scene: Scene;
  globalAspectRatio: string;
  onUpdate?: (data: Partial<Scene>) => void;
}

export function ImagePromptEditor({ scene, globalAspectRatio, onUpdate }: ImagePromptEditorProps) {
  const [rawPrompt, setRawPrompt] = useState(scene.image_prompt || '');
  const [isCopied, setIsCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Field states
  const [subject, setSubject] = useState('');
  const [setting, setSetting] = useState('');
  const [mood, setMood] = useState(scene.image_mood || 'Reflective, slightly melancholic');
  const [lighting, setLighting] = useState(scene.image_lighting || 'Cinematic lighting');
  const [colorGrade, setColorGrade] = useState(scene.image_color_grade || 'Slightly desaturated, warm');
  const [cameraAngle, setCameraAngle] = useState(scene.image_camera_angle || 'Medium close-up, slightly low');
  const [shotType, setShotType] = useState(scene.image_shot_type || 'Shallow depth of field');
  const [styleModifier, setStyleModifier] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('--ar 16:9');
  const [seed, setSeed] = useState((scene.image_seed || '12345').replace(/^--seed\s+/i, ''));
  const [quality, setQuality] = useState(scene.image_quality || '--q 2 --style raw');
  const [characterRef, setCharacterRef] = useState(scene.image_character_consistency || '--cw 100');
  const [negativePrompt, setNegativePrompt] = useState(scene.image_negative_prompt || '--no text, watermarks, ugly');

  // Simple parser to initialize fields from raw text if possible, but mostly we'll just 
  // initialize subject and setting with basic parsing, and hardcode the rest for now
  useEffect(() => {
    if (scene.image_prompt && !subject) {
      const parts = scene.image_prompt.split(',');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parts.length > 0) setSubject(parts[0].trim());
      if (parts.length > 1) setSetting(parts[1].trim());
      if (parts.length > 2) setMood(parts[2].trim());
      
      // Map global aspect ratio to prompt parameter
      if (globalAspectRatio === '16:9') setAspectRatio('--ar 16:9');
      else if (globalAspectRatio === '9:16') setAspectRatio('--ar 9:16');
      else if (globalAspectRatio === '1:1') setAspectRatio('--ar 1:1');
    }
  }, [scene.image_prompt, globalAspectRatio, subject]);

  // Two way sync - whenever fields change, update raw prompt
  useEffect(() => {
    if (!showBreakdown) return; // Don't overwrite if user is freely typing

    let newPrompt = [
      subject,
      setting,
      mood,
      lighting,
      colorGrade,
      cameraAngle,
      shotType,
      styleModifier
    ].filter(Boolean).join(', ');

    // Add suffixes
    const suffixes = [aspectRatio, `--seed ${seed}`, quality, characterRef, negativePrompt].filter(Boolean).join(' ');
    
    const nextPrompt = `${newPrompt}. ${suffixes}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRawPrompt(nextPrompt);
    onUpdate?.({ image_prompt: nextPrompt });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, setting, mood, lighting, colorGrade, cameraAngle, shotType, styleModifier, aspectRatio, seed, quality, characterRef, negativePrompt, showBreakdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Textarea Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Storyboard Image Prompt</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">Auto-sync</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy prompt
          </button>
        </div>
        <div className="p-4 bg-white relative">
          <textarea
            value={rawPrompt}
            onChange={(e) => {
              setRawPrompt(e.target.value);
              onUpdate?.({ image_prompt: e.target.value });
              setShowBreakdown(false); // Disable auto-sync if they edit directly
            }}
            className="w-full text-sm text-gray-800 font-mono resize-y min-h-[80px] focus:outline-none focus:ring-0 border-0 p-0"
            placeholder="Enter your image prompt here..."
          />
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
             {/* Decorative up/down arrows from mockup */}
             <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200">▲</div>
             <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200">▼</div>
             <button onClick={() => setShowBreakdown(!showBreakdown)} className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${showBreakdown ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`} title="Toggle Breakdown Editor">
               <Edit2 className="w-3 h-3" />
             </button>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-[10px] text-gray-500">
          Edit directly or use the fields below — they stay in sync
        </div>
      </div>

      {/* Breakdown Section */}
      {showBreakdown && (
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl overflow-hidden p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Image Prompt Breakdown
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Editable</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="E.g., Contemplative woman, late 20s"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Setting / Background</label>
              <input
                type="text"
                value={setting}
                onChange={(e) => {
                  setSetting(e.target.value);
                  onUpdate?.({ image_environment: e.target.value });
                }}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                placeholder="E.g., Modern kitchen island, sunlight"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Mood</label>
              <select value={mood} onChange={(e) => {
                setMood(e.target.value);
                onUpdate?.({ image_mood: e.target.value });
              }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="Reflective, slightly melancholic">Reflective</option>
                <option value="Joyful and vibrant">Joyful</option>
                <option value="Dark, mysterious, tense">Mysterious</option>
                <option value="Calm, peaceful, serene">Serene</option>
                <option value="Energetic, dynamic, intense">Intense</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Lighting Style</label>
              <select value={lighting} onChange={(e) => {
                setLighting(e.target.value);
                onUpdate?.({ image_lighting: e.target.value });
              }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="Cinematic lighting">Cinematic lighting</option>
                <option value="Golden hour, natural light">Golden hour</option>
                <option value="Harsh studio lighting">Studio</option>
                <option value="Soft, overcast lighting">Overcast</option>
                <option value="Neon cyberpunk lighting">Cyberpunk</option>
                <option value="Backlit silhouette">Backlit</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Color Grade</label>
              <select value={colorGrade} onChange={(e) => {
                setColorGrade(e.target.value);
                onUpdate?.({ image_color_grade: e.target.value });
              }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="Slightly desaturated, warm">Desaturated, warm</option>
                <option value="High contrast, vibrant">Vibrant, bold</option>
                <option value="Cool blue and teal tones">Cool blue/teal</option>
                <option value="Sepia, vintage feel">Sepia / Vintage</option>
                <option value="Monochrome, black and white">Black & White</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Camera Angle</label>
              <select value={cameraAngle} onChange={(e) => {
                setCameraAngle(e.target.value);
                onUpdate?.({ image_camera_angle: e.target.value });
              }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="Medium close-up, slightly low">Medium close-up</option>
                <option value="Extreme close-up macro">Extreme close-up</option>
                <option value="Wide sensing establishing shot">Wide shot</option>
                <option value="Over the shoulder shot">Over shoulder</option>
                <option value="High angle, bird's-eye view">High angle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Shot Type</label>
              <select value={shotType} onChange={(e) => {
                setShotType(e.target.value);
                onUpdate?.({ image_shot_type: e.target.value });
              }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="Shallow depth of field">Shallow depth of field</option>
                <option value="Deep focus, everything crisp">Deep focus</option>
                <option value="Motion blur on subject">Motion blur</option>
                <option value="Lens flare, glowing aspects">Lens flare</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Style Modifier</label>
              <select value={styleModifier} onChange={(e) => setStyleModifier(e.target.value)} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="Photorealistic">Photorealistic</option>
                <option value="Cinematic movie still">Cinematic</option>
                <option value="Editorial fashion photography">Editorial</option>
                <option value="Anime style, Studio Ghibli">Anime / Ghibli</option>
                <option value="3D render, Pixar style">3D Render</option>
                <option value="Watercolor painting">Watercolor</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Aspect Ratio</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="--ar 16:9">16:9 (YouTube / widescreen)</option>
                <option value="--ar 9:16">9:16 (TikTok / Reels)</option>
                <option value="--ar 1:1">1:1 (Instagram Square)</option>
                <option value="--ar 4:3">4:3 (Standard)</option>
                <option value="--ar 3:4">3:4 (Portrait)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Seed</label>
              <input
                type="text"
                value={seed}
                onChange={(e) => {
                  setSeed(e.target.value);
                  onUpdate?.({ image_seed: `--seed ${e.target.value}` });
                }}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Quality Suffix</label>
              <select value={quality} onChange={(e) => {
                setQuality(e.target.value);
                onUpdate?.({ image_quality: e.target.value });
              }} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white">
                <option value="--q 2 --style raw">--q 2 --style raw (Midjourney)</option>
                <option value="--v 6.0">--v 6.0</option>
                <option value="--niji 6">--niji 6 (Anime)</option>
                <option value="">None</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Character Ref</label>
              <input
                type="text"
                value={characterRef}
                onChange={(e) => {
                  setCharacterRef(e.target.value);
                  onUpdate?.({ image_character_consistency: e.target.value });
                }}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Negative Prompt</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => {
                  setNegativePrompt(e.target.value);
                  onUpdate?.({ image_negative_prompt: e.target.value });
                }}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Live Prompt Preview */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Live Prompt Preview</h4>
            <div className="bg-[#f2f1eb] border border-[#e1dfd4] rounded-lg p-4 font-mono text-xs text-gray-600 leading-relaxed shadow-inner overflow-hidden text-ellipsis">
              {rawPrompt || 'Start typing or select options to generate prompt...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
