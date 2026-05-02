from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from backend.services.groq_service import generate_script
from backend.config.niches import NICHE_CONFIGS

router = APIRouter()

class GenerateRequest(BaseModel):
    niche_id: str
    topic: str
    duration_minutes: int
    script_style: str
    extra_instructions: str = ""
    voice_gender: str = "Male"

@router.post("/generate")
async def api_generate_script(request: GenerateRequest):
    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == request.niche_id), None)
    if not niche_config:
        raise HTTPException(status_code=400, detail="Invalid niche_id")
        
    try:
        script_data = await generate_script(
            niche_config=niche_config,
            topic=request.topic,
            duration_minutes=request.duration_minutes,
            style=request.script_style,
            extra_instructions=request.extra_instructions
        )
        script_data["niche_config"] = niche_config
        return script_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
