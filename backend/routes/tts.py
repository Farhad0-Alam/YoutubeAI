from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class TTSScene(BaseModel):
    scene_number: int
    narration: str

class TTSRequest(BaseModel):
    voice: str
    scenes: List[TTSScene]

@router.post("/tts")
async def generate_tts(req: TTSRequest):
    from backend.services.tts_service import generate_speech
    results = []

    for scene in req.scenes:
        try:
            result = await generate_speech(scene.narration, req.voice, scene.scene_number)
            results.append(result)
        except Exception as e:
            print(f"TTS Error for scene {scene.scene_number}: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    return {"audio_files": results}

@router.get("/voices")
def get_voices():
    voices = [
        {"id": "en-US-GuyNeural", "name": "Guy", "gender": "Male", "accent": "US", "label": "Professional Male"},
        {"id": "en-US-AriaNeural", "name": "Aria", "gender": "Female", "accent": "US", "label": "Confident Female"},
        {"id": "en-US-JennyNeural", "name": "Jenny", "gender": "Female", "accent": "US", "label": "Warm Female"},
        {"id": "en-US-DavisNeural", "name": "Davis", "gender": "Male", "accent": "US", "label": "Casual Male"},
        {"id": "en-GB-RyanNeural", "name": "Ryan", "gender": "Male", "accent": "UK", "label": "British Male"},
        {"id": "en-GB-SoniaNeural", "name": "Sonia", "gender": "Female", "accent": "UK", "label": "British Female"},
        {"id": "en-AU-WilliamNeural", "name": "William", "gender": "Male", "accent": "AU", "label": "Australian Male"},
        {"id": "en-CA-LiamNeural", "name": "Liam", "gender": "Male", "accent": "CA", "label": "Canadian Male"},
        {"id": "en-IN-NeerjaNeural", "name": "Neerja", "gender": "Female", "accent": "IN", "label": "Indian Female"},
        {"id": "en-US-TonyNeural", "name": "Tony", "gender": "Male", "accent": "US", "label": "Formal Male"}
    ]
    return voices
