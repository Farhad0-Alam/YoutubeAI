/**
 * ═══════════════════════════════════════════════════════════════════════
 * VOICE PRODUCTION LOGIC — YouTube-Safe Automated Word Budget Engine
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Core Formula:
 *   usable_seconds = clip_duration × (1 - breath_overhead)
 *   max_words      = usable_seconds × (WPM ÷ 60)
 *   safe_range     = 75%–100% of max_words
 *
 * Three Key Variables:
 *   WPM            — voice profile speed (80–170)
 *   breath_overhead — time for pauses, emphasis, transitions (25%–35%)
 *   clip_duration   — scene length in seconds (4–15s)
 */

// ── Voice Presets ────────────────────────────────────────────────────────
export type VoicePresetId = 'calm_narrator' | 'confident_presenter' | 'energetic_hook' | 'dramatic_pause' | 'whisper_intimate' | 'urgent_reporter';

export interface VoicePreset {
  id: VoicePresetId;
  label: string;
  wpm: number;              // Words per minute
  breathOverhead: number;   // 0.25 = 25%
  emotion: string;          // Default emotion tag for AI
  description: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'calm_narrator',
    label: 'Calm Narrator',
    wpm: 130,
    breathOverhead: 0.35,
    emotion: 'calm',
    description: 'Measured pace, breathing room, documentary style'
  },
  {
    id: 'confident_presenter',
    label: 'Confident Presenter',
    wpm: 150,
    breathOverhead: 0.30,
    emotion: 'confident',
    description: 'Professional, clear, TED-talk style'
  },
  {
    id: 'energetic_hook',
    label: 'Energetic Hook',
    wpm: 165,
    breathOverhead: 0.25,
    emotion: 'excited',
    description: 'High-energy, fast, attention-grabbing'
  },
  {
    id: 'dramatic_pause',
    label: 'Dramatic Pause',
    wpm: 90,
    breathOverhead: 0.35,
    emotion: 'dramatic',
    description: 'Slow, heavy pauses, cinematic weight'
  },
  {
    id: 'whisper_intimate',
    label: 'Whisper / Intimate',
    wpm: 110,
    breathOverhead: 0.30,
    emotion: 'whisper',
    description: 'Soft, close-mic, ASMR-adjacent'
  },
  {
    id: 'urgent_reporter',
    label: 'Urgent Reporter',
    wpm: 170,
    breathOverhead: 0.25,
    emotion: 'urgent',
    description: 'Breaking news, fast-paced, high stakes'
  }
];

// ── Scene Type Detection ─────────────────────────────────────────────────
export type SceneType = 'hook' | 'body' | 'cta';

export function detectSceneType(sceneIndex: number, totalScenes: number): SceneType {
  if (sceneIndex === 0) return 'hook';
  if (sceneIndex >= totalScenes - 1) return 'cta';
  return 'body';
}

/**
 * Auto-select the best voice preset based on scene type.
 * - Hook clips → energetic_hook
 * - Body clips → confident_presenter
 * - CTA close  → calm_narrator
 */
export function getPresetForSceneType(sceneType: SceneType): VoicePreset {
  switch (sceneType) {
    case 'hook': return VOICE_PRESETS.find(p => p.id === 'energetic_hook')!;
    case 'cta':  return VOICE_PRESETS.find(p => p.id === 'calm_narrator')!;
    default:     return VOICE_PRESETS.find(p => p.id === 'confident_presenter')!;
  }
}

// ── Core Word Budget Calculator ──────────────────────────────────────────
export interface WordBudget {
  clipDuration: number;
  usableSeconds: number;
  wordsPerSec: number;
  maxWords: number;
  safeMin: number;
  safeMax: number;
  sceneType: SceneType;
  preset: VoicePreset;
}

/**
 * Calculate the exact word budget for a clip.
 *
 * @param clipDuration  — Duration of the clip in seconds (4–15)
 * @param sceneIndex    — Index of this scene (0-based)
 * @param totalScenes   — Total number of scenes in the video
 * @param overridePreset — Optional: force a specific voice preset
 */
export function calculateWordBudget(
  clipDuration: number,
  sceneIndex: number,
  totalScenes: number,
  overridePreset?: VoicePresetId
): WordBudget {
  const sceneType = detectSceneType(sceneIndex, totalScenes);
  const preset = overridePreset
    ? VOICE_PRESETS.find(p => p.id === overridePreset)!
    : getPresetForSceneType(sceneType);

  const wordsPerSec = 2; // Target: At least 2 meaningful words per second
  const minWords = Math.round(clipDuration * wordsPerSec);
  const maxWords = Math.round(clipDuration * 4); // ABSOLUTE MAX: 4 meaningful words per second

  return {
    clipDuration,
    usableSeconds: clipDuration,
    wordsPerSec,
    minWords,
    maxWords,
    safeMax: maxWords,
    sceneType,
    preset
  };
}

// ── Narration Validator ──────────────────────────────────────────────────
export type PacingStatus = 'perfect' | 'tight' | 'over' | 'under' | 'empty';

export interface NarrationValidation {
  wordCount: number;
  budget: WordBudget;
  status: PacingStatus;
  message: string;
  color: string;        // Tailwind color class
  bgColor: string;      // Tailwind bg class
}

export function validateNarration(
  narrationText: string,
  clipDuration: number,
  sceneIndex: number,
  totalScenes: number
): NarrationValidation {
  // Strip emotion tags like [dramatic] before counting
  const cleanText = (narrationText || '').replace(/\[.*?\]/g, '').trim();
  const wordCount = cleanText.length > 0
    ? cleanText.split(/\s+/).filter(w => w.length > 2).length
    : 0;

  const budget = calculateWordBudget(clipDuration, sceneIndex, totalScenes);

  let status: PacingStatus;
  let message: string;
  let color: string;
  let bgColor: string;

  if (wordCount === 0) {
    status = 'empty';
    message = `Need ${budget.minWords}–${budget.maxWords} meaningful words`;
    color = 'text-gray-400';
    bgColor = 'bg-gray-50';
  } else if (wordCount > budget.safeMax) {
    const overBy = wordCount - budget.safeMax;
    status = 'over';
    message = `${overBy} word${overBy > 1 ? 's' : ''} OVER — max is ${budget.maxWords} (4 w/s)`;
    color = 'text-red-600';
    bgColor = 'bg-red-50';
  } else if (wordCount < budget.minWords) {
    const underBy = budget.minWords - wordCount;
    status = 'under';
    message = `${underBy} word${underBy > 1 ? 's' : ''} SHORT — add more content`;
    color = 'text-amber-600';
    bgColor = 'bg-amber-50';
  } else if (wordCount === budget.safeMax) {
    status = 'tight';
    message = `At max capacity — no room for pauses`;
    color = 'text-blue-600';
    bgColor = 'bg-blue-50';
  } else {
    status = 'perfect';
    message = `Perfect pacing`;
    color = 'text-emerald-600';
    bgColor = 'bg-emerald-50';
  }

  return { wordCount, budget, status, message, color, bgColor };
}

// ── AI Prompt Helper ─────────────────────────────────────────────────────
/**
 * Generate the word budget instruction string for AI prompts.
 * This is injected into the system prompt so the AI auto-calculates
 * the correct word count per scene.
 */
export function buildWordBudgetPromptRules(): string {
  return `
VOICE & WORD BUDGET RULES (MANDATORY — STRICTLY ENFORCE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET PACING: 2 TO 4 MEANINGFUL WORDS PER SECOND.
- MINIMUM: 2 words/sec (Strict)
- MAXIMUM: 4 words/sec (Absolute Limit)

WORD COUNTING RULE:
- Do NOT count words with only 1 or 2 letters (e.g., "a", "is", "to", "in", "it"). 
- ONLY count "Meaningful Words" (words with 3+ characters).

Meaningful Word Budget Table:
  4s → 8-16 words |  5s → 10-20 words |  6s → 12-24 words
  7s → 14-28 words |  8s → 16-32 words |  9s → 18-36 words
  10s → 20-40 words | 12s → 24-48 words | 15s → 30-60 words

RULES:
1. EVERY narration field MUST start with an emotion tag: [excited], [dramatic], [calm], [urgent], [whisper], [confident], [angry], [sad], [terrified], [happy], [warm]
2. The number of Meaningful Words MUST NOT exceed the budget listed above for the scene's duration_seconds.
3. If a scene is 10 seconds, it MUST have EXACTLY or slightly FEWER than 20 meaningful words.
4. Each scene MUST have a DIFFERENT emotion tag — never repeat the same emotion consecutively.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

// ── Total Script Calculator ──────────────────────────────────────────────
export interface ScriptBudgetSummary {
  totalScenes: number;
  totalDuration: number;
  totalMinWords: number;
  totalMaxWords: number;
  sceneBudgets: WordBudget[];
}

export function calculateScriptBudget(
  scenes: Array<{ duration_seconds?: number }>
): ScriptBudgetSummary {
  const totalScenes = scenes.length;
  const sceneBudgets = scenes.map((scene, idx) =>
    calculateWordBudget(scene.duration_seconds || 10, idx, totalScenes)
  );

  return {
    totalScenes,
    totalDuration: sceneBudgets.reduce((sum, b) => sum + b.clipDuration, 0),
    totalMinWords: sceneBudgets.reduce((sum, b) => sum + b.safeMin, 0),
    totalMaxWords: sceneBudgets.reduce((sum, b) => sum + b.safeMax, 0),
    sceneBudgets
  };
}
