from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from backend.database.postgres import get_session
from backend.database.models import Project

router = APIRouter()

class ProjectCreate(BaseModel):
    title: Optional[str] = "Untitled"
    niche_id: str
    topic: str
    script_style: Optional[str] = "documentary"
    visual_style: Optional[str] = "cinematic"
    duration_minutes: Optional[float] = 5.0
    scene_length: Optional[int] = 15
    ai_model: Optional[str] = None
    llm_model: Optional[str] = "groq"
    voice: Optional[str] = "en-US-AriaNeural"
    aspect_ratio: Optional[str] = "16:9"
    status: Optional[str] = "draft"
    script_data: Optional[dict] = None
    scenes_data: Optional[list] = None
    settings: Optional[dict] = None

@router.get("/projects")
async def list_projects(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    projects = result.scalars().all()
    return [p.to_dict() for p in projects]

@router.post("/projects")
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_session)):
    project = Project(**data.dict())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return {"_id": str(project.id)}

@router.get("/projects/{project_id}")
async def get_project(project_id: str, db: AsyncSession = Depends(get_session)):
    from uuid import UUID
    try:
        uid = UUID(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID format")
    result = await db.execute(select(Project).where(Project.id == uid))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.to_dict()

@router.patch("/projects/{project_id}")
async def update_project(project_id: str, data: dict, db: AsyncSession = Depends(get_session)):
    from uuid import UUID
    uid = UUID(project_id)
    result = await db.execute(select(Project).where(Project.id == uid))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in data.items():
        if hasattr(project, key):
            setattr(project, key, value)
    await db.commit()
    return {"status": "updated"}

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, db: AsyncSession = Depends(get_session)):
    from uuid import UUID
    uid = UUID(project_id)
    await db.execute(delete(Project).where(Project.id == uid))
    await db.commit()
    return {"status": "deleted"}
