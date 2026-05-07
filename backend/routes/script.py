from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.services.ai_service import generate_with_model
from backend.config.niches import NICHE_CONFIGS

router = APIRouter()

class GenerateRequest(BaseModel):
    niche_id: str
    topic: str
    duration_minutes: float
    script_style: str
    scene_length: Optional[int] = 15
    extra_instructions: str = ""
    voice_gender: Optional[str] = "Male"
    visual_style: Optional[str] = "cinematic"
    llm_model: Optional[str] = "groq"
    ai_model: Optional[str] = "veo3.1"
    aspect_ratio: Optional[str] = "16:9"

@router.post("/generate")
async def api_generate_script(request: GenerateRequest):
    # ── DEBUG: Print exactly what the frontend sent ──────────────────────────
    print(f"\n{'='*60}")
    print(f"DEBUG: BACKEND RECEIVED REQUEST:")
    print(f"   duration_minutes = {request.duration_minutes}")
    print(f"   scene_length     = {request.scene_length}")
    total_sec = round(request.duration_minutes * 60)
    expected_scenes = total_sec // (request.scene_length or 15)
    print(f"   total_seconds    = {total_sec}")
    print(f"   expected_scenes  = {expected_scenes}")
    print(f"   ai_model         = {request.ai_model}")
    print(f"   llm_model        = {request.llm_model}")
    print(f"{'='*60}\n")
    # ─────────────────────────────────────────────────────────────────────────

    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == request.niche_id), None)
    if not niche_config:
        raise HTTPException(status_code=400, detail=f"Invalid niche_id: {request.niche_id}")

    try:
        script_data = await generate_with_model(
            niche_config=niche_config,
            topic=request.topic,
            duration_minutes=request.duration_minutes,
            scene_length=request.scene_length,
            style=request.script_style,
            extra_instructions=request.extra_instructions,
            llm_model=request.llm_model or "groq",
            ai_model=request.ai_model or "veo3.1",
            aspect_ratio=request.aspect_ratio or "16:9",
            voice_gender=request.voice_gender or "Male",
            visual_style=request.visual_style or "cinematic"
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
    except Exception as e:
        print(f"Error generating script: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class RewriteSceneRequest(BaseModel):
    niche_id: str
    topic: str
    scene_data: dict
    instructions: str = "Improve this scene"
    llm_model: Optional[str] = "groq"
    ai_model: Optional[str] = "veo3.1"
    aspect_ratio: Optional[str] = "16:9"

@router.post("/rewrite_scene")
async def api_rewrite_scene(request: RewriteSceneRequest):
    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == request.niche_id), None)
    if not niche_config:
        raise HTTPException(status_code=400, detail=f"Invalid niche_id: {request.niche_id}")

    try:
        from backend.services.ai_service import rewrite_scene_content
        revised_scene = await rewrite_scene_content(
            niche_config=niche_config,
            topic=request.topic,
            scene_data=request.scene_data,
            instructions=request.instructions,
            llm_model=request.llm_model or "groq",
            ai_model=request.ai_model or "veo3.1",
            aspect_ratio=request.aspect_ratio or "16:9"
        )
        return revised_scene
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GenerateIdeasRequest(BaseModel):
    niche_id: str
    topic: str
    llm_model: Optional[str] = "groq"

@router.post("/generate_ideas")
async def api_generate_ideas(request: GenerateIdeasRequest):
    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == request.niche_id), None)
    if not niche_config:
        raise HTTPException(status_code=400, detail=f"Invalid niche_id: {request.niche_id}")

    try:
        from backend.services.ai_service import generate_ideas
        ideas = await generate_ideas(
            niche_config=niche_config,
            topic=request.topic,
            llm_model=request.llm_model or "groq"
        )
        return ideas
    except Exception as e:
        print(f"Error generating ideas: {e}")
        error_msg = str(e)
        if "401" in error_msg or "Invalid API Key" in error_msg:
            error_msg = "AI Provider Error: Invalid API Key. Check your .env file."
        elif "429" in error_msg or "rate limit" in error_msg.lower():
            error_msg = "AI Provider Error: Rate limit reached. Try another model."
        raise HTTPException(status_code=500, detail=error_msg)
