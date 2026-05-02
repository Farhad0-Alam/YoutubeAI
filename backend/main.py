from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.mongodb import connect_to_mongo, close_mongo_connection
from backend.routes import script, media, tts, thumbnail, render, projects, videos

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
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

app.include_router(script.router, prefix="/api")
app.include_router(media.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(thumbnail.router, prefix="/api")
app.include_router(render.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(videos.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
