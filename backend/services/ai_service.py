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


# ── Build the shared prompt ───────────────────────────────────────────────────
def build_system_prompt(niche_config: dict, style: str, duration_minutes: int) -> str:
    return f"""You are a top-tier YouTube SEO expert and Content Strategist for high-CPM USA-based channels.
Your goal is to generate content that dominates search rankings and maximizes CTR (Click-Through Rate).

Guidelines for USA Audience (Ages 25-54):
1. **Title**: Create a high-CTR, curiosity-driven title (MAXIMUM 100 characters, ideally under 60). Use Power Words (e.g., Revealed, Warning, Secret, Proven).
2. **Hook**: The script must grab attention in the first 5 seconds with a high-stakes claim or question.
3. **Structure**: Follow the PAS (Problem-Agitate-Solution) framework.
4. **SEO Description** (MAXIMUM 800 characters total):
    - First 2 lines: Primary keywords + high-tension hook.
    - Timestamps: Chapter breakdown.
    - Hashtags: 3-5 trending USA-niche hashtags.
    - **Dynamic Disclaimer** for niche '{niche_config.get("display_name")}':
        - Finance/Crypto/Investing: Financial Disclaimer (Not financial advice).
        - Health/Wellness/Fitness/Mental Health: Medical Disclaimer (Not medical advice).
        - Legal/Law: Legal Disclaimer (Not legal advice).
        - All others: General Information Disclaimer.
        - **MANDATORY**: "Some assets and voices in this video are AI-generated."

Script style: {style}
Niche tone: {niche_config.get("script_tone")}
Target duration: {duration_minutes} minutes

IMPORTANT: Respond with valid JSON only. No markdown. No explanation. Pure JSON.
Structure:
{{
  "title": "High-CTR SEO Title",
  "description_hook": "2 lines: Primary keywords + high-tension hook.",
  "description_body": "Detailed summary of value provided in the video.",
  "description_disclaimer": "Niche-specific Dynamic Disclaimer + AI Disclosure.",
  "hashtags_string": "#tag1 #tag2 #tag3",
  "tags": ["high-volume-tag1", "trending-tag2"],
  "pinned_comment": "Controversial or highly engaging pinned comment to drive early interaction",
  "hook": "First 30 seconds hook script",
  "cta": "Final CTA script",
  "scenes": [
    {{
      "scene_number": 1,
      "duration_seconds": 15,
      "narration": "Full voiceover text for this scene",
      "voice_tone": "Urgent/Calm/Curious",
      "text_overlay": "Short caption max 8 words",
      "visual_description": "Cinematic visual description",
      "search_keyword": "precise search terms for Pexels, comma-separated",
      "image_prompt": "Ultra-detailed cinematic AI image prompt",
      "image_subject": "Main focus of the shot",
      "image_setting": "Background or environment",
      "image_mood": "Atmosphere keyword",
      "image_lighting": "Lighting setup",
      "image_color_grade": "Color grading or palette",
      "image_camera_angle": "Camera position",
      "image_shot_type": "Shot framing",
      "image_style_modifier": "Style keywords",
      "video_prompt": "Detailed AI video prompt with exact camera movement and subject motion.",
      "transition": "transition style",
      "camera_motion": "Explicit camera directions",
      "color_grading": "Color grading intent",
      "sound": "Specific Foley/SFX",
      "music": "Music track style and pacing",
      "timing_and_pacing": "Sub-scene timing breakdown"
    }}
  ],
  "total_duration_seconds": {duration_minutes * 60}
}}"""


def build_user_prompt(topic: str, duration_minutes: int, extra_instructions: str) -> str:
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
        max_tokens=6000
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
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": full_prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
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
    duration_minutes: int,
    style: str,
    extra_instructions: str,
    llm_model: str = "groq"
) -> dict:
    """Route generation to the correct AI provider."""
    system_prompt = build_system_prompt(niche_config, style, duration_minutes)
    user_prompt = build_user_prompt(topic, duration_minutes, extra_instructions)

    provider_key = llm_model.lower().strip()
    handler = PROVIDER_MAP.get(provider_key)

    if not handler:
        logger.warning(f"Unknown model '{llm_model}', falling back to Groq.")
        handler = call_groq

    logger.info(f"Generating script with provider: {provider_key}")
    return await handler(system_prompt, user_prompt)
