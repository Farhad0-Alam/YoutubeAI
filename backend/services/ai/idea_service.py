from backend.services.ai.base import logger
from backend.services.ai.providers import PROVIDER_MAP

async def generate_ideas(
    niche_config: dict,
    topic: str,
    llm_model: str = "gemini"
) -> dict:
    """Generate viral YouTube hooks and titles with multi-provider fallback."""
    system_prompt = f"""You are an elite YouTube content strategist. Generate exactly 5 viral, highly-clickable YouTube Hook & Title pairs for the topic provided. 
The hooks MUST be emotionally gripping, controversial, or highly curiosity-driven, avoiding generic AI-sounding intros. It must sound like a real, passionate human creator.
Niche: {niche_config.get('display_name')}
Niche Tone: {niche_config.get('script_tone')}

Respond with valid JSON only. No markdown formatting.
Structure:
{{
  "ideas": [
    {{
      "title": "SEO optimized, purely viral YouTube title here",
      "hook": "The first 5 seconds script that instantly grabs attention and sparks deep emotion or curiosity"
    }}
  ]
}}"""
    user_prompt = f"Topic: {topic}"

    providers_to_try = [llm_model.lower().strip()]
    for p in ["gemini", "openai", "groq"]:
        if p not in providers_to_try:
            providers_to_try.append(p)

    last_error = None
    for provider in providers_to_try:
        handler = PROVIDER_MAP.get(provider)
        if not handler: continue
        
        try:
            logger.info(f"Generating ideas with provider: {provider}")
            return await handler(system_prompt, user_prompt)
        except Exception as e:
            last_error = e
            logger.warning(f"Provider {provider} failed: {str(e)}")
            continue

    raise last_error or ValueError("All AI providers failed to generate ideas.")
