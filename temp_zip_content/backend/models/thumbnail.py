from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from typing import Optional
from backend.models.project import PyObjectId

class ThumbnailModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    project_id: PyObjectId
    file_path: str
    title_text: str
    subtitle_text: str
    niche_id: str
    style_config: dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
