import os
from dotenv import load_dotenv

try:
    import imageio_ffmpeg
except ImportError:
    imageio_ffmpeg = None

load_dotenv(override=True)
print(f"DEBUG: Using DATABASE_URL={os.getenv('DATABASE_URL')}")

if imageio_ffmpeg:
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    os.environ.setdefault("IMAGEIO_FFMPEG_EXE", ffmpeg_exe)
    os.environ.setdefault("FFMPEG_BINARY", ffmpeg_exe)

class Settings:
    # Script Generation APIs
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NEXT_PUBLIC_OPENAI_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    XAI_API_KEY = os.getenv("XAI_API_KEY")
    SEEDANCE_API_KEY = os.getenv("SEEDANCE_API_KEY")
    
    # Media APIs
    PEXELS_API_KEY = os.getenv("PEXELS_API_KEY") or os.getenv("NEXT_PUBLIC_PEXELS_API_KEY")
    PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY")
    
    # Database
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./youtubeai.db"
    )
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./outputs")
    TEMP_DIR = os.path.join(OUTPUT_DIR, "temp")
    VIDEOS_DIR = os.path.join(OUTPUT_DIR, "videos")
    THUMBNAILS_DIR = os.path.join(OUTPUT_DIR, "thumbnails")

settings = Settings()

# Ensure directories exist
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs(settings.VIDEOS_DIR, exist_ok=True)
os.makedirs(settings.THUMBNAILS_DIR, exist_ok=True)
