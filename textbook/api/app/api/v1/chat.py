from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session # Import Session
from api.app.services.rag_service import RAGService
from api.app.core.config import settings
from api.app.models.chat import ChatRequest, ChatResponse, ContextChatRequest
from api.app.db.session import get_db # Import get_db
from api.app.models.chat_db import ChatHistory # Import ChatHistory

router = APIRouter()

# Initialize RAGService (can be improved with dependency injection for testing/lifecycle management)
def get_rag_service():
    return RAGService(
        openai_api_key=settings.OPENAI_API_KEY,
        qdrant_host=settings.QDRANT_HOST,
        qdrant_api_key=settings.QDRANT_API_KEY
    )

@router.post("/query", response_model=ChatResponse)
async def query_chatbot(
    request: ChatRequest,
    rag_service: RAGService = Depends(get_rag_service),
    db: Session = Depends(get_db) # Add db dependency
):
    response_content = rag_service.query(request.query)

    # Save to chat history
    chat_entry = ChatHistory(user_query=request.query, chatbot_response=response_content)
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)

    return ChatResponse(response=response_content)

@router.post("/query_context", response_model=ChatResponse)
async def query_chatbot_with_context(
    request: ContextChatRequest,
    rag_service: RAGService = Depends(get_rag_service),
    db: Session = Depends(get_db) # Add db dependency
):
    response_content = rag_service.query_with_context(request.query, request.context)

    # Save to chat history
    chat_entry = ChatHistory(user_query=request.query, chatbot_response=response_content)
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)

    return ChatResponse(response=response_content)
