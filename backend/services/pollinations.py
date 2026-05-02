import os
import httpx
import urllib.parse
import random
from backend.config.settings import settings

async def generate_image(prompt, idx=1) -> str:
    encoded_prompt = urllib.parse.quote(prompt)
    seed = random.randint(1, 999999)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1920&height=1080&nologo=true&seed={seed}"
    
    file_path = os.path.join(settings.TEMP_DIR, f"scene_{idx}_image.jpg")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=30.0)
        response.raise_for_status()
        
        with open(file_path, "wb") as f:
            f.write(response.content)
            
    return file_path
