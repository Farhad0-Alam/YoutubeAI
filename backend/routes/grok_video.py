import asyncio
import json
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from sse_starlette.sse import EventSourceResponse

from backend.services.grok_video_service import generate_grok_video, generate_grok_videos_for_scenes

router = APIRouter()

# In-memory job tracker for SSE progress
grok_jobs: dict = {}


class GrokScene(BaseModel):
    scene_number: int
    video_prompt: str
    duration_seconds: int = 8
    narration: str = ""   # Embedded into prompt for native Aurora audio


class GrokVideoRequest(BaseModel):
    scenes: List[GrokScene]
    aspect_ratio: str = "16:9"
    use_sub_clips: bool = False   # True = 2-3s sub-clips; False = one full clip per scene


class GrokSubClipRequest(BaseModel):
    scene_number: int
    video_prompt: str
    duration_seconds: int
    aspect_ratio: str = "16:9"
    sub_clip_duration: int = 3    # seconds per sub-clip


@router.post("/grok-video")
async def generate_grok_videos(req: GrokVideoRequest):
    """
    Generate Grok video clips for all scenes.
    Returns immediately with job_id; use /grok-video/status/{job_id} for SSE progress.
    """
    job_id = str(uuid.uuid4())
    grok_jobs[job_id] = {
        "status": "running",
        "progress": 0,
        "total": len(req.scenes),
        "completed": 0,
        "video_files": [],
        "message": "Starting Grok video generation..."
    }

    async def generation_task():
        try:
            video_files = []
            total = len(req.scenes)

            for i, scene in enumerate(req.scenes):
                grok_jobs[job_id]["message"] = f"Generating Scene {scene.scene_number} via Grok Aurora..."

                if req.use_sub_clips:
                    # Split scene into 2-3s sub-clips
                    sub_dur = 3
                    num_subs = max(1, round(scene.duration_seconds / sub_dur))
                    sub_files = []
                    for s in range(num_subs):
                        sub_prompt = f"{scene.video_prompt} — clip {s+1} of {num_subs}, continuous shot."
                        sub_narration = scene.narration if s == 0 else ""
                        result = await generate_grok_video(
                            prompt=sub_prompt,
                            scene_idx=float(f"{scene.scene_number}.{s+1}"),
                            duration=sub_dur,
                            aspect_ratio=req.aspect_ratio,
                            narration=sub_narration
                        )
                        sub_files.append(result["file_path"])
                    video_files.append({
                        "scene_number": scene.scene_number,
                        "file_path": sub_files[0],          # primary
                        "sub_clips": sub_files,
                        "mode": "sub_clips"
                    })
                else:
                    # One full clip per scene
                    result = await generate_grok_video(
                        prompt=scene.video_prompt,
                        scene_idx=scene.scene_number,
                        duration=scene.duration_seconds,
                        aspect_ratio=req.aspect_ratio,
                        narration=scene.narration
                    )
                    video_files.append({
                        "scene_number": scene.scene_number,
                        "file_path": result["file_path"],
                        "mode": "single"
                    })

                grok_jobs[job_id]["completed"] = i + 1
                grok_jobs[job_id]["progress"] = int(((i + 1) / total) * 100)

            grok_jobs[job_id].update({
                "status": "completed",
                "progress": 100,
                "video_files": video_files,
                "message": f"All {total} Grok video clips ready!"
            })

        except Exception as e:
            grok_jobs[job_id].update({
                "status": "failed",
                "message": str(e)
            })

    asyncio.create_task(generation_task())
    return {"job_id": job_id}


@router.get("/grok-video/status/{job_id}")
async def grok_video_status(job_id: str):
    """SSE endpoint — streams real-time progress for a Grok video generation job."""
    async def event_generator():
        while True:
            job = grok_jobs.get(job_id)
            if not job:
                yield dict(data=json.dumps({"status": "failed", "message": "Job not found"}))
                break
            yield dict(data=json.dumps(job))
            if job["status"] in ("completed", "failed"):
                break
            await asyncio.sleep(2)

    return EventSourceResponse(event_generator())


@router.get("/grok-video/files/{job_id}")
async def get_grok_video_files(job_id: str):
    """Return the final list of generated video files for a completed job."""
    job = grok_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Job not complete: {job['status']}")
    return {"video_files": job["video_files"]}
