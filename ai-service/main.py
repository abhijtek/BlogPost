from fastapi import FastAPI 

from routes.chat import router as ChatRouter
from routes.ingestion import router as ingestionRouter
app = FastAPI()

app.include_router(ChatRouter)
app.include_router(ingestionRouter)    

@app.get("/")
async def root():
    return {"message":"Ai service is running"}



    
            