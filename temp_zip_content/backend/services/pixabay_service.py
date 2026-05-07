import os
import httpx
import urllib.parse
from backend.config.settings import settings

async def fetch_video(keyword: str, duration: int, idx: int) -> str:
    if not settings.PIXABAY_API_KEY or settings.PIXABAY_API_KEY == "your_pixabay_key_here":
        return None
        
    encoded_query = urllib.parse.quote(keyword)
    url = f"https://pixabay.com/api/videos/?key={settings.PIXABAY_API_KEY}&q={encoded_query}&video_type=film&per_page=5&order=popular"
    
    file_path = os.path.join(settings.TEMP_DIR, f"scene_{idx}_video_fallback.mp4")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=15.0)
        if response.status_code != 200:
            return None
            
        data = response.json()
        if not data.get("hits"):
            return None
            
        video = data["hits"][0]
        videos_data = video.get("videos", {})
        
        target_file = videos_data.get("medium", videos_data.get("large", videos_data.get("small")))
        if not target_file or not target_file.get("url"):
            return None
            
        download_url = target_file["url"]
        
        # Download
        vid_response = await client.get(download_url, timeout=60.0)
        vid_response.raise_for_status()
        
        with open(file_path, "wb") as f:
            f.write(vid_response.content)
            
    return file_path
