from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Scene(BaseModel):
    scene_number: int
    duration_seconds: int
    narration: str
    text_overlay: str
    visual_description: str
    search_keyword: str
    image_prompt: str
    transition: str
    media_url: Optional[str] = None
    media_type: Optional[str] = None

class ScriptData(BaseModel):
    title: str
    description: str
    tags: List[str]
    hook: str
    cta: str
    scenes: List[Scene]
    total_duration_seconds: int

class ProjectModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    niche_id: str
    topic: str
    script_style: str
    duration_minutes: int
    voice: str
    status: str = "draft"
    script_data: Optional[ScriptData] = None
    scenes_data: Optional[List[Scene]] = []
    settings: dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
