from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database.postgres import init_db, close_db
from backend.config.settings import settings
from backend.routes import script, media, tts, thumbnail, render, projects, videos
import os

app = FastAPI(title="YouTube Faceless Video Maker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

# Ensure output/temp directories exist
os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs(settings.VIDEOS_DIR, exist_ok=True)
os.makedirs(settings.THUMBNAILS_DIR, exist_ok=True)

app.include_router(script.router, prefix="/api")
app.include_router(media.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(thumbnail.router, prefix="/api")
app.include_router(render.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(videos.router, prefix="/api")

# Serve generated files statically
app.mount("/outputs", StaticFiles(directory=settings.OUTPUT_DIR), name="outputs")
app.mount("/temp", StaticFiles(directory=settings.TEMP_DIR), name="temp")

@app.get("/health")
def health_check():
    return {"status": "ok", "database": "postgresql"}
