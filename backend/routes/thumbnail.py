from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.thumbnail_service import generate_thumbnail
from backend.services.pollinations import generate_image
from backend.config.niches import NICHE_CONFIGS

router = APIRouter()

class ThumbnailRequest(BaseModel):
    title: str
    subtitle: str
    niche_id: str
    background_prompt: str
    project_id: str

@router.post("/thumbnail")
async def create_thumbnail(req: ThumbnailRequest):
    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == req.niche_id), {})
    
    # 1. Generate Base Image via AI
    bg_image_path = await generate_image(req.background_prompt, "thumb_base")
    
    # 2. Render Overlay with Text
    final_path = await generate_thumbnail(
        req.title, req.subtitle, niche_config, bg_image_path, req.project_id
    )
    
    return {"thumbnail_path": final_path, "thumbnail_url": f"/outputs/thumbnails/{req.project_id}.png"}
 
from backend.services.ai_service import generate_thumbnail_prompts

class ThumbnailPromptRequest(BaseModel):
    title: str
    niche_id: str
    script_summary: str = ""
    llm_model: str = "gemini"

@router.post("/thumbnail/prompts")
async def create_thumbnail_prompts(req: ThumbnailPromptRequest):
    niche_config = next((n for n in NICHE_CONFIGS if n["niche_id"] == req.niche_id), {})
    result = await generate_thumbnail_prompts(
        niche_config=niche_config,
        title=req.title,
        script_summary=req.script_summary,
        llm_model=req.llm_model
    )
    return result
