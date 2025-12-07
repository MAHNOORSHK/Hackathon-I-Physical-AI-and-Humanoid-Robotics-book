from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.app.models.personalize import PersonalizationRequest, PersonalizationResponse
from api.app.services.ai_service import AIService
from api.app.core.config import settings
from api.app.core.security import get_current_user # Use the updated get_current_user
from app.db.session import get_db
from app.models.user_db import User # Import the ORM User model

router = APIRouter()

def get_ai_service():
    return AIService(openai_api_key=settings.OPENAI_API_KEY)

@router.post("/content", response_model=PersonalizationResponse)
async def personalize_content(
    request: PersonalizationRequest,
    ai_service: AIService = Depends(get_ai_service),
    current_user: Annotated[User, Depends(get_current_user)], # Inject the User ORM object
):
    if not current_user.profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

    personalized_text = ai_service.personalize_content(
        content=request.content,
        software_background=current_user.profile.software_background,
        hardware_background=current_user.profile.hardware_background
    )
    return PersonalizationResponse(personalized_content=personalized_text)