"""
SQLAlchemy ORM models for PostgreSQL.
Tables: projects, render_jobs
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from backend.database.postgres import Base


class Project(Base):
    __tablename__ = "projects"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title           = Column(String(500), nullable=False, default="Untitled")
    niche_id        = Column(String(100), nullable=False)
    topic           = Column(Text, nullable=False)
    script_style    = Column(String(100))
    visual_style    = Column(String(100))
    duration_minutes= Column(Integer, default=5)
    scene_length    = Column(Integer, default=15)
    ai_model        = Column(String(50))
    llm_model       = Column(String(50), default="groq")
    voice           = Column(String(100))
    aspect_ratio    = Column(String(20), default="16:9")
    status          = Column(String(50), default="draft")
    script_data     = Column(JSON, nullable=True)
    scenes_data     = Column(JSON, nullable=True)
    settings        = Column(JSON, nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "_id":              str(self.id),
            "title":            self.title,
            "niche_id":         self.niche_id,
            "topic":            self.topic,
            "script_style":     self.script_style,
            "visual_style":     self.visual_style,
            "duration_minutes": self.duration_minutes,
            "scene_length":     self.scene_length,
            "ai_model":         self.ai_model,
            "llm_model":        self.llm_model,
            "voice":            self.voice,
            "aspect_ratio":     self.aspect_ratio,
            "status":           self.status,
            "script_data":      self.script_data,
            "scenes_data":      self.scenes_data,
            "settings":         self.settings,
            "created_at":       self.created_at.isoformat() if self.created_at else None,
            "updated_at":       self.updated_at.isoformat() if self.updated_at else None,
        }


class RenderJob(Base):
    __tablename__ = "render_jobs"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id  = Column(String(200), nullable=False)
    status      = Column(String(50), default="queued")   # queued | running | completed | failed
    progress    = Column(Integer, default=0)
    message     = Column(Text, default="Render queued...")
    video_path  = Column(Text, nullable=True)
    file_size_mb= Column(Float, nullable=True)
    error       = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "job_id":       str(self.id),
            "project_id":   self.project_id,
            "status":       self.status,
            "progress":     self.progress,
            "message":      self.message,
            "video_path":   self.video_path,
            "file_size_mb": self.file_size_mb,
            "error":        self.error,
        }
