from pydantic import BaseModel
from typing import Optional

class TranslationRequest(BaseModel):
    content: str
    target_language: str = "Urdu" # Default target language as per spec

class TranslationResponse(BaseModel):
    translated_content: str
