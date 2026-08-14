from pydantic import BaseModel

class chatReq(BaseModel):
    blog_id: str
    session_id: str
    message: str