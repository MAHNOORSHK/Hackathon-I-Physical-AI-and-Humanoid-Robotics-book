from typing import Annotated # Import Annotated
from fastapi import APIRouter, Depends
from api.app.models.translate import TranslationRequest, TranslationResponse
from api.app.services.ai_service import AIService
from api.app.core.config import settings
from api.app.core.security import get_current_user # To ensure user is authenticated
from app.models.user_db import User # Import User ORM model

router = APIRouter()

def get_ai_service():
    return AIService(openai_api_key=settings.OPENAI_API_KEY)

@router.post("/content", response_model=TranslationResponse)
async def translate_content(
    request: TranslationRequest,
    ai_service: AIService = Depends(get_ai_service),
    current_user: Annotated[User, Depends(get_current_user)] # Ensures user is logged in
):
    translated_text = ai_service.translate_content(
        content=request.content,
        target_language=request.target_language
    )
    return TranslationResponse(translated_content=translated_text)
