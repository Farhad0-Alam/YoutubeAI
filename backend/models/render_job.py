from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from typing import Optional
from backend.models.project import PyObjectId

class RenderJobModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    project_id: PyObjectId
    status: str = "queued"  # queued, running, completed, failed
    progress: int = 0
    current_step: str = ""
    error_message: Optional[str] = None
    settings: dict = {}
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
