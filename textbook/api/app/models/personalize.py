from pydantic import BaseModel
from typing import Optional

class PersonalizationRequest(BaseModel):
    content: str

class PersonalizationResponse(BaseModel):
    personalized_content: str
