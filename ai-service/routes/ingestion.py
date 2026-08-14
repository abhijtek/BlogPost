from fastapi import APIRouter
from services.ingestion_service import ( ingest_all_posts,ingest_post, delete_post)
router = APIRouter()

@router.post("/ingest/all")
async def ingest_all():
    res = await ingest_all_posts()
    return res

@router.post("/ingest/{slug}")
async def ingest_one(slug:str):
    res = await ingest_post(slug)
    return res

@router.delete("/ingest/{slug}")
async def delete_one(slug:str):
    res = await delete_post(slug)
    return res