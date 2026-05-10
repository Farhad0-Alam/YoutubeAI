import json
from backend.services.ai.base import logger
from backend.services.ai.prompts import build_system_prompt, build_user_prompt, get_model_prompt_rules, YOUTUBE_POLICY_BLOCK, VISUAL_STORYTELLING_BLOCK
from backend.services.ai.providers import PROVIDER_MAP, call_groq

async def generate_with_model(
    niche_config: dict,
    topic: str,
    duration_minutes: float,
    style: str,
    extra_instructions: str,
    scene_length: int = 15,
    llm_model: str = "groq",
    ai_model: str = "veo3.1",
    aspect_ratio: str = "16:9",
    voice_gender: str = "Male",
    visual_style: str = "cinematic",
    grok_mode: bool = False
) -> dict:
    """Route generation to the correct AI provider."""
    total_seconds = round(duration_minutes * 60)
    expected_scenes = total_seconds // scene_length if scene_length > 0 else 1
    remainder = total_seconds % scene_length if scene_length > 0 else 0
    if remainder > 0:
        if remainder < 5 and expected_scenes > 0:
            pass 
        else:
            expected_scenes += 1
    expected_scenes = max(1, expected_scenes)

    system_prompt = build_system_prompt(
        niche_config=niche_config,
        topic=topic,
        duration_minutes=duration_minutes,
        script_style=style,
        scene_length=scene_length,
        extra_instructions=extra_instructions,
        voice_gender=voice_gender,
        ai_model=ai_model,
        aspect_ratio=aspect_ratio,
        visual_style=visual_style,
        grok_mode=grok_mode
    )
    user_prompt = build_user_prompt(topic, duration_minutes, extra_instructions)

    providers_to_try = [llm_model.lower().strip()]
    for p in ["openai", "groq", "gemini"]:
        if p not in providers_to_try:
            providers_to_try.append(p)

    last_error = None
    result = None
    for provider in providers_to_try:
        handler = PROVIDER_MAP.get(provider)
        if not handler: continue
        
        try:
            logger.info(f"Generating script with provider: {provider}, visual model: {ai_model}, grok_mode: {grok_mode}")
            result = await handler(system_prompt, user_prompt)
            break 
        except Exception as e:
            last_error = e
            logger.warning(f"Provider {provider} failed for script generation: {str(e)}")
            continue

    if not result:
        raise last_error or ValueError("All AI providers failed to generate script.")

    # Validation
    scenes = result.get("scenes", [])
    actual_count = len(scenes)
    if actual_count < expected_scenes:
        num_full = total_seconds // scene_length
        rem = total_seconds % scene_length
        scene_durations = [scene_length] * num_full
        if rem > 0:
            if rem < 5 and num_full > 0:
                scene_durations[-1] += rem
            else:
                scene_durations.append(rem)
        if not scene_durations:
            scene_durations = [total_seconds or scene_length]

        last_scene = scenes[-1] if scenes else {}
        for i in range(actual_count, expected_scenes):
            padded_scene = {
                **last_scene,
                "scene_number": i + 1,
                "duration_seconds": scene_durations[i] if i < len(scene_durations) else scene_length,
                "narration": f"[confident] Continue the story for scene {i+1}.",
                "text_overlay": f"Scene {i+1}",
                "visual_description": last_scene.get("visual_description", "Cinematic continuation"),
            }
            scenes.append(padded_scene)
        result["scenes"] = scenes

    result["total_duration_seconds"] = sum(s.get("duration_seconds", scene_length) for s in result["scenes"])
    return result

async def rewrite_scene_content(
    niche_config: dict,
    topic: str,
    scene_data: dict,
    instructions: str,
    llm_model: str = "groq",
    ai_model: str = "veo3.1",
    aspect_ratio: str = "16:9",
    grok_mode: bool = False
) -> dict:
    """Rewrite a specific scene based on user instructions."""
    model_rules = get_model_prompt_rules(ai_model, aspect_ratio)
    
    if grok_mode:
        # In grok mode, we use a much slimmer JSON for rewriting to match the generation style
        system_prompt = f"""You are a cinematic script supervisor AND AI prompt engineer. Rewrite the following scene for a GROK-ONLY video pipeline.
Instructions: {instructions}
Respond with valid JSON:
{{
  "scene_number": {scene_data.get('scene_number', 1)},
  "duration_seconds": {scene_data.get('duration_seconds', 15)},
  "narration": "Revised narration",
  "voice_tone": "Tone",
  "text_overlay": "Caption",
  "visual_description": "New cinematic visual description",
  "video_prompt": "GROK-READY video prompt.",
  "transition": "transition style", 
  "camera_motion": "camera directions",
  "sound": "Foley SFX",
  "music": "Music",
  "call_to_action_cue": "Specific CTA"
}}"""
    else:
        system_prompt = f"""You are a cinematic script supervisor AND AI prompt engineer. Rewrite the following scene.
Niche: {niche_config.get('display_name')}
Topic: {topic}
Tone: {niche_config.get('script_tone')}
Instructions: {instructions}

{model_rules}

{YOUTUBE_POLICY_BLOCK}

{VISUAL_STORYTELLING_BLOCK}

Respond with valid JSON for the scene only. No markdown.
{{
  "scene_number": {scene_data.get('scene_number', 1)},
  "duration_seconds": {scene_data.get('duration_seconds', 15)},
  "narration": "Revised narration starting with emotion tag [dramatic]",
  "voice_tone": "Tone",
  "text_overlay": "Short caption",
  "visual_description": "New cinematic visual description",
  "search_keyword": "new search terms",
  "image_prompt": "PRODUCTION-READY image prompt following {ai_model} format",
  "image_subject": "Specific subject", "image_setting": "Environment",
  "image_mood": "Atmosphere", "image_lighting": "Lighting",
  "image_color_grade": "Color palette", "image_camera_angle": "Camera angle",
  "image_shot_type": "Shot type", "image_style_modifier": "Style",
  "video_prompt": "PRODUCTION-READY video prompt following {ai_model} format",
  "vfx": "Revised visual effects details (MUST NOT BE EMPTY)",
  "sound": "Specific Foley SFX",
  "music": "Genre, BPM, instruments, energy",
  "transition": "transition style", 
  "camera_motion": "camera directions",
  "color_grading": "color intent", 
  "emotional_arc": "emotion",
  "text_position": "AI Auto-Select",
  "text_animation": "AI Auto-Select",
  "text_box_style": "AI Auto-Select",
  "timing_and_pacing": "timing details", 
  "call_to_action_cue": "Specific CTA details (MUST NOT BE EMPTY)"
}}"""

    user_prompt = f"Current Scene Data: {json.dumps(scene_data)}"
    
    providers_to_try = [llm_model.lower().strip()]
    for p in ["openai", "groq", "gemini"]:
        if p not in providers_to_try:
            providers_to_try.append(p)

    last_error = None
    for provider in providers_to_try:
        handler = PROVIDER_MAP.get(provider)
        if not handler: continue
        
        try:
            logger.info(f"Rewriting scene with provider: {provider}, grok_mode={grok_mode}")
            return await handler(system_prompt, user_prompt)
        except Exception as e:
            last_error = e
            logger.warning(f"Provider {provider} failed for scene rewrite: {str(e)}")
            continue

    raise last_error or ValueError("All AI providers failed to rewrite scene.")
