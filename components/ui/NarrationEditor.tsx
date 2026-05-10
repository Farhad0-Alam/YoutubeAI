import React from 'react';
import { Volume2, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { validateNarration, calculateWordBudget, detectSceneType, getPresetForSceneType, type NarrationValidation } from '../../lib/voiceLogic';

interface NarrationEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  bgClass?: string;
  borderClass?: string;
  textClass?: string;
  iconClass?: string;
  labelClass?: string;
  /** Scene duration in seconds — enables word budget validation */
  clipDuration?: number;
  /** Scene index (0-based) — used for scene type detection */
  sceneIndex?: number;
  /** Total scenes — used for scene type detection */
  totalScenes?: number;
  /** Scene context for AI narration generation */
  sceneContext?: {
    visual_description?: string;
    image_prompt?: string;
    search_keyword?: string;
    text_overlay?: string;
    topic?: string;
    niche?: string;
  };
}

export function NarrationEditor({
  value,
  onChange,
  label = "Voice / Narration",
  placeholder = "Enter narration text...",
  className = "",
  bgClass = "bg-orange-50/40",
  borderClass = "border-orange-100",
  textClass = "text-orange-600",
  iconClass = "text-orange-500",
  labelClass = "text-orange-600",
  clipDuration,
  sceneIndex = 0,
  totalScenes = 1,
  sceneContext
}: NarrationEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── AI Narration Generation ──────────────────────────────────────────
  const handleAINarration = async () => {
    if (!clipDuration || clipDuration <= 0) return;
    setIsGenerating(true);

    try {
      const budget = calculateWordBudget(clipDuration, sceneIndex, totalScenes);
      const sceneType = detectSceneType(sceneIndex, totalScenes);
      const preset = getPresetForSceneType(sceneType);

      // Build a rich prompt for the AI
      const visualContext = sceneContext?.visual_description || sceneContext?.image_prompt || '';
      const keyword = sceneContext?.search_keyword || '';
      const topic = sceneContext?.topic || '';
      const overlay = sceneContext?.text_overlay || '';

      const prompt = `You are a professional YouTube voiceover script writer. Generate a narration line for a video scene.

SCENE CONTEXT:
- Topic: ${topic || 'General'}
- Visual: ${visualContext || 'Not specified'}
- Keywords: ${keyword || 'Not specified'}
- Text Overlay: ${overlay || 'None'}
- Scene Position: ${sceneType === 'hook' ? 'OPENING HOOK (Scene 1)' : sceneType === 'cta' ? 'CLOSING CTA (Final Scene)' : `BODY (Scene ${sceneIndex + 1} of ${totalScenes})`}
- Scene Duration: ${clipDuration} seconds

WORD BUDGET (STRICTLY ENFORCE):
- MINIMUM: ${budget.minWords} words
- TARGET: ${budget.minWords + 2} words
- Voice preset: ${preset.label} (${preset.wpm} WPM)

RULES:
1. Every scene MUST have AT LEAST ${budget.minWords} words.
2. ${sceneType === 'hook' ? 'Make it attention-grabbing, high-energy, create instant curiosity' : sceneType === 'cta' ? 'Make it warm, inviting, with a clear call to action (subscribe, like, comment)' : 'Make it informative, engaging, building on the topic with vivid language'}
3. Sound natural and human — avoid robotic or generic phrasing
4. Match the visual context provided

Return ONLY the narration text. No explanation. No quotes around it. No emotion tags in brackets.`;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { temperature: 0.8 }
      });

      const result = await model.generateContent(prompt);
      let narration = result.response.text()?.trim() || '';

      // Clean up: remove surrounding quotes if present
      if ((narration.startsWith('"') && narration.endsWith('"')) || (narration.startsWith("'") && narration.endsWith("'"))) {
        narration = narration.slice(1, -1);
      }

      // Ensure no brackets (emotions) are in narration
      narration = narration.replace(/\[.*?\]/g, '').trim();

      onChange(narration);
    } catch (err: any) {
      console.error('AI Narration Error:', err);
      // Fallback: generate a placeholder with correct word count
      const budget = calculateWordBudget(clipDuration, sceneIndex, totalScenes);
      const sceneType = detectSceneType(sceneIndex, totalScenes);
      const preset = getPresetForSceneType(sceneType);
      onChange(`[${preset.emotion}] (AI generation failed — please write at least ${budget.minWords} meaningful words here)`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Word budget validation (only if clipDuration is provided)
  let validation: NarrationValidation | null = null;
  if (clipDuration && clipDuration > 0) {
    validation = validateNarration(value || '', clipDuration, sceneIndex, totalScenes);
  }

  // Word count (all words)
  const cleanText = (value || '').replace(/\[.*?\]/g, '').trim();
  const wordCount = cleanText.length > 0 ? cleanText.split(/\s+/).filter(w => w.length > 0).length : 0;

  // Detect current emotion tag
  const emotionMatch = (value || '').match(/^\[([^\]]+)\]/);
  const currentEmotion = emotionMatch ? emotionMatch[1] : null;

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className={`text-xs uppercase tracking-wider font-bold flex items-center gap-2 ${labelClass}`}>
          <Volume2 className={`w-4 h-4 ${iconClass}`} /> {label}
          <span className="text-[10px] font-medium opacity-60 normal-case ml-1 tracking-normal">({clipDuration}s @ 2w/s)</span>
        </label>
        <div className="flex items-center gap-2">
          {/* AI Narration Button */}
          <button
            onClick={handleAINarration}
            disabled={isGenerating || !clipDuration}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-200 ${isGenerating
                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-sm hover:shadow-md active:scale-95'
              }`}
            title="Generate narration with AI — auto-applies emotion tag and word budget"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isGenerating ? 'Generating...' : 'AI Narration'}
          </button>


          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm transition-opacity hover:bg-gray-50"
            title="Copy Narration"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${bgClass} border ${borderClass} rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white min-h-[100px] resize-y transition-all`}
        placeholder={placeholder}
      />

      {/* Word Budget Bar */}
      {validation ? (
        <div className={`flex items-center gap-2 mt-1.5 px-2 py-1.5 rounded-lg ${validation.bgColor} border ${validation.color}`} style={{ borderColor: 'currentColor', borderWidth: '1px' }}>
          <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${validation.status === 'perfect' ? 'bg-emerald-500' :
                  validation.status === 'tight' ? 'bg-blue-500' :
                    validation.status === 'over' ? 'bg-red-500' :
                      validation.status === 'under' ? 'bg-amber-400' : 'bg-gray-300'
                }`}
              style={{ width: `${Math.min((wordCount / (validation.budget?.maxWords || 1)) * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold font-mono shrink-0">
            {wordCount}/{Math.round(clipDuration * 2.25)} target words
          </span>
          <span className="text-[9px] font-semibold shrink-0">
            {validation.status === 'perfect' ? '✅' : validation.status === 'over' ? '🔴' : validation.status === 'under' ? '🟠' : validation.status === 'tight' ? '🟡' : ''}
            {' '}{validation.message}
          </span>
        </div>
      ) : (
        value && (
          <div className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
            {wordCount} words
          </div>
        )
      )}
    </div>
  );
}
