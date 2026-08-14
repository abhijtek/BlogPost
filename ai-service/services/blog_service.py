import os
import httpx
from dotenv import load_dotenv
load_dotenv()
base_url = os.getenv("EXPRESS_BASE_URL")

async def get_all_posts():
    print(base_url)
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{base_url}/api/v1/blogs/posts")
        res.raise_for_status()
        return res.json()
    
    
async def get_post_by_slug(slug: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{base_url}/api/v1/blogs/posts/{slug}")
        res.raise_for_status()
        return res.json()
    
        