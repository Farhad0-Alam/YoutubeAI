import os
from fastapi import APIRouter
from fastapi.responses import FileResponse
from backend.config.settings import settings

router = APIRouter()

@router.get("/videos/{filename}")
async def get_video(filename: str):
    path = os.path.join(settings.VIDEOS_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path)
    return {"error": "Not found"}

@router.get("/thumbnails/{filename}")
async def get_thumbnail(filename: str):
    path = os.path.join(settings.THUMBNAILS_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path)
    return {"error": "Not found"}
