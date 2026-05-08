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
12. sound field MUST be formatted as an "SFX Engine Prompt" (e.g. "Action: [X], Style: [Y], Acoustic: [Z]")
13. music field MUST be formatted as a "Suno/Udio Prompt" (e.g. "Genre: [X], BPM: [Y], Mood: [Z], Instruments: [A]")
═══════════════════════════════════════════════════════════════"""
