from fastapi import APIRouter
from backend.database.mongodb import get_database
from backend.models.project import ProjectModel
from bson import ObjectId

router = APIRouter()

@router.get("/projects")
async def list_projects():
    db = get_database()
    projects = await db.projects.find().to_list(100)
    for p in projects:
        p["_id"] = str(p["_id"])
    return projects

@router.post("/projects")
async def create_project(project: ProjectModel):
    db = get_database()
    result = await db.projects.insert_one(project.dict(by_alias=True, exclude={"id"}))
    return {"_id": str(result.inserted_id)}

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    db = get_database()
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    if project:
        project["_id"] = str(project["_id"])
    return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    db = get_database()
    await db.projects.delete_one({"_id": ObjectId(project_id)})
    return {"status": "deleted"}
