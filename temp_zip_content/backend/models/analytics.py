from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from typing import Optional
from backend.models.project import PyObjectId

class AnalyticsModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    event_type: str
    niche_id: str
    project_id: Optional[PyObjectId] = None
    render_seconds: Optional[int] = 0
    video_duration_seconds: Optional[int] = 0
    metadata: dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
