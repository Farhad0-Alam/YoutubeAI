import os
import re

# Graceful fallback — edge_tts requires aiohttp which may be broken
try:
    import edge_tts
    EDGE_TTS_AVAILABLE = True
except ImportError:
    edge_tts = None
    EDGE_TTS_AVAILABLE = False

from backend.config.settings import settings

async def generate_speech(text, voice, idx):
    if not EDGE_TTS_AVAILABLE:
        raise RuntimeError(
            "edge-tts is unavailable (aiohttp dependency is broken). "
            "Use 'Grok Voice + Video' mode instead — it generates voice inside the video clip."
        )

    try:
        from moviepy.editor import AudioFileClip
    except ImportError:
        raise RuntimeError("moviepy is not installed. Cannot calculate audio duration.")

    output_path = os.path.join(settings.TEMP_DIR, f"scene_{idx}_audio.mp3")

    # Strip emotion tags like [excited] and stage directions like (Pauses)
    clean_text = re.sub(r'\[.*?\]|\(.*?\)', '', text).strip()
    clean_text = re.sub(r'\s+', ' ', clean_text)

    communicate = edge_tts.Communicate(clean_text, voice)
    await communicate.save(output_path)

    with AudioFileClip(output_path) as audio:
        duration_ms = int(audio.duration * 1000)

    return {
        "scene_number": idx,
        "file_path": output_path,
        "duration_ms": duration_ms
    }
