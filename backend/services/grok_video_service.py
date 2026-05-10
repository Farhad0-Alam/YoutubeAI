import asyncio
import httpx
import aiofiles
import os
import logging
from backend.config.settings import settings

logger = logging.getLogger(__name__)

XAI_API_BASE = "https://api.x.ai/v1"

async def generate_grok_video(
    prompt: str,
    scene_idx: int,
    duration: int = 8,
    aspect_ratio: str = "16:9",
    narration: str = ""
) -> dict:
    """
    Submit a video generation request to xAI Grok (Aurora) with native audio narration.
    The narration text is embedded in the prompt so Aurora generates the voice in the video.
    Returns { "scene_number": idx, "file_path": local_path }
    """
    api_key = settings.XAI_API_KEY
    if not api_key:
        raise ValueError("XAI_API_KEY is not set in environment variables.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Embed narration directly into the prompt for Aurora's native audio
    full_prompt = prompt
    if narration:
        clean_narration = narration.strip()
        full_prompt = (
            f"{prompt} "
            f"VOICE NARRATION (speak exactly): \"{clean_narration}\" "
            f"Voice: confident, clear, natural human speech. "
            f"Audio: include spoken narration synchronized to visuals."
        )

    payload = {
        "model": "grok-2-aurora",
        "prompt": full_prompt,
        "duration": min(max(int(duration), 4), 30),
        "aspect_ratio": aspect_ratio
    }

    async with httpx.AsyncClient(timeout=600) as client:
        # Step 1: Submit generation request
        logger.info(f"Submitting Grok video for scene {scene_idx}: {prompt[:80]}...")
        resp = await client.post(
            f"{XAI_API_BASE}/videos/generations",
            json=payload,
            headers=headers
        )
        if resp.status_code not in (200, 201, 202):
            raise RuntimeError(f"Grok video submit failed ({resp.status_code}): {resp.text}")
        data = resp.json()

        request_id = data.get("id") or data.get("request_id")
        if not request_id:
            raise RuntimeError(f"No request_id returned from Grok: {data}")

        logger.info(f"Scene {scene_idx}: Grok request_id={request_id}. Polling...")

        # Step 2: Poll until completed
        video_url = None
        for attempt in range(120):  # Poll up to 4 minutes (every 2s)
            await asyncio.sleep(2)
            poll_resp = await client.get(
                f"{XAI_API_BASE}/videos/{request_id}",
                headers=headers
            )
            if poll_resp.status_code != 200:
                continue
            poll_data = poll_resp.json()

            status = poll_data.get("status", "")
            logger.debug(f"Scene {scene_idx} poll {attempt}: status={status}")

            if status == "completed":
                video_url = (
                    poll_data.get("url") or
                    poll_data.get("video_url") or
                    (poll_data.get("output") or {}).get("url") or
                    (poll_data.get("data") or [{}])[0].get("url")
                )
                break
            elif status == "failed":
                raise RuntimeError(f"Grok video generation failed for scene {scene_idx}: {poll_data}")

        if not video_url:
            raise RuntimeError(f"Scene {scene_idx}: Grok video timed out after 4 minutes.")

        # Step 3: Download the video
        output_path = os.path.join(settings.TEMP_DIR, f"scene_{scene_idx}_grok.mp4")
        logger.info(f"Scene {scene_idx}: Downloading Grok video from {video_url}")

        async with client.stream("GET", video_url) as dl_resp:
            dl_resp.raise_for_status()
            async with aiofiles.open(output_path, "wb") as f:
                async for chunk in dl_resp.aiter_bytes(8192):
                    await f.write(chunk)

        logger.info(f"Scene {scene_idx}: Saved to {output_path}")
        return {
            "scene_number": scene_idx,
            "file_path": output_path
        }


async def generate_grok_videos_for_scenes(scenes: list, aspect_ratio: str = "16:9") -> list:
    """
    Generate Grok video clips (with narration audio) for a list of scenes in parallel.
    Each scene: { scene_number, video_prompt, duration_seconds, narration (optional) }
    """
    tasks = [
        generate_grok_video(
            prompt=scene["video_prompt"],
            scene_idx=scene["scene_number"],
            duration=scene.get("duration_seconds", 8),
            aspect_ratio=aspect_ratio,
            narration=scene.get("narration", "")
        )
        for scene in scenes
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    output = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.error(f"Scene {scenes[i]['scene_number']} Grok failed: {result}")
            raise result
        output.append(result)

    return output
