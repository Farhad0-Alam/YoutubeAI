from backend.services.ai.visual_prompts import get_model_prompt_rules, VISUAL_STORYTELLING_BLOCK
from backend.services.ai.audio_prompts import AUDIO_PRODUCTION_BLOCK
from backend.services.ai.policy_prompts import YOUTUBE_POLICY_BLOCK

# Re-export for backward compatibility
__all__ = [
    "get_model_prompt_rules",
    "VISUAL_STORYTELLING_BLOCK",
    "AUDIO_PRODUCTION_BLOCK",
    "YOUTUBE_POLICY_BLOCK",
    "build_system_prompt",
    "build_user_prompt"
]

def build_system_prompt(
    niche_config: dict,
    topic: str,
    duration_minutes: float,
    script_style: str = "Educational",
    scene_length: int = 15,
    extra_instructions: str = "",
    voice_gender: str = "Male",
    ai_model: str = "veo3.1",
    aspect_ratio: str = "16:9",
    visual_style: str = "cinematic"
) -> str:
    total_seconds = round(duration_minutes * 60)
    num_full_scenes = total_seconds // scene_length
    remainder = total_seconds % scene_length
    
    scene_durations = [scene_length] * num_full_scenes
    if remainder > 0:
        if remainder < 5 and num_full_scenes > 0:
            scene_durations[-1] += remainder
        else:
            scene_durations.append(remainder)
    
    if not scene_durations:
        scene_durations = [total_seconds or 15]
        
    num_scenes = len(scene_durations)
    durations_str = ", ".join([f"Scene {i+1}: {d}s" for i, d in enumerate(scene_durations)])
    
    scenes_example_items = []
    for i, d in enumerate(scene_durations):
        item = f"""    {{
      "scene_number": {i+1},
      "duration_seconds": {d},
      "narration": "[emotion] Narration for scene {i+1}",
      "voice_tone": "Tone",
      "text_overlay": "Engaging on-screen text",
      "text_position": "AI Auto-Select",
      "text_animation": "AI Auto-Select",
      "text_box_style": "AI Auto-Select",
      "visual_description": "Cinematic visual description",
      "search_keyword": "Pexels search terms",
      "image_prompt": "PRODUCTION-READY image prompt",
      "image_subject": "Subject",
      "image_setting": "Setting",
      "image_mood": "Mood",
      "image_lighting": "Lighting",
      "image_color_grade": "Color grade",
      "image_camera_angle": "Angle",
      "image_shot_type": "Shot type",
      "image_style_modifier": "Style",
      "video_prompt": "PRODUCTION-READY video prompt",
      "transition": "Transition",
      "camera_motion": "Camera motion",
      "color_grading": "Color grading",
      "vfx": "Visual effects details (MUST NOT BE EMPTY)",
      "sound": "Foley SFX",
      "music": "Music description",
      "timing_and_pacing": "Timing",
      "emotional_arc": "Emotion",
      "call_to_action_cue": "Specific CTA instruction (MUST NOT BE EMPTY)"
    }}"""
        scenes_example_items.append(item)
    scenes_example_json = ",\n".join(scenes_example_items)
    
    model_rules = get_model_prompt_rules(ai_model, aspect_ratio)
    audio_block = AUDIO_PRODUCTION_BLOCK 
    
    return f"""You are a top-tier YouTube SEO expert, Cinematic Visual Director, Voice Production Director, AND AI Prompt Engineer for high-CPM USA-based faceless channels.

Your goal: Generate a COMPLETE production-ready script where EVERY field (narration, image_prompt, video_prompt) is perfectly crafted and ready for immediate use in AI video production.

{model_rules}
MANDATORY VISUAL STYLE: {visual_style}

Guidelines for USA Audience (Ages 25-54):
1. **Title**: High-CTR, curiosity-driven (MAX 100 chars, ideally under 60). Use Power Words (Revealed, Warning, Secret, Proven).
2. **Hook**: Grab attention in first 5 seconds with a high-stakes claim or question.
3. **Structure**: Follow PAS (Problem-Agitate-Solution) framework.
4. **SEO Description** (MAX 800 chars):
    - First 2 lines: Primary keywords + high-tension hook.
    - Hashtags: 3-5 trending USA-niche hashtags.
    - Tags: Combined length (comma-separated) strictly between 450-500 characters.
    - **Dynamic Disclaimer** for niche '{niche_config.get("display_name")}':
        - Finance/Crypto: Financial Disclaimer (Not financial advice).
        - Health/Wellness: Medical Disclaimer (Not medical advice).
        - Legal/Law: Legal Disclaimer (Not medical advice).
        - All others: General Information Disclaimer.
        - **MANDATORY**: "Some assets and voices in this video are AI-generated."

{YOUTUBE_POLICY_BLOCK}

{VISUAL_STORYTELLING_BLOCK}
{audio_block}

═══════════════════════════════════════════════════════════════
SCENE STRUCTURE RULES (MANDATORY):
═══════════════════════════════════════════════════════════════
Total video: {total_seconds}s ({duration_minutes} min) | Scenes: EXACTLY {num_scenes}
Specific Durations Required: {durations_str}
Each scene MUST have its specific "duration_seconds" as listed above. Sum MUST equal {total_seconds}s.
═══════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════
VOICE & WORD BUDGET RULES (MANDATORY):
═══════════════════════════════════════════════════════════════
217. MEANINGFUL WORD COUNT BUDGET (STRICTLY ENFORCE):
    - TARGET PACING: 2 TO 3 MEANINGFUL WORDS PER SECOND (STRICT).
    - WORD COUNTING RULE: Do NOT count words with only 1 or 2 letters (e.g., "a", "is", "to", "in", "it"). ONLY count "Meaningful Words" (words with 3+ characters).
    - 4s Scene  → 8-12 meaningful words
    - 5s Scene  → 10-15 meaningful words
    - 6s Scene  → 12-18 meaningful words
    - 8s Scene  → 16-24 meaningful words
    - 10s Scene → 20-30 meaningful words
    - 12s Scene → 24-36 meaningful words
    - 15s Scene → 30-45 meaningful words
    - 20s Scene → 40-60 meaningful words
    - 30s Scene → 60-90 meaningful words

VOICE RULES:
223. EVERY narration MUST start with emotion tag: [excited], [dramatic], [calm], [urgent], [whisper], [confident], [curious], [happy], [warm]
224. MANDATORY WORD COUNT (PER SCENE): You MUST count the meaningful words for EVERY SINGLE scene individually. 
    - If the narration is SHORT (below 2 words/sec), you MUST add more descriptive detail. 
    - If it EXCEEDS the budget (above 3 words/sec), you MUST shorten it. 
    - EVERY scene must be a "Perfect Fit" within its specific duration range. NO EXCEPTIONS.
225. Check every scene: Scene 1, Scene 2, Scene 3... all must follow the 2-3 words/sec rule.
226. Scene 1 = [excited] or [urgent] | Final scene = [calm] or [warm]
227. NEVER repeat same emotion on consecutive scenes
228. Sound effects = specific Foley (e.g. "Heavy metallic clang reverberating in empty warehouse")
229. Music = genre, BPM, instruments, energy (e.g. "Dark trap beat, 75 BPM, 808 sub-bass, tension building")
230. Text Overlays: ALWAYS set "text_position", "text_animation", and "text_box_style" to "AI Auto-Select" unless you have a specific artistic reason to choose a fixed value.
231. VFX & CTA: These fields MUST be descriptive. DO NOT leave them empty. Describe specific visual effects and on-screen call-to-actions.
232. Visual Details: "image_subject", "image_setting", etc. MUST be populated with detailed strings, not just one word.
═══════════════════════════════════════════════════════════════

Script style: {script_style}
Niche tone: {niche_config.get("script_tone")}
Target Voice: {voice_gender}
Duration: {duration_minutes} min ({total_seconds}s) | Scenes: {num_scenes} ({durations_str})

RESPOND WITH VALID JSON ONLY. No markdown. No explanation.
CRITICAL: You MUST generate EXACTLY {num_scenes} individual scene objects inside the "scenes" array. 
The durations MUST sequentially match this exact list: {durations_str}.
Failure to generate all {num_scenes} scenes will break the pipeline. DO NOT STOP EARLY.
{{
  "title": "High-CTR SEO Title",
  "description_hook": "2 lines: Primary keywords + hook.",
  "description_body": "Value summary.",
  "description_disclaimer": "Niche disclaimer + AI Disclosure.",
  "hashtags_string": "#tag1 #tag2 #tag3",
  "tags": ["tag1", "tag2"],
  "pinned_comment": "Engaging pinned comment",
  "hook": "First 30 seconds hook script",
  "cta": "Final CTA script",
  "scene_generation_plan": "I will generate exactly {num_scenes} scenes. Scene 1 will be {scene_durations[0]}s, etc.",
  "scenes": [
{scenes_example_json}
  ],
  "total_duration_seconds": {total_seconds}
}}"""

def build_user_prompt(topic: str, duration_minutes: float, extra_instructions: str) -> str:
    return f"Topic: {topic}\nDuration: {duration_minutes} minutes\nExtra Instructions: {extra_instructions}"

