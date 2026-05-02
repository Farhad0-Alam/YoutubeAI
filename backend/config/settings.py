import os
from dotenv import load_dotenv

try:
    import imageio_ffmpeg
except ImportError:
    imageio_ffmpeg = None

load_dotenv()

if imageio_ffmpeg:
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    os.environ.setdefault("IMAGEIO_FFMPEG_EXE", ffmpeg_exe)
    os.environ.setdefault("FFMPEG_BINARY", ffmpeg_exe)

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
    PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY")
    
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "ytv_maker")
    
    TEMP_DIR = os.getenv("TEMP_DIR", "./temp")
    OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./outputs")
    VIDEOS_DIR = os.path.join(OUTPUT_DIR, "videos")
    THUMBNAILS_DIR = os.path.join(OUTPUT_DIR, "thumbnails")

settings = Settings()

# Ensure directories exist
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs(settings.VIDEOS_DIR, exist_ok=True)
os.makedirs(settings.THUMBNAILS_DIR, exist_ok=True)
