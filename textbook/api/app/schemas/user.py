from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserProfileCreate(BaseModel):
    software_background: Optional[str] = Field(None, description="User's software development experience (e.g., 'beginner', 'intermediate', 'expert', 'none')")
    hardware_background: Optional[str] = Field(None, description="User's hardware/robotics experience (e.g., 'beginner', 'intermediate', 'expert', 'none')")

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    software_background: Optional[str] = Field(None, description="User's software development experience (e.g., 'beginner', 'intermediate', 'expert', 'none')")
    hardware_background: Optional[str] = Field(None, description="User's hardware/robotics experience (e.g., 'beginner', 'intermediate', 'expert', 'none')")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[EmailStr] = None

class UserProfileResponse(UserProfileCreate):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserResponse(BaseModel): # Simplified from previous UserResponse
    id: int
    email: EmailStr
    is_active: bool
    profile: Optional[UserProfileResponse] = None

    class Config:
        orm_mode = True
