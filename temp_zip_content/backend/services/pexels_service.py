import os
import httpx
from backend.config.settings import settings

async def fetch_video(keyword: str, duration: int, idx: int) -> str:
    if not settings.PEXELS_API_KEY or settings.PEXELS_API_KEY == "your_pexels_key_here":
        return None
        
    url = f"https://api.pexels.com/videos/search?query={keyword}&per_page=5&orientation=landscape&size=medium"
    headers = {
        "Authorization": settings.PEXELS_API_KEY
    }
    
    file_path = os.path.join(settings.TEMP_DIR, f"scene_{idx}_video.mp4")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, timeout=15.0)
        if response.status_code != 200:
            return None
            
        data = response.json()
        if not data.get("videos"):
            return None
            
        # Select best fit (usually first or one matching duration closest)
        video = data["videos"][0]
        video_files = video.get("video_files", [])
        
        # Pick HD/Medium
        target_file = next((f for f in video_files if f.get("quality") == "hd"), video_files[0] if video_files else None)
        if not target_file:
            return None
            
        download_url = target_file["link"]
        
        # Download
        vid_response = await client.get(download_url, timeout=60.0)
        vid_response.raise_for_status()
        
        with open(file_path, "wb") as f:
            f.write(vid_response.content)
            
    return file_path
