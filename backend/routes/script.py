from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.services.ai_service import generate_with_model
from backend.config.niches import NICHE_CONFIGS

router = APIRouter()

class GenerateRequest(BaseModel):
    niche_id: str
    topic: str
    duration_minutes: int
    script_style: str
    extra_instructions: str = ""
    voice_gender: str = "Male"
    llm_model: Optional[str] = "groq"   # groq | openai | gemini | claude | grok

@router.post("/generate")
async def api_generate_script(request: GenerateRequest):
    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == request.niche_id), None)
    if not niche_config:
        raise HTTPException(status_code=400, detail=f"Invalid niche_id: {request.niche_id}")

    try:
        script_data = await generate_with_model(
            niche_config=niche_config,
            topic=request.topic,
            duration_minutes=request.duration_minutes,
            style=request.script_style,
            extra_instructions=request.extra_instructions,
            llm_model=request.llm_model or "groq"
        )

        # ── Build full SEO description from parts ────────────────────────────
        hook      = script_data.get("description_hook", "")
        body      = script_data.get("description_body", "")
        disclaimer = script_data.get("description_disclaimer",
                     "⚠️ Disclaimer: For educational purposes only. Some assets and voices are AI-generated.")
        hashtags  = script_data.get("hashtags_string", "")

        timestamps = "0:00 - Introduction\n"
        current_time = 0
        for scene in script_data.get("scenes", []):
            duration = scene.get("duration_seconds", 15)
            current_time += duration
            mins = current_time // 60
            secs = current_time % 60
            label = scene.get("visual_description", "Scene")[:35]
            timestamps += f"{mins}:{secs:02d} - {label}...\n"

        full_desc = (
            f"{hook}\n\n"
            f"{body}\n\n"
            f"📌 Chapters:\n{timestamps}\n"
            f"{disclaimer}\n\n"
            f"{hashtags}"
        )
        script_data["description"] = full_desc
        script_data["niche_config"] = niche_config
        script_data["llm_model_used"] = request.llm_model

        return script_data

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
