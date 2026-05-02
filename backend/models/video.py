from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from typing import Optional
from backend.models.project import PyObjectId

class VideoModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    project_id: PyObjectId
    file_path: str
    file_name: str
    thumbnail_path: Optional[str] = None
    duration_seconds: int
    file_size_mb: float
    resolution: str
    render_duration_sec: int
    niche_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
