import httpx
from backend.config.settings import settings
from backend.services.ai.base import extract_json, logger

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
        return extract_json(response.json()["choices"][0]["message"]["content"])

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

PROVIDER_MAP = {
    "groq":     call_groq,
    "openai":   call_openai,
    "gemini":   call_gemini,
    "claude":   call_claude,
    "anthropic":call_claude,
    "grok":     call_grok,
    "xai":      call_grok,
}
