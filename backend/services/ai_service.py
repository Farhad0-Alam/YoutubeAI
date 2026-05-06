"""
Unified AI Service — Routes script generation to any configured AI provider.
Supported: Groq (Llama 3.3), OpenAI (GPT-4o), Google Gemini, Anthropic Claude, xAI Grok
"""
import json
import re
import logging
import httpx
from backend.config.settings import settings

logger = logging.getLogger(__name__)

# ── Shared JSON extractor ─────────────────────────────────────────────────────
def extract_json(text: str) -> dict:
    """Bulletproof JSON extraction — handles markdown fences and extra text."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    raise ValueError(f"No JSON found in AI response: {text[:300]}")


# ── Model-Specific Prompt Templates ───────────────────────────────────────────
def get_model_prompt_rules(ai_model: str, aspect_ratio: str = "16:9") -> str:
    """Return model-specific prompt formatting rules for image and video prompts."""
    templates = {
        "seedance2.0": f"""AI VIDEO MODEL: Seedance 2.0
IMAGE PROMPT FORMAT: "[Subject in specific action/pose], [detailed environment], [lighting], [camera angle], [color palette], [style]. --ar {aspect_ratio} --seed [consistent_seed] --q 2 --style raw"
VIDEO PROMPT FORMAT: "Camera: [exact movement e.g. slow dolly forward]. Subject: [exact action with timing]. Environment: [atmospheric details]. Style: cinematic realism, 4K, 60fps, teal-orange grade --ar {aspect_ratio} --v 2.0"
OPTIMIZATION: Use precise camera directions (dolly, pan, tilt, zoom). Specify subject motion frame-by-frame. Include atmospheric particles (dust, light rays, bokeh).""",

        "veo3.1": f"""AI VIDEO MODEL: Google Veo 3.1
IMAGE PROMPT FORMAT: Natural language paragraph describing the exact scene — subject, environment, lighting, mood, camera perspective. Be descriptive like a film director's shot notes.
VIDEO PROMPT FORMAT: Full descriptive paragraph: "A [subject] in [setting], performing [action]. The camera [movement]. Lighting is [type]. The atmosphere feels [mood]. Shot in [style], aspect ratio {aspect_ratio}."
OPTIMIZATION: Veo excels with natural language. Write prompts as if describing a scene to a cinematographer. Emphasize motion, lighting changes, and emotional transitions.""",

        "grok2": f"""AI VIDEO MODEL: xAI Grok 2
IMAGE PROMPT FORMAT: "Hyper-detailed [subject] in [environment]. [Lighting description]. [Texture and material details]. [Atmosphere and mood]. [Camera angle and lens]. Photorealistic, 8K resolution."
VIDEO PROMPT FORMAT: "Vivid cinematic scene: [subject performing action] in [richly described environment]. [Camera movement with emotional intent]. [Lighting evolution]. [Color palette]. Aspect ratio {aspect_ratio}."
OPTIMIZATION: Grok excels with rich descriptive language. Emphasize textures, materials, atmospheric details. Use vivid sensory language.""",

        "sora": f"""AI VIDEO MODEL: OpenAI Sora
IMAGE PROMPT FORMAT: "A [detailed subject] in [specific setting], [action/pose], [lighting conditions], [camera angle], photorealistic, 4K, cinematic composition."
VIDEO PROMPT FORMAT: "A [subject] in [setting], [performing action]. Camera [movement]. [Lighting]. Photorealistic, highly detailed, smooth motion, 4K resolution, {aspect_ratio} aspect ratio."
OPTIMIZATION: Sora responds to clear, structured descriptions. Specify subject, setting, action, camera, lighting in that order. Avoid abstract concepts.""",

        "runway_gen3": f"""AI VIDEO MODEL: Runway Gen-3 Alpha
IMAGE PROMPT FORMAT: "[Subject], [environment], [lighting], [style], hyperrealistic, dynamic composition, cinematic --ar {aspect_ratio}"
VIDEO PROMPT FORMAT: "Hyperrealistic [subject] [action verb] in [environment]. [Camera: specific movement]. [Dynamic motion description]. Gen-3 Alpha, {aspect_ratio}."
OPTIMIZATION: Gen-3 excels with short, dense prompts. Use strong action verbs. Specify motion explicitly. Keep prompts under 150 words.""",

        "kling_v1.5": f"""AI VIDEO MODEL: Kling v1.5
IMAGE PROMPT FORMAT: "masterpiece, best quality, [detailed subject], [environment], [lighting], [camera angle], [style], cinematography --ar {aspect_ratio}"
VIDEO PROMPT FORMAT: "Masterpiece, best quality, cinematic [subject performing action] in [environment], [camera movement], [lighting], smooth motion, {aspect_ratio}."
OPTIMIZATION: Kling uses quality tags. Always start with 'masterpiece, best quality'. Include camera and lighting details. Specify motion clearly.""",

        "midjourney_v6": f"""AI VIDEO MODEL: Midjourney v6
IMAGE PROMPT FORMAT: "/imagine prompt: [detailed scene description], cinematic photography, 8k resolution --ar {aspect_ratio} --v 6.0 --style raw --q 2"
VIDEO PROMPT FORMAT: "/imagine prompt: [scene with motion implied], highly detailed cinematic photography, 8k resolution --ar {aspect_ratio} --v 6.0 --style raw"
OPTIMIZATION: Use Midjourney parameter syntax. Include --ar, --v, --style, --q. Describe scenes with photographic terminology (lens, aperture, focal length)."""
    }
    return templates.get(ai_model, templates["seedance2.0"])


# ── YouTube Policy Compliance Block ───────────────────────────────────────────
YOUTUBE_POLICY_BLOCK = """
═══════════════════════════════════════════════════════════════
YOUTUBE POLICY & COMMUNITY GUIDELINES COMPLIANCE (MANDATORY):
═══════════════════════════════════════════════════════════════
ALL image_prompt and video_prompt fields MUST comply with YouTube monetization policies.

NEVER generate visuals containing:
  ✗ Realistic violence, gore, blood, weapons pointed at people
  ✗ Sexual or suggestive content, nudity, revealing clothing
  ✗ Drug use, smoking, alcohol abuse depictions
  ✗ Hate symbols, extremist imagery, discriminatory content
  ✗ Real public figures (politicians, celebrities) without consent context
  ✗ Copyrighted characters, logos, brand names, trademarked IP
  ✗ Misleading medical/financial claims presented as facts in visuals
  ✗ Content targeting minors inappropriately
  ✗ Realistic disasters designed to cause panic (fake news style)
  ✗ Self-harm, eating disorders, dangerous challenges
  ✗ Fake thumbnails or misleading visual claims

ALWAYS ensure visuals are:
  ✓ Professional, clean, broadcast-quality compositions
  ✓ Diverse representation (age, ethnicity, gender) in human subjects
  ✓ Safe, professional environments (offices, studios, nature, cities)
  ✓ Constructive emotions (curiosity, determination, focus — not terror or despair)
  ✓ Factual data visualizations for finance/health (charts, graphs, infographics)
  ✓ Clearly cinematic style (not deepfake-realistic for human faces)
  ✓ Original compositions — no references to existing copyrighted works
═══════════════════════════════════════════════════════════════"""


# ── Visual Storytelling Rules ─────────────────────────────────────────────────
VISUAL_STORYTELLING_BLOCK = """
═══════════════════════════════════════════════════════════════
VISUAL STORYTELLING RULES (MANDATORY):
═══════════════════════════════════════════════════════════════
1. EVERY image_prompt MUST directly illustrate the narration content — visuals and words tell ONE story
2. Progressive visual flow across scenes: Establish → Develop → Climax → Resolve
3. Camera angles MUST vary: Scene 1=wide establishing → Body=medium/close-up → Final=intimate close-up
4. Lighting MUST evolve with emotional arc: warm→cool→dramatic→soft
5. Color grading MUST stay consistent but shift subtly with emotion
6. Character consistency: if a person appears in scene 1, describe them IDENTICALLY in later scenes (age, clothing, hair, skin tone)
7. NEVER use generic descriptions like "a person" — be SPECIFIC: "A 35-year-old South Asian man in a navy blazer, short black hair, focused expression"
8. Environment storytelling: backgrounds MUST contain narrative-relevant details (not empty rooms)
9. Each scene's visual MUST feel like the NEXT frame in a movie — not a random stock photo
10. image_prompt MUST be 40-80 words of rich cinematic detail
11. video_prompt MUST specify exact camera motion + subject action + timing
═══════════════════════════════════════════════════════════════"""


# ── Build the shared prompt ───────────────────────────────────────────────────
def build_system_prompt(niche_config: dict, style: str, duration_minutes: float, scene_length: int = 15, ai_model: str = "veo3.1", aspect_ratio: str = "16:9") -> str:
    total_seconds = round(duration_minutes * 60)
    
    # Calculate exact durations for each scene to reach target
    num_full_scenes = total_seconds // scene_length
    remainder = total_seconds % scene_length
    
    scene_durations = [scene_length] * num_full_scenes
    if remainder > 0:
        # If remainder is very small (e.g. 1-2s), attach it to the last scene
        if remainder < 5 and num_full_scenes > 0:
            scene_durations[-1] += remainder
        else:
            scene_durations.append(remainder)
    
    if not scene_durations:
        scene_durations = [total_seconds or 15]
        
    num_scenes = len(scene_durations)
    durations_str = ", ".join([f"Scene {i+1}: {d}s" for i, d in enumerate(scene_durations)])
    
    # Show exactly ONE block in the JSON example so the LLM understands the schema,
    # but strictly enforce the total count in the prompt instructions.
    # Dynamically build the scenes JSON example to force the LLM to output the exact number of scenes
    scenes_example_items = []
    for i, d in enumerate(scene_durations):
        item = f"""    {{
      "scene_number": {i+1},
      "duration_seconds": {d},
      "narration": "[emotion] Narration for scene {i+1}",
      "voice_tone": "Tone",
      "text_overlay": "Caption",
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
      "sound": "Foley SFX",
      "music": "Music description",
      "timing_and_pacing": "Timing",
      "emotional_arc": "Emotion"
    }}"""
        scenes_example_items.append(item)
    scenes_example_json = ",\n".join(scenes_example_items)
    
    model_rules = get_model_prompt_rules(ai_model, aspect_ratio)
    
    return f"""You are a top-tier YouTube SEO expert, Cinematic Visual Director, Voice Production Director, AND AI Prompt Engineer for high-CPM USA-based faceless channels.

Your goal: Generate a COMPLETE production-ready script where EVERY field (narration, image_prompt, video_prompt) is perfectly crafted and ready for immediate use in AI video production.

{model_rules}

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
        - Legal/Law: Legal Disclaimer (Not legal advice).
        - All others: General Information Disclaimer.
        - **MANDATORY**: "Some assets and voices in this video are AI-generated."

{YOUTUBE_POLICY_BLOCK}

{VISUAL_STORYTELLING_BLOCK}

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
Formula: usable_seconds = clip_duration × (1 - breath_overhead)
         max_words = usable_seconds × (WPM ÷ 60)
         safe_range = 75%–100% of max_words

Scene-Type Presets:
  • Scene 1 (Hook): WPM=165, breath=25% → [excited] or [urgent]
  • Middle scenes (Body): WPM=150, breath=30% → [confident], [dramatic], or [curious]
  • Final scene (CTA): WPM=130, breath=35% → [calm] or [warm]

Word Count Guidelines (based on duration D):
  Hook:  D * 0.75 * 165 / 60 * 0.75 to D * 0.75 * 165 / 60 words
  Body:  D * 0.70 * 150 / 60 * 0.75 to D * 0.70 * 150 / 60 words
  CTA:   D * 0.65 * 130 / 60 * 0.75 to D * 0.65 * 130 / 60 words

VOICE RULES:
1. EVERY narration MUST start with emotion tag: [excited], [dramatic], [calm], [urgent], [whisper], [confident], [curious], [happy], [warm]
2. Word count MUST fall within safe_range for the scene's duration
3. Scene 1 = [excited] or [urgent] | Final scene = [calm] or [warm]
4. NEVER repeat same emotion on consecutive scenes
5. Sound effects = specific Foley (e.g. "Heavy metallic clang reverberating in empty warehouse")
6. Music = genre, BPM, instruments, energy (e.g. "Dark trap beat, 75 BPM, 808 sub-bass, tension building")
═══════════════════════════════════════════════════════════════

Script style: {style}
Niche tone: {niche_config.get("script_tone")}
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


# ── Provider: Groq (Llama 3.3) ───────────────────────────────────────────────
async def call_groq(system_prompt: str, user_prompt: str) -> dict:
    from groq import AsyncGroq
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in .env")
    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    response = await client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=16000
    )
    return extract_json(response.choices[0].message.content)


# ── Provider: OpenAI (GPT-4o) ────────────────────────────────────────────────
async def call_openai(system_prompt: str, user_prompt: str) -> dict:
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not set in .env")
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json={
                "model": "gpt-4o",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7,
                "response_format": {"type": "json_object"}
            }
        )
        response.raise_for_status()
        return json.loads(response.json()["choices"][0]["message"]["content"])


# ── Provider: Google Gemini ───────────────────────────────────────────────────
async def call_gemini(system_prompt: str, user_prompt: str) -> dict:
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in .env")
    full_prompt = system_prompt + "\n\n" + user_prompt
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": full_prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 16384,
                    "responseMimeType": "application/json"
                }
            }
        )
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        return extract_json(text)


# ── Provider: Anthropic Claude ───────────────────────────────────────────────
async def call_claude(system_prompt: str, user_prompt: str) -> dict:
    if not settings.ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY is not set in .env")
    async with httpx.AsyncClient(timeout=90) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": settings.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 6000,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}]
            }
        )
        response.raise_for_status()
        text = response.json()["content"][0]["text"]
        return extract_json(text)


# ── Provider: xAI Grok ───────────────────────────────────────────────────────
async def call_grok(system_prompt: str, user_prompt: str) -> dict:
    if not settings.XAI_API_KEY:
        raise ValueError("XAI_API_KEY is not set in .env")
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.x.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.XAI_API_KEY}"},
            json={
                "model": "grok-3",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7,
                "stream": False
            }
        )
        response.raise_for_status()
        return extract_json(response.json()["choices"][0]["message"]["content"])


# ── Main router ───────────────────────────────────────────────────────────────
PROVIDER_MAP = {
    "groq":     call_groq,
    "openai":   call_openai,
    "gemini":   call_gemini,
    "claude":   call_claude,
    "anthropic":call_claude,  # alias
    "grok":     call_grok,
    "xai":      call_grok,    # alias
}

async def generate_with_model(
    niche_config: dict,
    topic: str,
    duration_minutes: float,
    style: str,
    extra_instructions: str,
    scene_length: int = 15,
    llm_model: str = "groq",
    ai_model: str = "veo3.1",
    aspect_ratio: str = "16:9"
) -> dict:
    """Route generation to the correct AI provider."""
    total_seconds = round(duration_minutes * 60)
    expected_scenes = total_seconds // scene_length if scene_length > 0 else 1
    remainder = total_seconds % scene_length if scene_length > 0 else 0
    if remainder > 0:
        if remainder < 5 and expected_scenes > 0:
            pass  # remainder absorbed by last scene
        else:
            expected_scenes += 1
    expected_scenes = max(1, expected_scenes)

    print(f"\n{'='*60}")
    print(f"🎬 generate_with_model CALLED:")
    print(f"   duration_minutes = {duration_minutes}")
    print(f"   scene_length     = {scene_length}")
    print(f"   total_seconds    = {total_seconds}")
    print(f"   expected_scenes  = {expected_scenes}")
    print(f"   llm_model        = {llm_model}")
    print(f"   ai_model         = {ai_model}")
    print(f"{'='*60}\n")

    system_prompt = build_system_prompt(niche_config, style, duration_minutes, scene_length, ai_model, aspect_ratio)
    user_prompt = build_user_prompt(topic, duration_minutes, extra_instructions)

    provider_key = llm_model.lower().strip()
    handler = PROVIDER_MAP.get(provider_key)

    if not handler:
        logger.warning(f"Unknown model '{llm_model}', falling back to Groq.")
        handler = call_groq

    logger.info(f"Generating script with provider: {provider_key}, visual model: {ai_model}")
    result = await handler(system_prompt, user_prompt)

    # ── POST-GENERATION VALIDATION: Ensure correct scene count ────────────
    scenes = result.get("scenes", [])
    actual_count = len(scenes)
    print(f"\n{'='*60}")
    print(f"📊 AI OUTPUT VALIDATION:")
    print(f"   Expected scenes: {expected_scenes}")
    print(f"   Actual scenes:   {actual_count}")
    print(f"{'='*60}\n")

    if actual_count < expected_scenes:
        logger.warning(f"AI returned {actual_count} scenes, expected {expected_scenes}. Padding missing scenes.")
        print(f"⚠️  PADDING {expected_scenes - actual_count} missing scenes!")
        # Build the expected durations list (same logic as build_system_prompt)
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

        # Pad the missing scenes by cloning the last existing scene with adjusted metadata
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

    # Fix total_duration_seconds to match the sum of all scenes
    result["total_duration_seconds"] = sum(s.get("duration_seconds", scene_length) for s in result["scenes"])
    print(f"✅ Final output: {len(result['scenes'])} scenes, {result['total_duration_seconds']}s total")

    return result


async def rewrite_scene_content(
    niche_config: dict,
    topic: str,
    scene_data: dict,
    instructions: str,
    llm_model: str = "groq",
    ai_model: str = "veo3.1",
    aspect_ratio: str = "16:9"
) -> dict:
    """Rewrite a specific scene based on user instructions."""
    model_rules = get_model_prompt_rules(ai_model, aspect_ratio)
    
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
  "vfx": "VFX details", "sound": "Specific Foley SFX",
  "music": "Genre, BPM, instruments, energy",
  "transition": "transition style", "camera_motion": "camera directions",
  "color_grading": "color intent", "emotional_arc": "emotion",
  "timing_and_pacing": "timing details", "call_to_action_cue": "CTA details"
}}"""

    user_prompt = f"Current Scene Data: {json.dumps(scene_data)}"
    
    provider_key = llm_model.lower().strip()
    handler = PROVIDER_MAP.get(provider_key) or call_groq
    
    return await handler(system_prompt, user_prompt)
