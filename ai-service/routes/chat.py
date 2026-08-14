from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import chat_with_blog
router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    blog_id: str
    message: str
    history: list[ChatMessage] = []
    
@router.post("/chat")
async def chat(data: ChatRequest):
    answer  = await chat_with_blog(
        blog_id = data.blog_id,
        message  = data.message,
        history = data.history
    )    
    return {
        "answer":answer
    }