from typing import Annotated
from fastapi import APIRouter, Depends
from app.models.translate import TranslationRequest, TranslationResponse
from app.services.ai_service import AIService
from app.core.config import settings
from app.core.security import get_current_user
from app.models.user_db import User

router = APIRouter()

def get_ai_service():
    return AIService(groq_api_key=settings.GROQ_API_KEY)

@router.post("/content", response_model=TranslationResponse)
async def translate_content(
    request: TranslationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    ai_service: AIService = Depends(get_ai_service),
):
    translated_text = ai_service.translate_content(
        content=request.content,
        target_language=request.target_language
    )
    return TranslationResponse(translated_content=translated_text)
