import asyncio
import json
import uuid
from fastapi import APIRouter, Depends
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database.postgres import get_session
from backend.database.models import RenderJob
from backend.services.renderer import render_video
from backend.utils.file_manager import cleanup_temp_files

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

# In-memory job cache for real-time SSE updates
render_jobs: dict = {}

@router.post("/render")
async def start_render(req: RenderRequest, db: AsyncSession = Depends(get_session)):
    job_id = str(uuid.uuid4())

    # Persist to PostgreSQL
    job = RenderJob(
        id=uuid.UUID(job_id),
        project_id=req.project_id,
        status="queued",
        progress=0,
        message="Render queued..."
    )
    db.add(job)
    await db.commit()

    # Also keep in memory for fast SSE streaming
    render_jobs[job_id] = {
        "status": "queued",
        "progress": 0,
        "message": "Render queued...",
        "video_path": None
    }

    async def render_task():
        async with AsyncSession(db.get_bind()) as task_session:
            try:
                render_jobs[job_id]["status"] = "running"

                async def progress_cb(step, prog, msg):
                    render_jobs[job_id]["progress"] = prog
                    render_jobs[job_id]["message"] = msg

                out_path, filesize = await render_video(
                    req.project_id,
                    [s.dict() for s in req.scenes],
                    req.audio_files,
                    progress_cb
                )

                video_url = f"/outputs/videos/{req.project_id}.mp4"
                render_jobs[job_id].update({
                    "status": "completed",
                    "progress": 100,
                    "message": "Done!",
                    "video_path": video_url,
                    "file_size_mb": filesize
                })

                # Update PostgreSQL
                result = await task_session.execute(
                    select(RenderJob).where(RenderJob.id == uuid.UUID(job_id))
                )
                db_job = result.scalar_one_or_none()
                if db_job:
                    db_job.status = "completed"
                    db_job.progress = 100
                    db_job.message = "Done!"
                    db_job.video_path = video_url
                    db_job.file_size_mb = filesize
                    await task_session.commit()

                await cleanup_temp_files()

            except Exception as e:
                render_jobs[job_id].update({
                    "status": "failed",
                    "message": str(e)
                })
                result = await task_session.execute(
                    select(RenderJob).where(RenderJob.id == uuid.UUID(job_id))
                )
                db_job = result.scalar_one_or_none()
                if db_job:
                    db_job.status = "failed"
                    db_job.error = str(e)
                    await task_session.commit()

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
