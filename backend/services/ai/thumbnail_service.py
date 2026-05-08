from backend.services.ai.base import logger
from backend.services.ai.providers import PROVIDER_MAP, call_gemini, call_groq

async def generate_thumbnail_prompts(
    niche_config: dict,
    title: str,
    script_summary: str = "",
    llm_model: str = "gemini"
) -> dict:
    """Generate high-CTR art direction prompts for YouTube thumbnails."""
    system_prompt = f"""You are an elite YouTube Thumbnail Director. Your job is to create 3 distinct, high-CTR "Art Direction Prompts" for an AI image generator (like Midjourney or Grok 2).
    
    The prompts should be optimized for:
    1. High contrast and vibrant colors.
    2. Clear focal point (Subject).
    3. Rule of thirds composition.
    4. "Empty space" for text overlays.
    5. Emotional impact (curiosity, shock, awe, fear, joy).
    
    Niche: {niche_config.get('display_name')}
    Video Title: {title}
    
    PROMPT STRUCTURE: "[Subject], [Environment], [Lighting], [Color Palette], [Camera Angle], [Mood], cinematic, 8k, photorealistic".
    
    Respond with valid JSON only. No markdown.
    Structure:
    {{
      "prompts": [
        {{
          "label": "Dramatic & Moody",
          "prompt": "Detailed art direction prompt here..."
        }},
        {{
          "label": "Vibrant & Catchy",
          "prompt": "Detailed art direction prompt here..."
        }},
        {{
          "label": "Shocking & Intense",
          "prompt": "Detailed art direction prompt here..."
        }}
      ]
    }}"""
    
    user_prompt = f"Video Title: {title}\nScript Summary: {script_summary}"
    
    provider_key = llm_model.lower().strip()
    handler = PROVIDER_MAP.get(provider_key, call_gemini)
    
    try:
        return await handler(system_prompt, user_prompt)
    except Exception as e:
        logger.warning(f"Thumbnail prompt generation failed with {provider_key}: {str(e)}")
        if provider_key != "groq":
            return await call_groq(system_prompt, user_prompt)
        raise e
