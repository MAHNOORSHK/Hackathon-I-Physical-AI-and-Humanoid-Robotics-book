from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

class ContextChatRequest(BaseModel):
    query: str
    context: str
