from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.services import pexels_service, pixabay_service, pollinations

router = APIRouter()

class SceneMedia(BaseModel):
    scene_number: int
    duration_seconds: int
    search_keyword: str
    image_prompt: str

class MediaRequest(BaseModel):
    niche_id: str
    scenes: List[SceneMedia]

@router.post("/media")
async def fetch_media_for_scenes(req: MediaRequest):
    results = []
    
    for scene in req.scenes:
        # Try Pexels
        media_path = await pexels_service.fetch_video(scene.search_keyword, scene.duration_seconds, scene.scene_number)
        media_type = "video"
        
        # Fallback Pixabay
        if not media_path:
            media_path = await pixabay_service.fetch_video(scene.search_keyword, scene.duration_seconds, scene.scene_number)
            
        # Fallback AI Image
        if not media_path:
            media_path = await pollinations.generate_image(scene.image_prompt, scene.scene_number)
            media_type = "image"
            
        results.append({
            "scene_number": scene.scene_number,
            "media_path": media_path,
            "media_type": media_type
        })
        
    return {"scenes": results}
