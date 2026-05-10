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
    visual_style: str = "cinematic",
    grok_mode: bool = False   # True = skip image fields, focus on video_prompt + narration
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
    
    # Build a locked Voice Actor Anchor from user's selection
    if voice_gender.lower() == "female":
        voice_actor_anchor = "narrated by a confident American female narrator, 30-40 years old, warm clear alto voice, consistent throughout all scenes"
        voice_tone_example = "Confident Female — warm, clear alto, American accent"
    else:
        voice_actor_anchor = "narrated by a confident American male narrator, 35-45 years old, deep baritone voice, authoritative and consistent throughout all scenes"
        voice_tone_example = "Confident Male — deep baritone, American accent, authoritative"

    scenes_example_items = []
    for i, d in enumerate(scene_durations):
        if grok_mode:
            # Grok mode: skip image_* fields — Grok Aurora handles visuals + voice in one step
            item = f"""    {{
      "scene_number": {i+1},
      "duration_seconds": {d},
      "narration": "EXACT {round(d*2.25)} words of narration — {voice_actor_anchor}.",
      "voice_tone": "{voice_tone_example}",
      "text_overlay": "Short engaging on-screen caption (max 6 words)",
      "text_position": "bottom-center",
      "visual_description": "Detailed cinematic visual description for this scene",
      "video_prompt": "GROK-READY video prompt. {voice_actor_anchor}. Camera: [exact movement]. Subject: [exact action]. Scene: [environment detail]. Mood: [atmosphere]. Style: {visual_style}.",
      "transition": "Smooth cut or cross-dissolve",
      "camera_motion": "Explicit camera directions",
      "color_grading": "Color grading intent",
      "sound": "Specific Foley SFX (High-fidelity description)",
      "music": "Genre, BPM, instruments, energy",
      "timing_and_pacing": "Target: {round(d*2.25)} words for {d}s",
      "emotional_arc": "Emotional beat for this scene",
      "call_to_action_cue": "Specific CTA for this scene (MUST NOT BE EMPTY)"
    }}"""
        else:
            item = f"""    {{
      "scene_number": {i+1},
      "duration_seconds": {d},
      "narration": "Narration for scene {i+1} — EXACTLY {round(d*2.25)} words",
      "voice_tone": "{voice_tone_example}",
      "text_overlay": "Engaging on-screen text",
      "text_position": "AI Auto-Select",
      "text_animation": "AI Auto-Select",
      "text_box_style": "AI Auto-Select",
      "visual_description": "Cinematic visual description",
      "search_keyword": "Pexels search terms",
      "image_prompt": "PRODUCTION-READY image prompt. {voice_actor_anchor}.",
      "image_subject": "Subject",
      "image_setting": "Setting",
      "image_mood": "Mood",
      "image_lighting": "Lighting",
      "image_color_grade": "Color grade",
      "image_camera_angle": "Angle",
      "image_shot_type": "Shot type",
      "image_style_modifier": "Style",
      "video_prompt": "PRODUCTION-READY video prompt. {voice_actor_anchor}. Camera: [exact movement]. Subject: [exact action].",
      "transition": "Transition",
      "camera_motion": "Camera motion",
      "color_grading": "Color grading",
      "vfx": "Visual effects details (MUST NOT BE EMPTY)",
      "sound": "Foley SFX",
      "music": "Music description",
      "timing_and_pacing": "Target: {round(d*2.25)} words for {d}s",
      "emotional_arc": "Steady",
      "call_to_action_cue": "Specific CTA instruction (MUST NOT BE EMPTY)"
    }}"""
        scenes_example_items.append(item)
    scenes_example_json = ",\n".join(scenes_example_items)
    
    model_rules = get_model_prompt_rules(ai_model, aspect_ratio)
    audio_block = AUDIO_PRODUCTION_BLOCK.replace("{voice_gender}", voice_gender)
    
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
217. WORD COUNT BUDGET (STRICTLY ENFORCE — NO SILENCE, NO RUSHING):
    - TARGET PACING: 2.25 WORDS PER SECOND (MANDATORY).
    - WORD COUNTING RULE: Count EVERY single word.
    - 4s  → EXACTLY 9 words
    - 5s  → EXACTLY 11 words
    - 6s  → EXACTLY 14 words
    - 7s  → EXACTLY 16 words
    - 8s  → EXACTLY 18 words
    - 9s  → EXACTLY 20 words
    - 10s → EXACTLY 23 words
    - 11s → EXACTLY 25 words
    - 12s → EXACTLY 27 words
    - 13s → EXACTLY 29 words
    - 14s → EXACTLY 32 words
    - 15s → EXACTLY 34 words
    - 20s → EXACTLY 45 words
    - 30s → EXACTLY 68 words

223. EXACT WORD COUNT MANDATE: You MUST hit the "EXACTLY X words" target for every scene. 
    - Being even 2 words off will cause the narration to be rejected.
    - This ensures "Perfect Pacing" (2.25 words/sec) across the entire video.
224. SELF-VERIFICATION: Count the words for every scene. If it doesn't match the target, rewrite it until it does.
225. Sound effects = specific Foley (e.g. "Heavy metallic clang reverberating in empty warehouse")
226. Music = genre, BPM, instruments, energy (e.g. "Dark trap beat, 75 BPM, 808 sub-bass, tension building")
227. Text Overlays: ALWAYS set "text_position", "text_animation", and "text_box_style" to "AI Auto-Select" unless you have a specific artistic reason to choose a fixed value.
228. VFX & CTA: These fields MUST be descriptive. DO NOT leave them empty. Describe specific visual effects and on-screen call-to-actions.
229. Visual Details: "image_subject", "image_setting", etc. MUST be populated with detailed strings, not just one word.
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

