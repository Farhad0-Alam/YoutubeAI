import asyncio
import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import List, Dict

from backend.database.mongodb import get_database
from backend.services.renderer import render_video
from backend.utils.file_manager import cleanup_temp_files
from bson import ObjectId

router = APIRouter()

class RenderScene(BaseModel):
    scene_number: int
    media_path: str
    text_overlay: str
    transition: str

class RenderRequest(BaseModel):
    project_id: str
    scenes: List[RenderScene]
    audio_files: List[Dict]
    resolution: str
    caption_style: str
    add_music: bool
    music_mood: str

render_jobs = {}

@router.post("/render")
async def start_render(req: RenderRequest):
    job_id = str(ObjectId())
    render_jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "message": "Render queued...",
        "video_path": None
    }
    
    async def render_task():
        try:
            render_jobs[job_id]["status"] = "running"
            
            async def progress_cb(step, prog, msg):
                render_jobs[job_id]["progress"] = prog
                render_jobs[job_id]["message"] = msg
                
            out_path, filesize = await render_video(req.project_id, [s.dict() for s in req.scenes], req.audio_files, progress_cb)
            
            render_jobs[job_id].update({
                "status": "completed",
                "progress": 100,
                "message": "Done!",
                "video_path": f"/outputs/videos/{req.project_id}.mp4",
                "file_size_mb": filesize
            })
            
            # Clean up temp
            await cleanup_temp_files()
            
        except Exception as e:
            render_jobs[job_id].update({
                "status": "failed",
                "message": str(e)
            })

    asyncio.create_task(render_task())
    return {"job_id": job_id}

@router.get("/render/status/{job_id}")
async def get_render_status(job_id: str):
    async def event_generator():
        while True:
            job = render_jobs.get(job_id)
            if not job:
                yield dict(data=json.dumps({"status": "failed", "message": "Job not found"}))
                break
                
            yield dict(data=json.dumps(job))
            if job["status"] in ["completed", "failed"]:
                break
            await asyncio.sleep(1)
            
    return EventSourceResponse(event_generator())
