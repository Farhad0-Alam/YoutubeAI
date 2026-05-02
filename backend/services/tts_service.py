import os
import edge_tts
from backend.config.settings import settings
from moviepy.editor import AudioFileClip

async def generate_speech(text, voice, idx):
    output_path = os.path.join(settings.TEMP_DIR, f"scene_{idx}_audio.mp3")
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)
    
    # Calculate duration using MoviePy's configured FFmpeg binary.
    with AudioFileClip(output_path) as audio:
        duration_ms = int(audio.duration * 1000)
    
    return {
        "scene_number": idx,
        "file_path": output_path,
        "duration_ms": duration_ms
    }
